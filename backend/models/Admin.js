const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const adminSchema = new mongoose.Schema({
    _id: {type: String, required: true, index:'hashed'}
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


userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw Error("Email incorrect");
    let auth = await bcrypt.compare(password, user.password);
    if(auth){
        return user;
    }
    throw Error("Password incorrect");
}


userSchema.statics.bookExam = async function(exam, userId){
    try{
        await this.updateOne(
        { _id: userId }, // Match the document by its ID
        { $push: { exams: {exam:exam, percentage:-1} } }, // Use $push to add the new element
        (err, result) => {
            if (err) {
                console.error(err);
                // Handle the error
            } else {
                console.log(result);
                // The result object contains information about the update operation
            }
        }
        );
        return true;
    }catch(err){
        console.log(`Error in updating exam ${userId}`);
        return false;
    }
    
}

