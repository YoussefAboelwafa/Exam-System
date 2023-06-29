const jwt = require('jsonwebtoken');
const User = require('../models/User')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'example secret', (err, decodedToken)=>{
            if(err){
                console.log('stranger danger, stranger danger');
                res.send('go away stranger');
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }else{
        console.log('stranger danger, stranger danger');
        res.send('go away stranger')
    }
}


const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'example secret', async (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                next();
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }else{
        // res.redirect('/login');
    }
}


module.exports = {requireAuth};