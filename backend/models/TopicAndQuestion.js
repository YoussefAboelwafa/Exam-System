const mongoose = require('mongoose');



const mcqSchema = new mongoose.Schema({
    description: {type: String, required: true},
    choices: {type: [String], required: true},
    answer: {type: String, required: true}
})


const codingSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    input: {type: String, required: true},
    output: {type: String, required: true},
    input_format: {type: String, required: true},
    output_format: {type: String, required: true},
    constraints: {type: String, required: true}
})


const topicSchema = new mongoose.Schema({
    title:{type: String},
    num_of_mcq:{type: Number, default: 0},
    num_of_coding:{type: Number, default: 0},
    mcq:{type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'mcq' }], default:[]},
    coding:{type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'coding' }], default:[]}
})


topicSchema.statics.edit_topic = async (data) => {
    try {
        const {topic_id, new_mcq, new_coding, num_of_mcq, num_of_coding} = data;
        const inserted_new_mcq = MCQ.insertMany(new_mcq);
        const inserted_new_coding = Coding.insertMany(new_coding);
        const result = await Topic.updateOne({_id: topic_id}, {
            $push:{ mcq:{$each: inserted_new_mcq._id}, coding:{$each: inserted_new_coding._id} },
            $set: { num_of_mcq: num_of_mcq, num_of_coding: num_of_coding}
        });
        return result;
    } catch (error) {
        console.log(error);
        return false
    }
}


topicSchema.statics.delete_question = async (data) => {
    try {
        const {topic_id, mcq_id, coding_id} = data;

        const result = await Topic.updateOne({_id: topic_id}, {
            $pull:{ mcq:mcq_id, coding:coding_id }
        });
        return result;
    } catch (error) {
        console.log(error);
        return false
    }
}





const MCQ = mongoose.model('mcq', mcqSchema);
const Coding = mongoose.model('coding', codingSchema);
const Topic = mongoose.model('topic', topicSchema);

module.exports = Topic;