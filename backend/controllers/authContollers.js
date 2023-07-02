const User = require('../models/User');
const jwt = require('jsonwebtoken')
const { Vonage } = require('@vonage/server-sdk')
const OTP = require('../models/OTP')
const casual = require('casual');
const Admin = require('../models/Admin')

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
const createToken = (id) => {
    return jwt.sign({ id:id, admin:Admin.isAdmin(id)}, 'example secret' , { 
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
            console.log(code);
            console.log('adsfasdfasdfasdfasfd');
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
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000, sameSite: 'Lax',})
        res.status(200).json({user:user, success: true});
    } catch (err) {
        const errors = errorHandler(err)
        console.log(errors);
        res.status(200).json({errors:errors, success: false})
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
        console.log(user);
        console.log(code);
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
        // console.log(code);
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


module.exports.test = async (req, res) => {
    res.send('working on it')
    console.log('starting');
    let accum = 0;
    for (let i = 1; i <= 10000; i++) {
        const otp = {
          phone_namber: `+123456789${i}`,
          code: `+12345ZXCZXCZXCZXCZXc6789${i}`
        };
        const startTime = Date.now();
        await OTP.insert(otp);
        const endTime = Date.now();
        accum += endTime - startTime;
        console.log(i);
    }
    console.log(accum/1000);
    console.log('done');
}

// module.exports.test = async (req, res) => {
//     let accum = 0
//     for(let i=0;i<1000;i++){
//         const phone = `+123456789${Math.floor(Math.random() * 10000) + 1}`;
//         const startTime = Date.now();
//         await OTP.findOne({phone: phone}, );
//         const endTime = Date.now();
//         accum += endTime-startTime;
//         console.log(`at i=${i}`);
//     }

//     console.log(accum/1000);
//     res.send('hello world')
// }


module.exports.populate_users = async (req, res) => {
    // Generate random entries
    try {
        let numEntries = 5000;
        console.log('starting');
        res.send('hellow');

        for (let i = 0; i < numEntries; i++) {
            const entry = {
                first_name: casual.first_name,
                last_name: casual.last_name,
                country: casual.country,
                city: casual.city,
                phone_namber: casual.phone,
                email: casual.email.toLowerCase(),
                password: casual.password,
                exams: []
            };
            const numExams = casual.integer(0, 5);
            for (let j = 0; j < numExams; j++) {
                const exam = {
                    _id: casual.uuid,
                    country: casual.country,
                    city: casual.city,
                    location: casual.address,
                    snack: casual.word,
                    day: casual.date('YYYY-MM-DD'),
                    appointment: casual.word,
                    percentage: casual.integer(0, 100)
                };
                entry.exams.push({ exam });
            }

            try{await User.create(entry)}catch(err){console.log('army ohmo fe alzbala');}
        }
        
        // Insert entries into the database

        
        console.log('finished');
        
        console.log(`Generated ${numEntries} random entries successfully!`);
      } catch (err) {
    
        console.error('Error generating random entries:', err);
      }
    



}