const User = require('../models/User')
const Exam = require('../models/Exam')
const casual = require('casual');
const jwt = require('jsonwebtoken');


const payment = (req, res) => {
    console.log('payment succeeded');
}




module.exports.getHome = async (req, res) => {
    try{
        const token = req.cookies.jwt;

        if(token){
            jwt.verify(token, 'example secret', async (err, decodedToken)=>{

                if(err){
                    console.log(err.message);
                    res.json({signed_in: false});
                }else{
                    const user = await User.findById(decodedToken.id).select({first_name: 1, last_name: 1, exams: 1, _id: 1});

                    const exam_ids = user.exams.map((elem)=>elem.exam._id);

                    const token_exam_info = (await Exam.find({ _id: { $in: exam_ids } }).select('title info about')).map((elem) => ({title: elem.title, about:elem.about,info:elem.info}));
                    
                    const other_exam = await Exam.findOne({ _id: { $nin: exam_ids } }).select('title info about');

                    console.log(user);
                    res.json({user: user, token_exam_info, other_exam: other_exam});

                }
            })
        }else{
            res.json({signed_in: false});
        }
    }catch(err){
        console.log(err);
        res.json({signed_in: false});
    }
   
}

module.exports.getOtherExams = async (req, res) => {
    ///assume req holds only
    // req should  also contain the ids of the taken and upcoming exams
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
        for (let i = 0; i < 5; i++) {
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








