const express = require("express");
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const homeRoutes = require('./routes/homeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const examinationRoutes = require('./routes/examinationRoutes');
const {checkUser, checkAdmin} = require('./middleware/authMiddleware')
const cors = require('cors');
const User = require('./models/User')
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");


const app = express();
app.use(cors({
    origin: ['https://youssefaboelwafa.github.io',
                'http://localhost:4200'], /// 
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const dbURI = process.env.dp_uri; ///
mongoose.connect(dbURI, 
    {useNewUrlParser: true, useUnifiedTopology: true,
        retryWrites: true})
    .then((result) => app.listen(8080))
    .catch((err) => console.log(err));



app.get('/is_signedin', (req, res) => {
    try{
        const token = req.cookies.jwt;
        if(token){
            jwt.verify(token, process.env.token_secret, async (err, decodedToken)=>{
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


app.use('/examination', checkUser, examinationRoutes)



/*
    Don't forget to change all the secrets to environment variables
    
*/