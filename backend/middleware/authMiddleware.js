const jwt = require('jsonwebtoken');
const User = require('../models/User')


const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.token_secret, (err, decodedToken)=>{
            if(err){
                console.log('stranger danger, stranger danger');
                res.send('go away stranger');
            }else{
                next();
            }
        })
    }else{
        console.log('stranger danger, stranger danger');
        res.send('go away stranger')
    }
}

const checkAdmin = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.token_secret, (err, decodedToken)=>{
            if(err){
                console.log('stranger danger, stranger danger');
                res.send('go away stranger');
            }else{
                if(decodedToken.admin){
                    next();
                }else{
                    console.log('stranger danger, stranger danger');
                    res.send('go away stranger');
                }
            }
        })
    }else{
        console.log('stranger danger, stranger danger');
        res.send('go away stranger')
    }
}






module.exports = {checkUser , checkAdmin};