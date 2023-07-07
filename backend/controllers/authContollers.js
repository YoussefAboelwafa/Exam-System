const User = require('../models/User');
const jwt = require('jsonwebtoken')
const { Vonage } = require('@vonage/server-sdk')
const OTP = require('../models/OTP')
const casual = require('casual');
const Admin = require('../models/Admin')

const token_secrect = 'LVeKzFIE8WwhaBpKITdyMSDKbQMPFI4g'

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
    let errors = { email: [], password: [], first_name: [], last_name: [], country: [], city: [], phone_namber: [] }; /// add the rest later

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

///ivsXMmb3UFV5AtA0T3vh3l99CBqH5gfy
const maxAge = 3 * 24 * 60 * 60;
const createToken = async (id) => {
    return jwt.sign({ _id:id, admin:!(await Admin.isAdmin(id) === null)}, token_secrect , { 
        expiresIn : maxAge
    })
}

const checkUniqueness = async (email, phone_namber) => {
    try{
        const user = await User.findOne({
            $or: [
            { phone_namber: phone_namber },
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
        const {email, phone_namber} = req.body;

        const isUnique = await checkUniqueness(email, phone_namber);
        if(isUnique){
            const code = generateOTP();
            console.log("code is: ", code);
            const otp = await OTP.insert({phone_namber: phone_namber, code: code});

            // sendSMS(phone_namber, code);   /////remove comment later

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
        if(!user){
            throw "user not found"
        }
        console.log(user);
        const token = await createToken(user._id);
        if(!token){
            throw "Failed to create a token"
        }
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000, sameSite: 'Lax'})
        res.status(200).json({user:user, success: (await Admin.isAdmin(user._id) === null)?1:2});
    } catch (err) {
        console.log(err);
        res.status(200).json({success: 0})
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
        const {user, code} = req.body;
        // console.log(req.body.code);
        ///verify otp
        const correct = await OTP.verifyOTP(user.phone_namber, code);
        if(correct){
            const new_user = await User.create(user);  ///////review later to check if waiting here is really necessary
            if(new_user)
                res.status(201).json({success: true, created: true});
        }else{
            res.status(201).json({success: false, created: false});
        }
    }catch(err){            
          
        const errors = errorHandler(err);
        console.log(err);
        res.status(201).json({success: true, created: false});
    }
}


module.exports.send_again = async (req, res) =>{
    try{
        ////check if email and phone provided are unique
        const {phone_namber} = req.body;
        console.log(req.body);
        // console.log(phone);
        const code = generateOTP();
         console.log(code);
        const otp = await OTP.insert({phone_namber: phone_namber, code: code});

        // sendSMS(phone_namber, code);   /////remove comment later

        res.status(201).json({success: true});
        
        // const token = createToken(user._id);                    ///// not needed since we direct the user back to the login page
        // res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})

    }catch(err){
        const errors = errorHandler(err);
        res.status(201).json({success: false});
    }
}




