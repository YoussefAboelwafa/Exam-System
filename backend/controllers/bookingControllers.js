const User = require('../models/User')
const jwt = require('jsonwebtoken')
const payment = require('../services/payment')


module.exports.startPayment = async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if(token){

            jwt.verify(token, process.env.token_secret, async (err, decodedToken)=>{

                try{
                    if(err){
                        console.log(err.message);
                        throw "bad cookies"
                    }else{
                        const user = await User.checkViability(req.body.exam, decodedToken._id)
                        if(!user){
                            throw "not a viable request, no money was taken yet"
                        }
                        const result = await payment.start_payment(user, req.body.exam);
                        if(!result){
                            throw 'an error occured while authing the money'
                        }
                        console.log(result);
                        res.json({success: true, token: result})  
                    }
                }catch(err){
                    console.log(err);
                    ///check that no money was taken from the user
                    res.json({success: false, error: err})
                }
            }
            )

        }else{
            throw "bad cookies"
        }
    } catch (error) {
        res.json({success: false, error: error})
    }
}

/////////////////////////////////////
//DON'T FORGET TO RETURN THE MONEY TO USER IF ANY PROBLEMS OCCURRED DURING BOOKING////
///MSH NAKSA FLOS 7RAM
////////////////
module.exports.book_exam = async (req, res) => {
    // assume that the user has paid for exam and is now registered in db
    // req should also contain the id, or any user identification

    try{
        // ////check if the user didn't already book before
        // ///add payment and other stuff
        // /// will need to add a function to remove the exam from user
        const token = req.cookies.jwt;

        if(token){

            jwt.verify(token, process.env.token_secret, async (err, decodedToken)=>{
                let user = null;
                try{
                    if(err){
                        console.log(err.message);
                        throw "bad cookies"
                    }else{
                        const payment_result = await payment.get_order(req.body.merchantRefNumber, req.body.signature);
                        if(!payment_result){
                            throw `and error occurred during payment capture, returning the money to user ...`
                        }
                        const exam_info = JSON.parse(payment_result.orderItems[0].itemCode)
                        console.log(exam_info);
                        const result = await User.bookExam(exam_info, decodedToken._id)
                        if(!result){
                            throw `an error occurred during booking the exam, returning the money to user ...`
                        }
                        res.json({success: true});
                    }
                }catch(err){
                    console.log(err);
                    ///de-auth the amount from user
                    if(!user){
                        res.json({success: false, error:"no money was taken"})
                    }else{
                        // await payment.return_money({last_booking_time:user.last_booking_time, user_id:user._id});

                        res.json({success: false, error: "error occurred but taken money was returned"})
                    }
                }
            })

        }else{
            throw "bad cookies"
        }
    }catch(err){
        console.log(err);
        ///de-auth the amount from user
        res.json({success:false})

    }
}



module.exports.get_status = (req, res) => {
    res.json(payment.return_money({user_id: req.body.user_id, last_booking_time:req.body.last_booking_time}))
}

