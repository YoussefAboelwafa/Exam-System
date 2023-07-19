const mongoose = require('mongoose');
const bcrypt = require('bcrypt');




const OTPschema = new mongoose.Schema({
    // _id: {type: String, required: true, unique: true, default: generateRandomCode},
    phone_namber: {type: String, required: true, index:'hashed'},
    code: {type: String, required: true},
    createdAt: { type: Date, default: Date.now, expires: 600 },
    exam_id: {type:mongoose.Schema.Types.ObjectId, default: null}
})
///could be improved by removing the id field




OTPschema.statics.insert = async function(elem){
    try {
        const {phone_namber, code, exam_id} = elem;
        const salt = await bcrypt.genSalt();
        const hashed_code = await bcrypt.hash(code, salt);
        
        const filter = { phone_namber: phone_namber };
        const update = { code: hashed_code, createdAt: Date.now(), exam_id:exam_id};
        const options = { upsert: true };

        const otp = await OTP.findOneAndUpdate(filter, update, options);
    
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
        await this.deleteOne({phone_namber: phone_namber})
        return true;
    }
    return false;
}

///improve later

OTPschema.statics.verifyExamCode = async function(user_id, code){
    const otp = await this.findOne({phone_namber: user_id});
    console.log(otp);
    if(!otp)
        throw Error("No OTP associated with the user was found");
    let auth = await bcrypt.compare(code, otp.code);
    if(auth){
        await this.deleteOne({phone_namber: user_id})
        return otp.exam_id;
    }
    return false;
}





const OTP = mongoose.model('otp', OTPschema);

module.exports = OTP;