const User = require('../models/User')
const Exam = require('../models/Exam')
const casual = require('casual');

const payment = (req, res) => {
    console.log('payment succeeded');
}


module.exports.getHome = async (req, res) => {
    try{
        const user = await User.findById(req.body.id).select({first_name: 1, last_name: 1, exams: 1, _id: 1});

        const exam_ids = user.exams.map((elem)=>elem.exam._id);

        const exam_titles = (await Exam.find({ _id: { $in: exam_ids } }).select('title')).map((elem) => elem.title);
        
        const other_exam = await Exam.findOne({ _id: { $nin: exam_ids } }).select('title info');
        console.log(user);
        res.json({user: user, other_exam: other_exam, user_exam_titles: exam_titles});
    }catch(err){
        console.log(err);
        res.json(err);
    }
}

module.exports.getOtherExams = async (req, res) => {
    ///assume req holds only
    // req should also contain the ids of the taken and upcoming exams
    try{
        const exams = await Exam.find({ _id: { $nin: req.body.ids } }).select('title info about');
        res.json(exams);
    }catch(err){
        console.log(err);
        res.json(err);
    }
}



module.exports.populate_exams = async (req, res) =>{
    try{
        res.send('populate')
        for (let i = 0; i < 100; i++) {
            const entry = {
                title: casual.title,
                date: casual.date('YYYY-MM-DD'),
                booked_users: [],
                max_number: casual.integer(1, 100),
                about: casual.sentences(3),
                info: [casual.word, casual.word]
            };
            await Exam.create(entry)
            console.log(entry);
        }
    }catch(err){
        res.send('errrrrrrrrrrrrr')
        console.log(err);
    }
}