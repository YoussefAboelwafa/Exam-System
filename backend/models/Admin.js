const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const adminSchema = new mongoose.Schema({
    _id: {type: String, required: true, index:'hashed'},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' , index: 'hashed'}
})


module.exports.isAdmin = async (user_id) =>{
    const exists = await findOne({user_id: user_id})
    return (exists)? true: false;
}


const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;

/// trust that the front will check the email before sending
////add the rest of information like exams taken and so on and so forth
///and most of that information will probably be on the form of foreign keys







