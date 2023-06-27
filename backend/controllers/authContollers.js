const User = require('../models/User');
const jwt = require('jsonwebtoken')
const { Vonage } = require('@vonage/server-sdk')
const OTP = require('../models/OTP')

const vonage = new Vonage({
  apiKey: "dc9afa8a",
  apiSecret: "7LgnGBCpn6HS6aoI"
})

const from = "Vonage APIs"


async function sendSMS(to, code) {
    const text = 'A text message sent using the Vonage SMS API, your code is ' + code;
    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

function errorHandler(err) {
    console.log(err.message, err.code);
    let errors = { email: [], password: [], first_name: [], last_name: [], country: [], city: [], phone: [] }; /// add the rest later

    if (err.message === 'Email incorrect') {
        errors.email = 'Email not found';
    }

    if (err.message === 'Password incorrect') {
        errors.email = 'Password incorrect';
    }

    if (err.code === 11000) {
        errors.email = 'Email already exists';
        return errors;
    }

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            console.log(properties.message);
            errors[properties.path].push(properties.message);
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'example secret' , {
        expiresIn : maxAge
    })
}

const checkUniqueness = async (email, phone) => {
    try{
        const user = await User.findOne({
            $or: [
            { phone: phone },
            { email: email }
            ]
        })
        if (user) {
            console.log('Object with matching name or email found:', user);
            return false;
        } else {
            console.log('No object found with matching name or email');
            return true;
        }
    }catch(err){
       console.error('Error searching for object:', err);
    };
}



module.exports.signup_get = (req, res) =>{
    console.log('hello wwwww');

    res.send('signup_get');
}

module.exports.signup_post = async (req, res) =>{
    try{
        ////check if email and phone provided are unique
        const {email, phone} = req.body;

        const isUnique = await checkUniqueness(email, phone);
        if(isUnique){
            const code = generateOTP();
            console.log('hello ');
            const otp = await OTP.create({phone: phone, code: code});

            // sendSMS(phone, code);   /////remove comment later

            res.status(201).json({success: true});
        }else{
            res.status(201).json({success: false});
        }
        // const token = createToken(user._id);                    ///// not needed since we direct the user back to the login page
        // res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})

    }catch(err){
        const errors = errorHandler(err);
        res.status(201).json({success: false});
    }

}

module.exports.login_get = (req, res) =>{
    res.send('login_get');
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body);
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000, sameSite: 'None',})
        res.status(200).json({user:user, success: true});
    } catch (err) {
        const errors = errorHandler(err)
        console.log(errors);
        res.status(400).json({errors:errors, success: false})
    }
}


module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.send('done')
    // res.redirect('/');
    ///// redirect back to home page
}



module.exports.verifyCode = async (req, res) => {
    try{
        const {code, user} = req.body;
        console.log(req.body.code);
        ///verify otp
        const correct = await OTP.verifyOTP(user.phone, code);
        if(correct){
            const new_user = await User.create(user);  ///////review later to check if waiting here is really necessary
            if(new_user)
                res.status(201).json({success: true, created: true});
        }else{
            res.status(201).json({success: false, created: false});
        }
        // const token = createToken(user._id);                    ///// not needed since we direct the user back to the login page
        // res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})
    }catch(err){            
          
        const errors = errorHandler(err);
        console.log(err);
        res.status(201).json({success: true, created: false});
    }
}

