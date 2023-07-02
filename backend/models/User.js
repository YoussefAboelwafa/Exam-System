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
    // _id: {type: Number, index: true, unique: true, index: true},
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
            {type: {
                _id: {type: mongoose.Schema.Types.ObjectId, required: true},
                day: { type: mongoose.Schema.Types.ObjectId, ref: 'day' },
                location: {type: mongoose.Schema.Types.ObjectId, ref: 'location'},
                appointment: {type: String, required: true},
                snack: {type: String, required: true},
                percentage: {type: Number, required: true}
            }, required: true},
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
    try{
        const {location_id, day_id, exam_id, snack, appointment} = exam


        const [location, day] = await Promise.all([
            Location.findOne({_id: location_id}),
            Day.findOne({_id: day_id})
        ])
        if(day.reserved_number >= location.max_number){
            throw "This day is already full"
        }
        await Promise.all[
            await Day.updateOne({_id: day._id}, 
                {reserved_number: day.reserved_number + 1
                ,$push: userId}, {
                new :true
            }),
            await User.updateOne({_id: userId}, {
                $push:{
                    _id: exam_id,
                    appointment: appointment,
                    snack: snack,
                    percentage: -1,
                    place_and_time_id: day_id
                }
            }) 
        ]
        return true;
    }catch(err){
        console.log(`Error in updating exam ${userId}`);
        return false;
    }
    
}


const User = mongoose.model('user', userSchema);

module.exports = User;