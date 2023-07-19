const mongoose = require('mongoose');
const Topic = require('./TopicAndQuestion')

const savedExamSchema = new mongoose.Schema({
    exam_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'exam'},
    mcq: {type:{
        question:{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'mcq'},
        user_answer:{type: String, default:''}
    }},

    coding: {type:{
        question:{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'coding'}
    }}
});

const SavedExam = mongoose.model('savedExam', savedExamSchema);

module.exports = SavedExam;