//Created by Jaival Bhuptani - 6th April 2021

//This is Tweet Model
//Fields
//Tweeter - user who tweets
// tweetText - tweet body
// dateTweeted
// likedBy - an array of users who liked the tweet
// totalLikes - total like 
// retweets - total number of retweets
// originalTweetId - it stores an pointer to the original tweet if this tweet is a retweet
// isAThread - a flag that seperates tweets from threads
//thread - an array of tweets which are thread
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const tweetSchema = new schema({
    tweeter:{
        type: String,
        required: true,
    },
    tweetText:{
        type: String,
        required:true
    },
    dateTweeted:{
        type:Date,
        default:Date.now(),
        required:true
    },
    likedBy:[],
    totalLikes:{
        type:Number,
        default:0,
        required:true
    },
    retweets:{
        type:Number,
        default:0,
        required:true
    },
    originalTweetId:{
        type:String,
        default:" ",
        required:true
    },
    isAThread:{
        type:Boolean,
        default:false,
        required:true
    },
    thread:[{type: mongoose.Schema.Types.ObjectId, ref:'Tweet'}]
},{
    timestamps: true,
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet; 