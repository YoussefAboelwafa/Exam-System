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
        const place = await TimeAndSpace.Country.insertPlace(req.body)
        res.json(place);
    }catch(err){
        console.log(err);
        res.json(err);
    }
}



module.exports.add_time = async (req, res) => {
    /*
    req.body = {
        location_id: id,
        day: day name,
        appointment: time
    }
    */
    try{ 
        await TimeAndSpace.Country.insertTime(req.body)
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
        const day = await TimeAndSpace.Day.findOne({_id: req.dayId})
            .select('reserved_users')
            .populate({
                path: 'exams', // add id and photo
                select: 'title',
            });
        res.json({success: true});
    }catch(err){
        console.log(err);
        res.json(err);
    }
}



module.exports.remove_location = async (req, res) => {
    /*
        location_id: 
    */
    try{
        await TimeAndSpace.Location.remove_location(req.body._id);
        res.json({success: true})
    }catch(err){
        console.log(err);
        res.json(err);
    }
}




module.exports.get_all_days = async (req, res) => {
    /*
    day_number:1,
    day_name:"saturday",
    month_name:"jan",
    month_number:"march",
    country:"egypt", //
    city:"alex", //
    location:"smouha", //
    _id: "1", /// 
    time:"5 pm", //
    moderator:"", //
    student:0, //
    capacity:25, ///
    */


    try{
        const all_days = await TimeAndSpace.Day.find().populate({
            path:'location',
            select: 'location_name parent max_number',
            populate:{
                path: 'parent',
                select: 'city_name parent',
                populate: {
                    path: 'parent',
                    select: 'country_name',
                }
            }
        });
        const result = all_days.map((day) => ({
            _id: day._id,
            time: day.appointment,
            day: day.day_name,
            location: day.location.location_name,
            city: day.location.parent.city_name,
            country: day.location.parent.parent.country_name,
            moderator: day.moderator,
            student: day.reserved_number,
            capacity: day.location.max_number,
            month_name: day.month_name,
            month_number: day.month_number,
            day_name: day.day_name,
            day_number: day.day_number
        }
         ))
        //  const parsed_user = {
        //      _id: user._id,
        //      first_name: user.first_name,
        //      last_name: user.last_name,
        //      percentage: user.percentage,
        //      exams: result
        //  }
        res.json(result)
    }catch(err){
        console.log(err);
        res.json(err);
    }
}









