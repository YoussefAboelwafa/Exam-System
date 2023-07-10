const express = require("express");
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const homeRoutes = require('./routes/homeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const {checkUser, checkAdmin} = require('./middleware/authMiddleware')
const cors = require('cors');
const User = require('./models/User')
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

const token_secrect = 'LVeKzFIE8WwhaBpKITdyMSDKbQMPFI4g'

const app = express();
app.use(cors({
    origin: 'https://youssefaboelwafa.github.io', /// 
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const dbURI = 'mongodb+srv://heshamyoussef:ZbyFJgPGRpHmQMXA@booking-system.jrs9uu7.mongodb.net/mydb?retryWrites=true'; ///
mongoose.connect(dbURI, 
    {useNewUrlParser: true, useUnifiedTopology: true,
        retryWrites: true})
    .then((result) => app.listen(process.env.PORT || 8080 || 3000))
    .catch((err) => console.log(err));



app.get('/is_signedin', (req, res) => {
    try{
        const token = req.cookies.jwt;
        console.log(token);
        if(token){
            jwt.verify(token, token_secrect, async (err, decodedToken)=>{
                if(err){
                    console.log(err.message);
                    res.json({signed_in: false});
                }else{
                    console.log(decodedToken);
                    let user = await User.findById(decodedToken.id);
                    res.json({signed_in: true});
                }
            })
        }else{
            res.json({signed_in: false});
       }
    }catch(err){
        console.log(err);
        res.json({signed_in: false});
    }
});

app.use(authRoutes);
app.use('/home', checkUser, homeRoutes); ////add requiredAuth after finishing testing
app.use('/exam', checkUser, examRoutes);
app.use('/admin', checkAdmin, adminRoutes)



