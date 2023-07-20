const mongoose = require('mongoose');

const savedExamSchema = new mongoose.Schema({
    exam_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'exam'},
    mcq: {type:[{
        question:{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'mcq'},
        user_answer:{type: String, default:''}
    }]},

    coding: {type:[{
        question:{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'coding'}
    }]}
});



savedExamSchema.statics.set_mcq_answer = async (data) => {
    try {
        const {saved_exam_id, mcq_id, user_answer} = data
        const result = await SavedExam.updateOne({_id:saved_exam_id, 'mcq.question': mcq_id}, {$set: { 'mcq.$.user_answer': user_answer }})
        if(result.modifiedCount === 0)
            throw "No mcq was modified check that the ids are valid"
    } catch (error) {
        console.log(error);
        throw error
    }
}

const SavedExam = mongoose.model('savedExam', savedExamSchema);

module.exports = SavedExam;