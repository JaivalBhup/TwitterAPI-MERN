//Created by Jaival Bhuptani - 6th April 2021

//This is a user model
//Fields: 
// username
// password
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const userSchema = new schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength:4
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minLength:6
    }
},{
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User; 