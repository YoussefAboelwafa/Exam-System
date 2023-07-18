const User = require('../models/User')
const jwt = require('jsonwebtoken')
const payment = require('../services/payment')



module.exports.get_exam = async (req, res) => {
    try {
        res.json(await User.getExam({user_id: req.body.user_id, code:req.body.code}))
    } catch (error) {
        console.log(error);
        res.json({success: false, error: error})
    }
}