const User = require('../models/User')
const Exam = require('../models/Exam')
const Place = require('../models/Places')
const casual = require('casual');
const jwt = require('jsonwebtoken');



module.exports.add_place = async (req, res) => {
    try{
        /*
        req.body = {
            country: country name,
            cities: city name,
            location: location name,
            snacks: [snacks name]
            max_number: number
        }
        */
        
        res.json(exams);
    }catch(err){
        console.log(err);
        res.json(err);
    }
}



module.exports.add_time = async (req, res) => {
    try{
        /*
        req.body = {
            location_id: id
            day: day name,
            appointments: city name
        }
        */
       
        res.json(exams);
    }catch(err){
        console.log(err);
        res.json(err);
    }
}






