const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {Location, Day} = require('./TimeAndSpace')
const Exam = require('./Exam')
const _ = require('lodash');
const Topic = require('./TopicAndQuestion')
const SavedExam = require('./SavedExam')

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
                    appointment: {type: String, required: true}, /// remove later, not needed
                    snack: {type: String, required: true},
                    percentage: {type: Number, required: true},
                    bookedAt: {type:String, required: true},
                    saved_exam: {type: mongoose.Schema.Types.ObjectId, default: null}
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


        const [location, day, user, exam] = await Promise.all([
            Location.findOne({ _id: location_id }),
            Day.findOne({ _id: day_id }),
            User.findById({_id: userId}),
            Exam.findOne({_id: exam_id, status: true, deleted: false})
          ]);

        console.log(location, day, user, exam);
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


const generateExam = async (exam_id) => {
    try {
        const exam = await Exam.findById(exam_id, 'topics title').populate({
                path: 'topics'
            })
        if(!exam)
            throw "The code provided doesn't match any of the user's exam"

        const mcq = exam.topics.flatMap((topic) => _.sampleSize(topic.mcq, topic.num_of_mcq)) //////////////// stopped here continue from here 7/18 9:04pm
        const coding = exam.topics.flatMap((topic) => _.sampleSize(topic.coding, topic.num_of_coding))
        console.log(exam);
        // const populated_exam = await Topic.get_mcq_and_coding({mcq_ids:mcq, coding_ids:coding})
        return {title:exam.title, mcq:mcq, coding:coding};
    } catch (error) {
        console.log(error);
        throw error
    }
}

userSchema.statics.getExam = async (data) => {
    try {
        const {user_id, exam_id} = data;
        // const user = await User.findOne({_id:user_id, 'exams.exam._id': exam_id}, { 'exams.$.exam.saved_exam': 1 })
        const user = await User.aggregate([
            {
              $match: { _id: new mongoose.Types.ObjectId(user_id) }
            },
            {
              $project: {
                exams: {
                  $filter: {
                    input: '$exams',
                    as: 'exam',
                    cond: { $eq: ['$$exam.exam._id', new mongoose.Types.ObjectId(exam_id)] }
                  }
                }
              }
            }
          ])
        if(!user.length === 0)
			throw "User not found"
        
    	if(user[0].exams.length === 0)
		  	throw "User doesn't have such an exam"

        if(!user[0].exams[0].exam.saved_exam){
            let generated_exam = await generateExam(exam_id)
            let saved_exam = new SavedExam(
				{exam_id: exam_id,
				mcq: generated_exam.mcq.map((mcq) => ({question:mcq, user_answer:''})),
				coding: generated_exam.coding.map((coding) => ({question:coding}))});

            let [,exam] = await Promise.all([
				User.updateOne({_id: user_id, 'exams.exam._id': exam_id},
				{$set:{'exams.$.exam.saved_exam': saved_exam._id}}),
				saved_exam.save().then(async (savedExam) =>  {
					return await SavedExam.populate(savedExam, [
					  { path: 'mcq.question', select: '-answer -__v' },
					  { path: 'coding.question', select: '-input -output -__v' }
					]);
				})
			])

			return {_id: exam._id, 
					mcq: exam.mcq, 
					coding: exam.coding,
					title: generated_exam.title,
					appointment: user[0].exams[0].exam.appointment
				}
        }

		console.log('hello world');
		let [exam, title] = await Promise.all([
			SavedExam.findById(user[0].exams[0].exam.saved_exam, '-exam_id -mcq._id -coding._id -__v').populate([
			{path: 'mcq.question', select: '-answer -__v'},
			{path: 'coding.question', select:'-input -output -__v'}]),
			Exam.findById(exam_id, '-_id title')
		]);

		exam.title = title.title
		exam.appointment = user[0].exams[0].exam.appointment
		return {_id: exam._id, 
			mcq: exam.mcq, 
			coding: exam.coding,
			title: title.title,
			appointment: user[0].exams[0].exam.appointment
		}
        
    } catch (error) {
        console.log(error);
        throw error
    }
}





const User = mongoose.model('user', userSchema);

module.exports = User;