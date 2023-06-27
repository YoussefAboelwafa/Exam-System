// const mongoose = require('mongoose');
// const {isEmail} = require('validator');
// const bcrypt = require('bcrypt');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

// const userSchema = new mongoose.Schema({

//     ///when fetching filter for those only
//     name: {type: String, required: true},
//     date: {type: Date, required: true},
//     booked_users: {type: [String], required: true},
//     max_number: {type: Number, required: true},
    
//     //when he wants to see more
//     about: {type: String, required: true},
    
//     //send when he wants to take an exam
//     countries: {country: {type[cities]}},
//     cities : {city: {type[locations]}},
//     locations: {location: {type[days]}}
//     days: {day: {type[Appointment]}}
//     countries: {type: {}, required: true},
//     cities: {type: [String], required: true},
//     locations: {type: [String], required: true},
//     snacks: {type: [String], required: true},
//     days: {type: [String], required: true},
//     Appointment: {type: [String], required: true}
// });


// /// trust that the front will check the email before sending
// ////add the rest of information like exams taken and so on and so forth
// ///and most of that information will probably be on the form of foreign keys


// userSchema.index({email: 1})

// userSchema.pre('save', async function(next){
//     console.log('before saving', this);
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// userSchema.post('save', function(doc, next){
//     console.log('before saving', this);
//     next();
// });


// userSchema.statics.login = async function(email, password){
//     const user = await this.findOne({email});
//     if(!user) throw Error("Email incorrect");
//     let auth = await bcrypt.compare(password, user.password);
//     if(auth){
//         return user;
//     }
//     throw Error("Password incorrect");
// }


// const User = mongoose.model('user', userSchema);

// module.exports = User;