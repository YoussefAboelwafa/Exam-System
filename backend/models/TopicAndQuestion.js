const mongoose = require('mongoose');



const mcqSchema = new mongoose.Schema({
    description: {type: String, required: true},
    choices: {type: [String], required: true},
    answer: {type: String, required: true}
})


const codingSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    input: {type: String, default: ''},
    output: {type: String, default: ''},
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


// topicSchema.statics.edit_topic = async (data) => {
//     try {
//         const {topic_id, new_mcq, new_coding, num_of_mcq, num_of_coding} = data;
//         const inserted_new_mcq = MCQ.insertMany(new_mcq);
//         const inserted_new_coding = Coding.insertMany(new_coding);
//         const result = await Topic.updateOne({_id: topic_id}, {
//             $push:{ mcq:{$each: inserted_new_mcq._id}, coding:{$each: inserted_new_coding._id} },
//             $set: { num_of_mcq: num_of_mcq, num_of_coding: num_of_coding}
//         });
//         return result;
//     } catch (error) {
//         console.log(error);
//         return false
//     }
// }

topicSchema.statics.edit_number_of_mcq = async (data) => {
    try {
        const {topic_id} = data;
        const num_of_mcq = data.number_of_mcq;
        const result = await Topic.updateOne({_id: topic_id}, {
            $set: { num_of_mcq: num_of_mcq}
        });
        console.log(result);
        return topic_id;
    } catch (error) {
        console.log(error);
        return false
    }
}

topicSchema.statics.edit_number_of_coding = async (data) => {
    try {
        const {topic_id} = data;
        const num_of_coding = data.number_of_coding;
        const result = await Topic.updateOne({_id: topic_id}, {
            $set: { num_of_coding: num_of_coding}
        });
        return topic_id;
    } catch (error) {
        console.log(error);
        return false
    }
}

topicSchema.statics.add_mcq = async (data) => {
    try {
        const {topic_id, new_mcq} = data;
        const inserted_new_mcq = MCQ.create({
            description: new_mcq.description,
            choices: new_mcq.choices,
            answer: new_mcq.answer
        })
        const result = await Topic.updateOne({_id: topic_id}, {
            $push: { mcq: inserted_new_mcq._id}
        });
        return inserted_new_mcq._id;
    } catch (error) {
        console.log(error);
        return false
    }
}

topicSchema.statics.add_coding = async (data) => {
    try {
        const {topic_id, new_coding} = data;
        const inserted_new_coding = Coding.create({
            title: new_coding.title,
            description: new_coding.description,
            input: new_coding.input,
            output: new_coding.output,
            input_format: new_coding.input_format,
            output_format: new_coding.output_format,
            constraints: new_coding.constraints
        })
        const result = await Topic.updateOne({_id: topic_id}, {
            $push: { coding: inserted_new_coding._id}
        });
        return inserted_new_coding._id;
    } catch (error) {
        console.log(error);
        return false
    }
}


//// doesn't delete the question itself just derefrence it
/// will need to add a garpage collector later using refrence counting

topicSchema.statics.delete_mcq = async (data) => {
    try {
        const {topic_id, mcq_id} = data;

        const result = await Topic.updateOne({_id: topic_id}, {
            $pull:{ mcq:mcq_id}
        });
        return true;
    } catch (error) {
        console.log(error);
        return false
    }
}

topicSchema.statics.delete_coding = async (data) => {
    try {
        const {topic_id, coding_id} = data;

        const result = await Topic.updateOne({_id: topic_id}, {
            $pull:{ coding:coding_id }
        });
        return true;
    } catch (error) {
        console.log(error);
        return false
    }
}







const MCQ = mongoose.model('mcq', mcqSchema);
const Coding = mongoose.model('coding', codingSchema);
const Topic = mongoose.model('topic', topicSchema);

module.exports = Topic;