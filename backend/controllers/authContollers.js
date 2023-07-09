const User = require('../models/User');
const jwt = require('jsonwebtoken')
const OTP = require('../models/OTP')
const Admin = require('../models/Admin')
const nodemailer = require('nodemailer');

const token_secrect = 'LVeKzFIE8WwhaBpKITdyMSDKbQMPFI4g'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'gammalexambooking@gmail.com',
      pass: 'djvjnulxvitpdzcb'
    }
  });

async function sendSMS(to, code) {
    try{
        console.log(transporter);
        const mailOptions = {
            from: 'gammalexambooking@gmail.com',
            to: to,
            subject: 'Gammal Tech Verification Code',
            text: `Your verification code is: ${code}\n
            The code expires after 10 minutes` 
          };
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    reject(error)
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve('Email sent: ' + info.response);
                }
            });
        })
    }catch(err){
        console.log(err);
    }
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
            res.status(201).json({success: true});
            const code = generateOTP();
            console.log("code is: ", code);
            const otp = await OTP.insert({phone_namber: phone_namber, code: code});
            await sendSMS(email, code);   /////remove comment later

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
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000, sameSite: 'None', secure: 'true'})
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
        const {phone_namber, email} = req.body; //// change in infront tooo
        console.log(req.body);
        // console.log(phone);
        const code = generateOTP();
         console.log(code);
        const otp = await OTP.insert({phone_namber: phone_namber, code: code});

        sendSMS(email, code);   /////remove comment later

        res.status(201).json({success: true});
        
        // const token = createToken(user._id);                    ///// not needed since we direct the user back to the login page
        // res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})

    }catch(err){
        const errors = errorHandler(err);
        res.status(201).json({success: false});
    }
}




