const User = require('../models/User')
const Exam = require('../models/Exam')


const payment = (req, res) => {
    console.log('payment succeeded');
}

module.exports.getOtherExams = async (req, res) => {
    ///assume req holds only
    // req should also contain the ids of the taken and upcoming exams
    try{
        const other_exams = await Exam.find({ _id: { $nin: excludedIds } });
        const to_be_sent = other_exams.map((exam) => ({
            id: exam._id,
            title: exam.title,
            info: exam.info
        }))

    }catch(err){
        console.log(err);
        res.json(err);
    }
}


module.exports.getHome = async (req, res) => {
    try{
        const user = User.findById(req.id).select({first_name: 1, last_name: 1, exams: 1});
        

    }catch(err){
        console.log(err);
        res.json(err);
    }
}
