const mongoose = require('mongoose');
const Topic = require('./TopicAndQuestion')

const examSchema = new mongoose.Schema({

    ///when fetching filter for those only
    title: {type: String, required: true},
    date: {type: Date, required: true, default: Date.now()},
    //when he wants to see more
    about: {type: String, required: true},
    info: {type: [String], required: true},
    /// wait until we know when is an exam considered taken and then decrement
    /// increment when someone books
    reserved_number: {type: Number, default: 0},
    deleted: {type: Boolean, default: false},
    /// ask to see if a new exams starts as available or not
    status: {type: Boolean, default: true},

    topics: {type:[{type: mongoose.Schema.Types.ObjectId, ref: 'topic'}], default: []}
});



///doesn't check if an exam with the same title exists
///because still don't know if i have to
examSchema.statics.insertExam = async (newExam) => {
    try {
        const {title, about, info} = newExam    
        const exam = new Exam({
            title: title,
            about: about,
            info: info
        });
        const insertedExam = await exam.save();
        console.log('Exam inserted successfully:', insertedExam);
        return insertedExam;
    } catch (error) {
        console.error('Error inserting exam:', error);
        throw error;
    }
}




examSchema.statics.editExam = async (newExam) => {
  try {
    const {_id, title, about, info} = newExam
    const options = {
      runValidators: true // Run schema validation on update
    };

    const result = await Exam.updateOne({_id: _id}, 
      {$set:{title:title, about:about, info: info}}, options);
    
    if (!(result && result.modifiedCount > 0)) {
      throw "Error occured while deleting the exam exam_id: " + exam._id
    }
  } catch (error) {
    console.error('Error updating exam:', error);
    throw error;
  }
}

  
  examSchema.statics.deleteExam = async (exam) => {
    try {  
      const result = await Exam.updateOne({ _id: exam._id, reserved_number:0}
        ,{$set:{deleted: true}});
      
      if (!(result && result.modifiedCount > 0)) {
        throw "Error occured while deleting the exam exam_id: " + exam._id
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  examSchema.statics.setStatus = async (data) => {
    try {
      const exam_id = data.exam_id;
      const new_status = data.turn

      ///assuming we stop any more bookings because we have enough
      const result = await Exam.findOneAndUpdate({_id: exam_id}
        , {$set: {status: (new_status == 1)? true: false}}); 
        /// not sure if i need to parse the new_status first to an int
        ///that's why i am using only 2 equal signs 

      // if (!(result && result.modifiedCount > 0)) {
      //   throw "Error occured while setting the exam's status exam_id: " + exam_id
      // }
      console.log(new_status);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }


  examSchema.statics.add_topic = async (data) => {
    /*
      title:{type: String},
      num_of_mcq:{type: Number, default: 0},
      num_of_coding:{type: Number, default: 0},
      mcq:{type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'mcq' }], default:[]},
      coding:{type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'coding' }], default:[]}
    */
    try {
      const {exam_id} = data
      const title  = data.topic_name
      if(!title)
        throw "title is required"
      const topic = new Topic({title: title});
      const result = await Exam.updateOne({_id: exam_id}, {$push:{topics:topic._id}})
      if(result.modifiedCount === 0)
        throw "exam doesn't exist"
      await topic.save();
      return {success:true, _id: topic._id};
    } catch (error) {
      console.log(error);
      return false
    }
  }


  examSchema.statics.get_topics = async (data) => {
    try {
      const {exam_id} = data
      ///probebly will cause problems
      const topics = await Exam.findOne({_id: exam_id})
        .select('topics')
        .populate({
          path:'topics',
          populate: [
            { path: 'mcq' },
            { path: 'coding' }
          ]
        })
      return topics;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  examSchema.statics.delete_topic = async (data) => {
    ///not really deleting it add garbage collector later
    try {
      const {exam_id, topic_id} = data
      const result = await Exam.updateOne({_id: exam_id}, {$pull:{topics:topic_id}})
      return {success:true};
    } catch (error) {
      console.log(error);
      return false
    }
  }


  // examSchema.statics.edit_topic = async (data) => {
  //   /*
  //     title:{type: String},
  //     num_of_mcq:{type: Number, default: 0},
  //     num_of_coding:{type: Number, default: 0},
  //     mcq:{type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'mcq' }], default:[]},
  //     coding:{type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'coding' }], default:[]}
  //   */
  //   try {
  //     const {exam_id, topic_id} = data
  //     const result = Exam.updateOne({_id: exam_id}, {$pull:{topics:topic_id}})
  //     return {success:true};
  //   } catch (error) {
  //     console.log(error);
  //     return false
  //   }
  // }



const Exam = mongoose.model('exam', examSchema);

module.exports = Exam;