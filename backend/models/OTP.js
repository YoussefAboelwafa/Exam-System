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
  

const OTPschema = new mongoose.Schema({
    // _id: {type: String, required: true, unique: true, default: generateRandomCode},
    phone_namber: {type: String, required: true, index:'hashed'},
    code: {type: String, required: true},
    createdAt: { type: Date, default: Date.now, expires: 600 }
})
///could be improved by removing the id field




OTPschema.statics.insert = async function(elem){
    try {
        const {phone_namber, code} = elem;
        const salt = await bcrypt.genSalt();
        const hashed_code = await bcrypt.hash(code, salt);
        
        const filter = { phone_namber: phone_namber };
        const update = { code: hashed_code, createdAt: Date.now() };
        const options = { upsert: true };

        const otp = await OTP.findOneAndUpdate(filter, update, options);

        console.log(otp);
    
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