const User = require('../models/User')
const Exam = require('../models/Exam')
const Place = require('../models/Places')
const casual = require('casual');
const jwt = require('jsonwebtoken');



module.exports.add_place = async (req, res) => {
    // try{
    //     /*
    //     req.body = {
    //         country: country name,
    //         cities: city name,
    //         location: location name,
    //         snacks: [snacks name]
    //         max_number: number
    //     }
    //     */
        
    //     res.json(exams);
    // }catch(err){
    //     console.log(err);
    //     res.json(err);
    // }
}



module.exports.add_time = async (req, res) => {
    // try{
    //     /*
    //     req.body = {
    //         location_id: id
    //         day: day name,
    //         appointments: city name
    //     }
    //     */
       
    //     res.json(exams);
    // }catch(err){
    //     console.log(err);
    //     res.json(err);
    // }
}



module.exports.add_new_exam = async (req, res) => {
    try{
        /*
        req.body = {
            location_id: id
            day: day name,
            appointments: city name
        }
        */
        const exam = await Exam.insertExam(req.body);
        res.json(exam._id);
    }catch(err){
        console.log(err);
        res.json({success:false});
    }
}


module.exports.edit_exam = async (req, res) => {
    try{
        await Exam.editExam(req.body);
        res.json({success: true});
    }catch(err){
        console.log(err);
        res.json({success: false});
    }
}


module.exports.remove_exam = async (req, res) => {
    try{
        /*
        req.body = {
            location_id: id
            day: day name,
            appointments: city name
        }
        */
       await Exam.deleteExam(req.body)
        res.json(exams);
    }catch(err){
        console.log(err);
        res.json(err);
    }
}










