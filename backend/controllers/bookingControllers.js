const User = require('../models/User')
const Exam = require('../models/Exam')


const payment = (req, res) => {
    console.log('payment succeeded');
}



module.exports.book_exam = async (req, res) => {
    // assume that the user has paid for exam and is now registered in db
    // req should also contain the id, or any user identification

    try{
        ////check if the user didn't already book before
        ///add payment and other stuff
        /// will need to add a function to remove the exam from user
        let startTime = Date.now();
        const token = req.cookies.jwt;

        if(token){
            let startTime = Date.now();
            jwt.verify(token, 'example secret', async (err, decodedToken)=>{
                if(err){
                    console.log(err.message);
                    res.json({signed_in: false});
                }else{
                    console.log(decodedToken._id);
                    res.json({success: await User.bookExam(req.body.exam, decodedToken._id)})
                }
            })
        }else{
            res.json({signed_in: false});
        }
    }catch(err){
        console.log(err);
        res.json(err)
    }
}


