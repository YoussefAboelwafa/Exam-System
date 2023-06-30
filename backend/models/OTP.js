const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const OTPschema = new mongoose.Schema({
    phone_namber: {type: String, required: true, index: 'hashed'},
    code: {type: String, required: true},
    createdAt: { type: Date, default: Date.now, expires: 600 }
})
///could be improved by removing the id field



OTPschema.statics.insert = async function(elem){
    try {
        const {phone_namber, code} = elem;
        console.log('before saving', elem);
        const salt = await bcrypt.genSalt();
        const hashed_code = await bcrypt.hash(code, salt);

        await this.findOneAndUpdate(
          { phone_namber:phone_namber },
          { code: hashed_code , createdAt: Date.now()},
          { upsert: true }
        );
        console.log('OTP entry updated or created successfully.');
    } catch (error) {
        console.error('Error updating or creating OTP entry:', error);
    }
}

OTPschema.statics.verifyOTP = async function(phone_namber, code){
    const otp = await this.findOne({phone_namber: phone_namber});
    console.log(otp);
    if(!otp)
        throw Error("phone incorrect");
    let auth = await bcrypt.compare(code, otp.code);
    if(auth){
        return true;
    }
    return false;
}



const OTP = mongoose.model('otp', OTPschema);

module.exports = OTP;