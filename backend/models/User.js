const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {Location, Day} = require('./TimeAndSpace')
const Exam = require('./Exam')
const _ = require('lodash');


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
    // _id: {type: String, index: true, unique: true, default: generateRandomCode}, //use later for generating the 8 chars code
    /*
        but don't forget to add a handler to handle duplicate ids
    */
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    country: {type: String, required: true},
    photo: {type: String, default: null}, ////leave for later
    city: {type: String, required: false}, ////leave for later
    phone_namber: {type: String, required: true, unique: true, index: true},
    email: {
        type: String,
        required: [true, 'Email required'],
        index: true,  /////// left from here
        unique: true,
        lowercase: true
    },
    password: {type: String, required: [true, 'password required']},
    last_booking_time: {type: String, default: null},
    exams: {
        type: [
            { exam: {type: {
                    _id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'exam'},
                    day: { type: mongoose.Schema.Types.ObjectId, ref: 'day' },
                    location: {type: mongoose.Schema.Types.ObjectId, ref: 'location'},
                    appointment: {type: String, required: true},
                    snack: {type: String, required: true},
                    percentage: {type: Number, required: true},
                    bookedAt: {type:String, required: true},
                    code: {type: String, default:generateRandomCode}
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



userSchema.statics.checkViability = async (exam_data, userId) =>{
    try {
        ////not the best or most efficient way but good and safe for now
        ////will have to improve in next version
        const {day_id} = exam_data
        const [day, user] = await Promise.all([
            Day.findOne({ _id: day_id }),
            User.findById({_id: userId}).select('first_name last_name phone_namber email exams last_booking_time').populate('exams.exam.day')
          ]);
        
        if(!day || !user){
            throw "an error occurred"
        }
        
        if(user.exams.map((exam) => exam.exam.day.month_number + " " + exam.exam.day.day_number)
            .includes(day.month_number + " " + day.day_number)){
                throw "Can't book two exams in the same day"
        }
        console.log(user);
        return user
    } catch (error) {
        console.log(error);
        throw error
    }
        
    
}


userSchema.statics.bookExam = async function(exam_data, userId){
    const session = await this.startSession();
    session.startTransaction();
    try{
        const {location_id, day_id, exam_id, snack, appointment} = exam_data

        ////change to $inc for atomicity on the db side
        

        const [location, day, user, exam] = await Promise.all([
            Location.findOne({ _id: location_id }),
            Day.findOne({ _id: day_id }),
            User.findById({_id: userId}),
            Exam.findOne({_id: exam_id, status: true, deleted: false})
          ]);

        
        if(!user || !day || !location || !exam){
            throw "a problem occured"
        }

        const updated_day = await Day.findOneAndUpdate({_id: day_id, 
            reserved_number: { $lt: location.max_number }}
            ,{$inc: { reserved_number: 1 },
            $push: { reserved_users: userId }}
            ,{new: true});

        
        const updated_exam = await Exam.findOneAndUpdate({_id: exam_id, status:true, deleted:false}
            ,{$inc: { reserved_number: 1 }}
            ,{new: true})


        if(!updated_day || !updated_exam){
            throw "day doesn't exist or already full"
        }

        //improve to only one query using arrayfilters
        if(user.exams.map((exam) => exam.exam._id.toString()).includes(exam_id))
        {
            await User.updateOne(
                { _id: userId, 'exams.exam._id': exam_id },
                {$set: { 
                    'exams.$.exam.percentage': -1,
                    'exams.$.exam.appointment': appointment,
                    'exams.$.exam.snack': snack,
                    'exams.$.exam.location': location_id,
                    'exams.$.exam.day': day_id,
                 }}
            )
        }else{
            await User.updateOne({ _id: userId },
                {$push: {exams: { exam:{
                    _id: exam_id,
                    appointment:appointment,
                    snack:snack,
                    percentage: -1,
                    location: location_id,
                    day: day_id}
                    }}
                }
            )
        }



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

userSchema.statics.getExam = async (data) => {
    try {
        const {code, user_id} = data;
        const user = await User.findById(user_id, 'exams');
        if(!user)
            throw "User not found"
        
        const exam = user.exams.find((exam) => exam.exam.code === code);
        if(!exam)
            throw "The code provided doesn't match any of the user's exam"
        console.log(exam);
        const populated_exam = await Exam.populate(exam, {
            path: 'exam._id',
            populate:{
                path:'topics'
            }
        })
        
        console.log(populated_exam);
        return populated_exam
    } catch (error) {
        console.log(error);
        throw error
    }
}





const User = mongoose.model('user', userSchema);

module.exports = User;