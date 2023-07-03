const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const sequence = require('mongoose-sequence')(mongoose);
const {Location, Day} = require('./TimeAndSpace')
const Exam = require('./TimeAndSpace')

const characterSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const idLength = 8;

const generateRandomCode = ()=> {
    let userCode = '';
    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characterSet.length);
      userCode += characterSet[randomIndex];
    }
    console.log(Buffer.byteLength(userCode, 'utf8'));
    return userCode;
  }
  


const userSchema = new mongoose.Schema({
    // _id: {type: Number, index: true, unique: true, index: true}, //use later for generating the 8 chars code
    /*
        but don't forget to add a handler to handle duplicate ids
    */
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    country: {type: String, required: true},
    photo: {type: String, default: null}, ////leave for later
    city: {type: String, required: true},
    phone_namber: {type: String, required: true, unique: true, index: true},
    email: {
        type: String,
        required: [true, 'Email required'],
        index: true,  /////// left from here
        unique: true,
        lowercase: true
    },
    password: {type: String, required: [true, 'password required']},
    exams: {
        type: [
            { exam: {type: {
                    _id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'exam'},
                    day: { type: mongoose.Schema.Types.ObjectId, ref: 'day' },
                    location: {type: mongoose.Schema.Types.ObjectId, ref: 'location'},
                    appointment: {type: String, required: true},
                    snack: {type: String, required: true},
                    percentage: {type: Number, required: true}
                }, required: true},
            }
        ],
        default: []
    }
})

// userSchema.plugin(sequence, { inc_field: '_id', start_seq: 1 })

/// trust that the front will check the email before sending
////add the rest of information like exams taken and so on and so forth
///and most of that information will probably be on the form of foreign keys


userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.post('save', function(doc, next){
    console.log('after saving', this);
    next();
});


userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw Error("Email incorrect");
    let auth = await bcrypt.compare(password, user.password);
    if(auth){
        return user;
    }
    throw Error("Password incorrect");
}


userSchema.statics.bookExam = async function(exam, userId){
    const session = await this.startSession();
    session.startTransaction();
    try{
        const {location_id, day_id, exam_id, snack, appointment} = exam

        ////change to $inc for atomicity on the db side
        

        const [location, day, user] = await Promise.all([
            Location.findOne({ _id: location_id }).session(session),
            Day.findOne({ _id: day_id }).session(session),
            User.findById({_id: userId})
          ]);

        
        if(!user || day.reserved_number >= location.max_number){
            throw "This day is already full"
        }
        await Promise.all([
            Day.updateOne(
              { _id: day._id },
              {$inc: { reserved_number: 1 },
                $push: { userId: userId }},
              { session }
            ),
            User.updateOne(
              { _id: userId },
              {$push: {exams: { exam:{
                    _id: exam_id,
                    appointment,
                    snack,
                    percentage: -1,
                    location: location_id,
                    day: day_id}
                  }}
                },
              { session }
            )
          ]);
        await session.commitTransaction();
        session.endSession();
        return true;
    }catch(err){
        await session.abortTransaction();
        session.endSession();

        console.log(err);
        return false;
    }
    
}


const User = mongoose.model('user', userSchema);

module.exports = User;