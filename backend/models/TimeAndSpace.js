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



const daysSchema = new mongoose.Schema({
    // _id: {type: String, required: true, unique: true, default: generateRandomCode},
    name: {type: String, required: true, index: 'hashed'},
    moderator: {type: String, index: 'hashed', default: 'none'},
    appointments: {type:[String], default: []},
    reserved_number: {type: Number, required: true, default: 0},
    /*
      a pointer back up to the parent so that instead of storing
      all of the location's data in the user we can we this to traverse
      up the tree
    */
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'location' } 
})


const LocationSchema = new mongoose.Schema({
    name: {type: String, required: true, index: 'hashed'},
    time: [{ type: mongoose.Schema.Types.ObjectId, ref: 'day' }],
    snacks: {type:[String], default: []},
    max_number: {type: Number, required: true},
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'city' } 
})

const CitiesSchema = new mongoose.Schema({
    name: {type: String, required: true, index: 'hashed'},
    locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'location' }],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'country' }
})

const CountrySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true, index: 'hashed'},
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'city' }]
})



CountrySchema.statics.insertPlace = async function(elem) {
    try {
        const { country, city, location, max_number, snacks } = elem;
        let startTime = Date.now();
        const saved_location_id = await Location.findOneAndUpdate (
            { name: location },
            { $addToSet: { snacks: snacks }, max_number: max_number },
            { upsert: true, new: true , setDefaultsOnInsert: true, select: '_id' }
          );
        if (!saved_location_id) throw Error("Location not found");
          
        const saved_city_id = await City.findOneAndUpdate (
            { name: city },
            { $addToSet: { locations: saved_location_id } },
            { upsert: true, new: true, setDefaultsOnInsert: true, select: '_id' }
          );
        if (!saved_city_id) throw Error("City not found");
          
        const saved_country = await Country.findOneAndUpdate (
            { name: country },
            { $addToSet: { cities: saved_city_id } },
            { upsert: true, new: true , setDefaultsOnInsert: true, select: '_id'}
          )
        if (!saved_country) throw Error("Country not found");
        
          
        


          let endTime = Date.now();
          console.log(endTime-startTime);
        return saved_country;
    } catch (error) {
      console.error('Error updating or creating place entry:', error);
    }
  };


CountrySchema.statics.insertTime = async function(elem){
    try {
        const {location_id, day, appointment} = elem;
        const day_id = await Day.updateOne (
            { name: day },
            { $addToSet: { appointments: appointment } },
            { upsert: true, new: true , setDefaultsOnInsert: true, select: '_id' }
        );
        if (!day_id) throw Error("Location not found");
        
        const saved_location_id = await City.findOneAndUpdate (
            { _id: location_id },
            { $addToSet: { time: day_id } },
            { upsert: true, new: true, setDefaultsOnInsert: true}
        );
        if (!saved_location_id) throw Error("City not found");
        console.log(saved_location_id);
    } catch (error) {
        console.error('Error updating or creating place entry:', error);
    }
}




const Country = mongoose.model('country', CountrySchema);
const City = mongoose.model('city', CitiesSchema);
const Location = mongoose.model('location', LocationSchema);
const Day = mongoose.model('day', daysSchema);


module.exports = Country;