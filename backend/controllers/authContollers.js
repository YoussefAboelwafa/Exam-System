const { json } = require('express');
const User = require('../models/User');


const errorHandler = (err) => {
    console.log(err.message, err.code);
    let errors = {email: [], password: [] } /// add the rest later

    if(err.code === 11000){
        errors.email = 'Email already exists';
        return errors;
    }

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            console.log(properties.message);
            errors[properties.path].push(properties.message);
        });
    }

    return errors;
}



module.exports.signup_get = (req, res) =>{
    res.send('signup_get');
}

module.exports.signup_post = async (req, res) =>{
    const {email, password} = req.body;
    try{
        const user = await User.create({email, password});
        res.status(201).json(user);
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json(errors);
    }

}

module.exports.login_get = (req, res) =>{
    res.send('login_get');
}

module.exports.login_post = (req, res) =>{
    res.send('login_post');
}

