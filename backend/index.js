const express = require("express");
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const {requireAuth} = require('./middleware/authMiddleware')
const cors = require('cors');
const User = require('./models/User')

const app = express();
app.use(cors());
app.use(express.json());

const dbURI = 'mongodb+srv://admin:7RUA6rN0a8FkISWy@cluster0.nbw43uf.mongodb.net/mydb'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(8080))
    .catch((err) => console.log(err));



app.get('/is_signedin', (req, res) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'example secret', async (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.json({signed_in: false});
            }else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.json({user: user, signed_in: true});
            }
        })
    }else{
        res.json({signed_in: false});
    }
});


// app.use('/home', requireAuth, )
app.use(authRoutes);


