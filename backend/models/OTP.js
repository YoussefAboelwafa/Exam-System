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



OTPschema.statics.verifyCode = async function(identifier, code, isExamCode = false) {
    const otp = await this.findOne({ phone_number: identifier });
    if (!otp) {
        throw new Error(isExamCode ? "No OTP associated with the user was found" : "Phone incorrect or OTP expired");
    }

    const isCodeValid = await bcrypt.compare(code, otp.code);
    if (isCodeValid) {
        await this.deleteOne({ phone_number: identifier });
        return isExamCode ? otp.exam_id : true;
    }

    return false;
};



OTPschema.statics.verifyOTP = async function(phone_number, code) {
    try {
        return await this.verifyCode(phone_number, code);
    } catch (error) {
        throw new Error("Error verifying OTP: " + error.message);
    }
};

OTPschema.statics.verifyExamCode = async function(user_id, code) {
    try {
        return await this.verifyCode(user_id, code, true);
    } catch (error) {
        throw new Error("Error verifying exam code: " + error.message);
    }
};


const OTP = mongoose.model('otp', OTPschema);

module.exports = OTP;