const User = require('../models/User')
const OTP = require('../models/OTP')



module.exports.get_exam = async (req, res) => {
    try {
        ///change to using cockies
        const exam_id = await OTP.verifyExamCode(req.body.user_id, req.body.code)
        const result = await User.getExam({user_id: req.body.user_id, exam_id: exam_id})
        res.json(result)
    } catch (error) {
        console.log(error);
        res.json({success: false, error: error})
    }
}