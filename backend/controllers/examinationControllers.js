const User = require('../models/User')
const OTP = require('../models/OTP')
const SavedExam = require('../models/SavedExam')

const desiredTotalWeight = 10.0 /// make sure when you edit it later to keep it a decimal just incase 

module.exports.get_exam = async (req, res) => {
    try {
        ///change to using cockies
        const exam_id = await OTP.verifyExamCode(req.body.user_id, req.body.code)
        let exam = await User.getExam({user_id: req.body.user_id, exam_id: exam_id})
        const totalMcqWeight = exam.mcq.reduce((accumulator, currentValue) => accumulator + currentValue.question.weight, 0);
        const totalCodingWeight = exam.coding.reduce((accumulator, currentValue) => accumulator + currentValue.question.weight, 0);
        const totalWeight = totalMcqWeight + totalCodingWeight;
        const ratio = desiredTotalWeight/totalWeight;
        
        exam.mcq.forEach(mcqItem => {
            mcqItem.question.weight *= ratio;
        });
          
        exam.coding.forEach(codingItem => {
            codingItem.question.weight *= ratio;
        });
        console.log(exam.mcq);
        res.json(exam)
    } catch (error) {
        console.log(error);
        res.json({success: false, error: error})
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