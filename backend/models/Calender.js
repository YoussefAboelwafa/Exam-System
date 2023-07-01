const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');


const characterSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const idLength = 6;
const generateRandomCode = ()=> {
    let userCode = '';
    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characterSet.length);
      userCode += characterSet[randomIndex];
    }
    console.log(Buffer.byteLength(userCode, 'utf8'));
    return userCode;
  }

///could be improved by removing the id field

const appointmentsSchema = new mongoose.Schema({
    // _id: {type: String, required: true, unique: true, default: generateRandomCode},
    appointment: {type: String, required: true, index: 'hashed'}
})

const daysSchema = new mongoose.Schema({
    // _id: {type: String, required: true, unique: true, default: generateRandomCode},
    day: {type: String, required: true, unique: true, index: 'hashed'},
    appointments: {type:[{type: appointmentsSchema, required: true}], default: []},
    reserved_number: {type: Number, required: true, default: 0}
})



daysSchema.statics.insert = async function(elem){
    try {
        console.log(elem);
        
        await Country.updateOne(
            { day: countryId, 'cities._id': cityId, 'cities.locations._id': locationId },
            { $push: { 'cities.$[city].locations.$[location].snacks': newSnack } },
            { arrayFilters: [{ 'city._id': cityId }, { 'location._id': locationId }], upsert: true }
          );
    } catch (error) {
        console.error('Error updating or creating place entry:', error);
    }
}




const Calender = mongoose.model('place', daysSchema);

module.exports = Calender;