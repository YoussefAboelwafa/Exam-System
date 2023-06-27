const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const OTPschema = new mongoose.Schema({
    phone: {type: String, required: true, unique: true},
    code: {type: String, required: true}
})
///could be improved by removing the id field
OTPschema.index({phone: 1});


OTPschema.pre('save', async function(next){
    console.log('before saving', this);
    const salt = await bcrypt.genSalt();
    this.code = await bcrypt.hash(this.code, salt);
    next();
});

OTPschema.post('save', function(doc, next){
    console.log('after saving', this);
    next();
});


OTPschema.statics.verifyOTP = async function(phone, code){
    const otp = await this.findOne({phone});
    if(!phone) throw Error("phone incorrect");
    let auth = await bcrypt.compare(code, otp.code);
    if(auth){
        this.findByIdAndDelete(phone).then(deletedUser => {
            if (deletedUser) {
              console.log('User deleted successfully');
            } else {
              console.log('User not found');
            }
          })
          .catch(error => {
            console.error('Error deleting user:', error);
          });
        return true;
    }
    throw Error("Incorrect code");
}


const OTP = mongoose.model('otp', OTPschema);

module.exports = OTP;