const User = require('../models/User')
const OTP = require('../models/OTP')
const SavedExam = require('../models/SavedExam')
const jwt = require('jsonwebtoken');


const desiredTotalWeight = 10.0 /// make sure when you edit it later to keep it a decimal just incase 

module.exports.get_exam = async (req, res) => {
    try {
        ///change to using cockies
        const token = req.cookies.jwt;
        if(token){
            jwt.verify(token, process.env.token_secret, async (err, decodedToken)=>{
                try {
                    if(err){
                        console.log(err.message);
                        res.json({signed_in: false});
                    }else{
                        console.log(decodedToken);
                        const user_id = decodedToken._id.toString();
                        console.log(user_id);
                        const exam_id = await OTP.verifyExamCode(user_id, req.body.code)
                        let exam = await User.getExam({user_id:user_id, exam_id: exam_id})
                        console.log(exam);
                        const totalMcqWeight = exam.mcq.reduce((accumulator, mcq) => accumulator + mcq.question.weight, 0);
                        const totalCodingWeight = exam.coding.reduce((accumulator, coding) => accumulator + coding.question.weight, 0);
                        const totalWeight = totalMcqWeight + totalCodingWeight;
                        const ratio = desiredTotalWeight/totalWeight;
                        
                        exam.mcq.forEach(mcqItem => {
                            mcqItem.question.weight = (mcqItem.question.weight*ratio).toFixed(2);
                        });
                        
                        exam.coding.forEach(codingItem => {
                            codingItem.question.weight = (codingItem.question.weight*ratio).toFixed(2);
                        });
                        res.json({success:true, exam:exam})
                    }
                } catch (error) {
                    console.log(error);
                    res.json({success: false, error: error})
                }
            })
        }else{
            res.json({success: false});
        }
        
    } catch (error) {
        console.log(error);
        res.json({success: false})
    }
}

module.exports.set_mcq_answer = async (req, res) => {
    try {
        await SavedExam.set_mcq_answer(req.body);
        res.json({success: true})
    } catch (error) {
        console.log(error);
        res.json({success: false})
    }
}