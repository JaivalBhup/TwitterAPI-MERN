//Created by Jaival Bhuptani - 6th April 2021

//This is a message model
//fields:
// sender
// reciever
// messageText
// dateSent
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const messageSchema = new schema({
    sender:{
        type: String,
        required: true,
    },
    receiver:{
        type: String,
        required: true,
    },
    messageText:{
        type: String,
        required:true
    },
    dateSent:{
        type:Date,
        default:Date.now(),
        required:true
    },
},{
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message; 