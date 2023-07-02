const User = require('../models/User')
const Exam = require('../models/Exam')
const TimeAndSpace = require('../models/TimeAndSpace')
const casual = require('casual');
const jwt = require('jsonwebtoken');



module.exports.add_place = async (req, res) => {
    try{
        /*
        req.body = {
            country: country name,
            city: city name,
            location: location name,
            snacks: [snacks name]
            max_number: number
        }
        */
        const place = await TimeAndSpace.insertPlace(req.body)
        res.json(place);
    }catch(err){
        console.log(err);
        res.json(err);
    }
}



module.exports.add_time = async (req, res) => {
    /*
    req.body = {
        location_id: id
        day: day name,
        appointment: time
    }
    */
    try{ 
        await TimeAndSpace.insertTime(req.body)
        res.json({success: true});
    }catch(err){
        console.log(err);
        res.json(err);
    }
}



module.exports.add_new_exam = async (req, res) => {
    /*
    req.body = {
        title: new title,
        about: new about,
        info: new info
    }
    */
    try{
        const exam = await Exam.insertExam(req.body);
        res.json(exam._id);
    }catch(err){
        console.log(err);
        res.json({success:false});
    }
}


module.exports.edit_exam = async (req, res) => {
    /*
        req.body = {
            _id: id of the exam,
            title: new title,
            about: new about
        }
    */
    try{
        await Exam.editExam(req.body);
        res.json({success: true});
    }catch(err){
        console.log(err);
        res.json({success: false});
    }
}


module.exports.remove_exam = async (req, res) => {
    /*
        req.body = {
            _id: id of the exam
        }
    */
    try{
        await Exam.deleteExam(req.body)
        res.json({success: true});
    }catch(err){
        console.log(err);
        res.json(err);
    }
}



module.exports.get_users_with_day = async (req, res) => {
    try{
        // const location 
        const day = await TimeAndSpace.Day.findOne({_id: req.dayId}).select('reserved_users')
            .populate({
                path: 'exams', // add id and photo
                select: 'title',
                
            })
        res.json({success: true});
    }catch(err){
        console.log(err);
        res.json(err);
    }
}









