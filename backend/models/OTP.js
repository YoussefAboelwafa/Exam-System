const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const OTPschema = new mongoose.Schema({
    phone: {type: String, required: true, unique: true, index: true},
    code: {type: String, required: true},
    createdAt: { type: Date, default: Date.now, expires: 3600 }
})
///could be improved by removing the id field
OTPschema.index({phone: 1});


OTPschema.statics.insert = async function(elem){
    try {
        const {phone, code} = elem;
        console.log('before saving', elem);
        const salt = await bcrypt.genSalt();
        const hashed_code = await bcrypt.hash(code, salt);

        await this.findOneAndUpdate(
          { phone:phone },
          { code: hashed_code , createdAt: Date.now()},
          { upsert: true }
        );
        console.log('OTP entry updated or created successfully.');
    } catch (error) {
        console.error('Error updating or creating OTP entry:', error);
    }
}

OTPschema.statics.verifyOTP = async function(phone, code){
    const otp = await this.findOne({phone: phone});
    console.log(otp);
    if(!otp) throw Error("phone incorrect");
    let auth = await bcrypt.compare(code, otp.code);
    if(auth){
        return true;
    }
    return false;
}


const OTP = mongoose.model('otp', OTPschema);

module.exports = OTP;