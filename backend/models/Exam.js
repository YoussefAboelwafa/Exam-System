const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const examSchema = new mongoose.Schema({

    ///when fetching filter for those only
    title: {type: String, required: true},
    date: {type: Date, required: true},
    booked_users: {type: [String], required: true},
    max_number: {type: Number, required: true},
    
    //when he wants to see more
    about: {type: String, required: true},
    info: {type: [String], required: true}

    ///LEAVE FOR LATER
    // //send when he wants to take an exam
    // location: {
    //     type:{
    //         country: {type:{name:{type: String}, cities:{type: [String]}}}
    //     }
    // }
});




const Exam = mongoose.model('exam', examSchema);

module.exports = Exam;