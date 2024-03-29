const User = require('../models/User');
const jwt = require('jsonwebtoken')
const OTP = require('../models/OTP')
const Admin = require('../models/Admin')
const Email = require('../services/emailing')

const maxAge = 3 * 24 * 60 * 60;
const createToken = async (id) => {
    return jwt.sign({ _id:id, admin:!(await Admin.isAdmin(id) === null)}, process.env.token_secret , { 
        expiresIn : maxAge
    })
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
    const test = {
        user_id:"34523452354",
        time:Date.now().toString(),
        exam_info: req.body
    }
    res.send(JSON.stringify(test));
}

module.exports.signup_post = async (req, res) =>{ 
    try{
        ////check if email and phone provided are unique
        const {email, phone_namber} = req.body;
        
        const isUnique = await checkUniqueness(email, phone_namber);
        if(isUnique){
            
            const code = generateOTP();
            console.log("code is: ", code);
            await Promise.all([
                OTP.insert({phone_namber: phone_namber, code: code}),
                Email.sendEmail(email, 'Gammal Tech Verification Code',
                 `Your verification code is: ${code}\n
                The code expires after 10 minutes`)
            ])
              /////remove comment later
            res.status(201).json({success: true});
        }else{
            res.status(201).json({success: false});
        }
        // const token = createToken(user._id);                    ///// not needed since we direct the user back to the login page
        // res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})

    }catch(err){
        console.log(err);
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

        await Promise.all([
            OTP.insert({phone_namber: phone_namber, code: code}),
            Email.sendEmail(email, 'Gammal Tech Verification Code',
                 `Your verification code is: ${code}\n
                The code expires after 10 minutes`)
        ])

        res.status(201).json({success: true});
        
        // const token = createToken(user._id);                    ///// not needed since we direct the user back to the login page
        // res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})

    }catch(err){
        res.status(201).json({success: false});
    }
}




