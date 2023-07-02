const User = require('../models/User')
const Exam = require('../models/Exam')


const payment = (req, res) => {
    console.log('payment succeeded');
}



module.exports.book_exam = async (req, res) => {
    // assume that the user has paid for exam and is now registered in db
    // req should also contain the id, or any user identification

    try{

        ///add payment and other stuff
        /// will need to add a function to remove the exam from user
        await User.bookExam(req.body.exam, req.body.userId)
    }catch(err){
        console.log(err);
        res.json(err)
    }
}


