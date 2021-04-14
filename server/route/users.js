//Created by Jaival Bhuptani - 6th April 2021

//This is a view for /api/users route

const router = require('express').Router();
const Message = require('../models/Messge');
const User = require("../models/User");

//Password validator
function CheckPassword(pass) 
{ 
    if(!pass){
        return false;
    }
    var cPass =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(pass.match(cPass)) 
    { 
        return true;
    }
    return false;
}

// GET /api/user/authenticate-user
//this method checks the current session and returns user if logged in else an 403 error
router.route('/authenticate-user').get((req,res)=>{
    if(!req.session.userId){
        return res.status(403).json({"Message":"User Not Logged in"})
    }
    User.findById(req.session.userId)
            .then((u)=>{
                return res.status(200).json({"User":u})
            })
})

// POST /api/user/register
//Adds a new user to the database.
// Checks for password and username to be unique.
//payload body - {username, password}
router.route("/register").post((req, res)=>{
    const uName = req.body.username;
    const pass = req.body.password;
    if (CheckPassword(pass)){
        const newUser = new User({
            username:uName,
            password:pass
        });
        newUser.save()
            .then(()=>{
                res.status(201).json({"Message":"Registered Successfully"});
                })
            .catch(e=>res.status(400).json({"Message":"Username already exists try something else..."}));
    }
    else{
        return res.status(400).json({"Message":"Password should contain more than 5 character with atleast one uppercase, one lowercase and one number."})
    }
});
//POST /api/user/login
// Creates a user session 
//payload body - {username, password}
router.route('/login').post((req,res)=>{
    const uName = req.body.username;
    const pass = req.body.password;
    User.findOne({username:{$eq:uName}, password:{$eq:pass}})
        .then(user=>{
            if(user){
                req.session.userId = user._id;
                return res.status(200).json({"Message":"Logged in successfully.","User":user});
            }
            return res.status(400).json({"Message":"Invalid username or password"});
        })
        .catch(err=>res.status(400).json({"Message":"Invalid username or password"}))
        
})
//GET /api/user/logout
// Destroys user session
router.route('/logout').get((req,res)=>{
   req.session.destroy((err)=>{
       if(err){
            return console.log(err)
       }
       res.json({"Message":"Logged out successfully."})
   })

})

//POST /api/user/send-message
// send a message to another user.
//Payload - {sender, reciever, messageText}
router.route('/send-message').post((req, res)=>{
    if(req.session.userId){
        const sender = req.body.sender;
        const receiver = req.body.receiver;
        User.findOne({username:{$eq:receiver}})
            .catch(err=>{
                return res.json({"Message":"User Not exists"})
            })
        const text = req.body.messageText;
        const message = new Message({
            sender: sender,
            receiver: receiver,
            messageText:text
        })
        message.save()
            .then(()=>{res.status(200).json({"Message":message})})
            .catch((err)=>res.status(400).json({"Message":"Error sending message "+ err}))

    }
    else{
        return res.status(403).json({"Message":"User Not Logged in"})
    }
})

//GET /api/user/get-all-messages
//Returns all the messages for the logged in user
// returns error if the user is not logged in
router.route('/get-all-messages').get((req, res)=>{
    if(req.session.userId){
        var uName;
        User.findById(req.session.userId)
            .then((u)=>{
                uName=u.username;
                Message.find({$or:[{'sender':uName},{'receiver':uName}]})
                    .then(messages=>res.json({"Messages":messages}))
                    .catch(err=>res.json({"Message":"Could not fetch meessages."}))
            })
        
    }
    else{
        return res.status(403).json({"Message":"User Not Logged in"})
    }
})


module.exports = router