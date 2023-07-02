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



const DaysSchema = new mongoose.Schema({
    // _id: {type: String, required: true, unique: true, default: generateRandomCode},
    day_name: {type: String, required: true},
    day_number: {type: String},
    month_name: {type: String},
    month_number: {type: String},
    
    moderator: {type: String, default: 'none'},
    appointment: {type:String, default: '3 pm'}, // time
    reserved_number: {type: Number, required: true, default: 0}, // student number
    reserved_users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],

    /*
      a pointer back up to the parent so that instead of storing
      all of the location's data in the user we can we this to traverse
      up the tree
    */
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'location', default: null}
})


DaysSchema.index({day_number:1, month_number:1});

const LocationSchema = new mongoose.Schema({
    location_name: {type: String, required: true, index: 'hashed'},
    time: [{ type: mongoose.Schema.Types.ObjectId, ref: 'day' }],
    snacks: {type:[String], default: []},
    max_number: {type: Number, required: true},
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'city', default: null } 
})

const CitiesSchema = new mongoose.Schema({
    city_name: {type: String, required: true, index: 'hashed'},
    locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'location' }],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'country', default: null }
})

const CountrySchema = new mongoose.Schema({
    country_name: {type: String, required: true, unique: true, index: 'hashed'},
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'city' }]
})



CountrySchema.statics.insertPlace = async function(elem) {
    try {
        const { country, city, location, snacks } = elem;
        const max_number = elem.capacity;
        let startTime = Date.now();
        const saved_location_id = await Location.findOneAndUpdate (
            { location_name: location },
            { $addToSet: { snacks: snacks }, max_number: max_number },
            { upsert: true, new: true , setDefaultsOnInsert: true, select: '_id' }
          );
        if (!saved_location_id) throw Error("Location not found");
          
        const saved_city_id = await City.findOneAndUpdate (
            { city_name: city },
            { $addToSet: { locations: saved_location_id }},
            { upsert: true, new: true, setDefaultsOnInsert: true, select: '_id' }
          );
        if (!saved_city_id) throw Error("City not found");
          
        const saved_country_id = await Country.findOneAndUpdate (
            { country_name: country },
            { $addToSet: { cities: saved_city_id }},
            {upsert: true, new: true , setDefaultsOnInsert: true, select: '_id'}
          )
        if (!saved_country_id) throw Error("Country not found");
        
        const update_city = City.updateOne({_id: saved_city_id},
          {parent: saved_country_id})

        const update_location = Location.updateOne({_id: saved_location_id},
          {parent: saved_city_id})

        await Promise.all([update_city, update_location])
        
        let endTime = Date.now();
        console.log(endTime-startTime);

        return saved_location_id;
    } catch (error) {
      console.error('Error updating or creating place entry:', error);
    }
  };


CountrySchema.statics.insertTime = async function(elem){
    try {
        const {location_id, month_number, month_name, day_name, day_number, appointment} = elem;
        console.log(elem);
        const day_id = await Day.findOneAndUpdate (
            {day_number:day_number, month_number:month_number},
            { appointment: appointment,
              month_name: month_name,
              day_name: day_name,
              location: location_id},
            { upsert: true, new: true , setDefaultsOnInsert: true, select: '_id' }
        );
        if (!day_id) throw Error("Location not found");
        console.log(day_id);
        const saved_location_id = await Location.findOneAndUpdate (
            { _id: location_id },
            { $push: { time: day_id._id } },
            { new: true, setDefaultsOnInsert: true}
        );
        if (!saved_location_id) throw Error("City not found");
        console.log(saved_location_id);
        return saved_location_id;
    } catch (error) {
        console.error('Error updating or creating place entry:', error);
    }
}



LocationSchema.statics.remove_location = async (location_id) =>{
  try{
    ///////////////////ahhhhhhhhh don't forget about the case if someone had an exam in that place before
    let deletedLocation = await Location.findOneAndRemove({_id:location_id});
    if (deletedLocation) {
      console.log('Exam deleted successfully:', deletedLocation);
      return deletedLocation;
    } else {
      console.log('Exam not found');
      return null;
    }
  } catch (error) {
    console.error('Error deleting exam:', error);
    throw error;
  }
}






const Country = mongoose.model('country', CountrySchema);
const City = mongoose.model('city', CitiesSchema);
const Location = mongoose.model('location', LocationSchema);
const Day = mongoose.model('day', DaysSchema);


module.exports = {Country, City, Location, Day};











