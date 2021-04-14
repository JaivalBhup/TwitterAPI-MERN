//Created by Jaival Bhuptani - 6th April 2021

// Express, cors, express-session, mongoose
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');

require('dotenv').config();

//middleware
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(session({
    secret:process.env.SESSION_SECRET, 
    resave:false, 
    saveUninitialized:true,
}))
app.use(express.json());

// Connetion to mongoDB Atlas
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log("MongoDB connection established!")
})

//Routes
const usersRoute = require('./route/users');
const tweetRoute = require('./route/tweets');
app.use('/api/tweet', tweetRoute);
app.use('/api/user', usersRoute);

var server = app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
});

module.exports = server