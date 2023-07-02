const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const examSchema = new mongoose.Schema({

    ///when fetching filter for those only
    title: {type: String, required: true},
    date: {type: Date, required: true, default: Date.now()},
    //when he wants to see more
    about: {type: String, required: true},
    info: {type: [String], required: true},

});

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
    const {_id, title, about} = newExam
    const options = {
      new: true, // Return the updated document
      runValidators: true, // Run schema validation on update
    };

    const updatedExam = await Exam.findByIdAndUpdate(_id, {title:title, about:about}, options);
    if (updatedExam) {
      console.log('Exam updated successfully:', updatedExam);
      return updatedExam;
    } else {
      console.log('Exam not found');
      return null;
    }
  } catch (error) {
    console.error('Error updating exam:', error);
    throw error;
  }
}

  
  examSchema.statics.deleteExam = async (exam) => {
    try {
      const filter = { _id: exam._id }; // Specify the condition to find the exam to delete
  
      const deletedExam = await Exam.findOneAndRemove(filter);
      if (deletedExam) {
        console.log('Exam deleted successfully:', deletedExam);
        return deletedExam;
      } else {
        console.log('Exam not found');
        return null;
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      throw error;
    }
  }


const Exam = mongoose.model('exam', examSchema);

module.exports = Exam;