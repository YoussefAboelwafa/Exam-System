const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    // first_name: {type: String, required: true},
    // last_name: {type: String, required: true},
    // country: {type: String, required: true},
    // city: {type: String, required: true},
    // phone_number: {type: String, required: true, unique: true},
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {type: String, required: [true, 'password required']}
})

/// trust that the front will check the email before sending
////add the rest of information like exams taken and so on and so forth
///and most of that information will probably be on the form of foreign keys

userSchema.pre('save', async function(next){
    console.log('before saving', this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.post('save', function(doc, next){
    console.log('before saving', this);
    next();
});


const User = mongoose.model('user', userSchema);

module.exports = User;