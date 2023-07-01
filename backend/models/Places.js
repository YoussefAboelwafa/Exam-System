const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const Calender = require('./Calender')

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

const LocationSchema = new mongoose.Schema({
    name: {type: String, required: true, index: 'hashed'},
    time: {type:[{type: String, required: true }], default: []},
    snacks: {type:[{type: String, required: true}], default: []},
    max_number: {type: Number, required: true}
})

const CitiesSchema = new mongoose.Schema({
    name: {type: String, required: true, index: 'hashed'},
    locations: {type: [{type: LocationSchema, required: true}], default: []}
})

const CountrySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true, index: 'hashed'},
    cities: {type:[{type: CitiesSchema, required: true}], default: []}
})



CountrySchema.statics.insertLocation = async function(elem){
    try {
        const {country, city, location, max_number, snacks} = elem;
        
        const query = { name: country };
        const update = {
            $set: {
                'cities.$[city].locations.$[loc].snacks': snacks,
                'cities.$[city].locations.$[loc].max_number': max_number,
            },
            $push: {
                cities: { name: city, locations: [{ name: location, snacks, max_number }] },
            },
        };
        const options = {
            arrayFilters: [
                { 'city.name': city },
                { 'loc.name': location },
            ],
            upsert: true,
        };

        await CountryModel.updateOne(query, update, options);
    } catch (error) {
        console.error('Error updating or creating place entry:', error);
    }
}


CountrySchema.statics.insertTime = async function(elem){
    try {
        const {locationId, timeId} = elem;
        
        await Location.updateOne(
            { _id: locationId },
            { $push: { 'cities.$[city].locations.$[location].time': timeId } }
        );
    } catch (error) {
        console.error('Error updating or creating place entry:', error);
    }
}




const Country = mongoose.model('country', CountrySchema);
const Location = mongoose.model('location', LocationSchema);

module.exports = Country;