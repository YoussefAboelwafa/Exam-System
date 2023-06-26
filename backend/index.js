const express = require("express");
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

const dbURI = 'mongodb+srv://admin:7RUA6rN0a8FkISWy@cluster0.nbw43uf.mongodb.net/mydb'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(8080))
    .catch((err) => console.log(err));



app.use(authRoutes);


