const User = require('../models/User')
const Exam = require('../models/Exam')
const jwt = require('jsonwebtoken')
const payment = require('../services/payment')


const token_secrect = 'LVeKzFIE8WwhaBpKITdyMSDKbQMPFI4g'

module.exports.startPayment = async (req, res) => {
    try {
        const result = await payment.cowpay_init_and_auth({});
        res.json({success: true, token: result.data.token})    
    } catch (error) {
        res.json({success: false})
    }
}


module.exports.book_exam = async (req, res) => {
    // assume that the user has paid for exam and is now registered in db
    // req should also contain the id, or any user identification

    try{
        // ////check if the user didn't already book before
        // ///add payment and other stuff
        // /// will need to add a function to remove the exam from user
        const token = req.cookies.jwt;

        if(token){

            jwt.verify(token, token_secrect, async (err, decodedToken)=>{

                try{
                    if(err){
                        console.log(err.message);
                        throw "bad cookies"
                    }else{
                        console.log(decodedToken._id);
                        const viableRequest = await User.checkViability(req.body.exam, decodedToken._id);
                        if(!viableRequest){
                            throw "not a viable request"
                        }
                        const result = await User.bookExam(req.body.exam, decodedToken._id)
                        res.json({success: result});
                    }
                }catch(err){
                    console.log(err);
                    res.json({success: false})
                }
            }
            )

        }else{
            throw "bad cookies"
        }
    }catch(err){
        console.log(err);
        res.json({success:false})

    }
}


