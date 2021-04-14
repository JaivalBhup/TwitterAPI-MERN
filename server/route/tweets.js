//Created by Jaival Bhuptani - 6th April 2021

//This is a view for /api/tweet route

const router = require('express').Router();
const e = require('express');
let Tweet = require("../models/Tweet");
let User = require("../models/User");

//GET /api/tweet/get-all-tweets
// returns all the tweets
router.route("/get-all-tweets").get((req, res)=>{
    Tweet.find({isAThread:false})
        .sort('-dateTweeted')
        .then(tweets=>res.status(200).json({"tweets":tweets}))
        .catch(err=>res.status(400).json({"Message":'Error '+ err}));
});

//POST /api/tweet/create-tweet
// Check for user session and creates a new post if the user is logged in
// returns 403 error if the user is not logged in.
//Payload body {tweetText}
router.route('/create-tweet').post((req,res)=>{
    let text = req.body.tweetText;
    if(!req.session.userId){
        return res.status(403).json({"Message":"Login to Tweet"});
    }
    User.findById(req.session.userId)
        .then((u)=>{
            var user = u.username
            let tweet = Tweet({tweeter:user, tweetText: text})
            tweet.save()
                .then(()=>res.status(201).json({"Tweet":tweet}))
                .catch(err=>res.status(400).json({"Message":"Tweet cannot be created "+ err}))
        })
});

//GET /api/tweet/get-tweet/:id
// returns the tweet for specified id
// url params - id.
router.route("/get-tweet/:id").get((req, res)=>{
    Tweet.findById(req.params.id)
        .then(tweet=>res.json({"tweet":tweet}))
        .catch(err=>res.status(404).json({"Message":"Cannot find tweet"}))
});

//POST /api/tweet/update-tweet/:id
// update the tweet of the specified id
//it will also update the latest update date
// returns 403 error if the user is not logged in.
// return 403 if the tweet is not tweeted by logged in user
//URL params - id
//Payload body - {text}
router.route('/update-tweet/:id').post((req,res)=>{
    let newText = req.body.text;
    if(!req.session.userId){
        return res.status(403).json({"Message":"Cannot update tweet."});
    }
    User.findById(req.session.userId)
        .then(user=>{
        Tweet.findById(req.params.id)
            .then(tweet=>{
                if(tweet.tweeter != user.username){
                    return res.status(403).json({"Message":"You cannot update this tweet"});
                }
                tweet.tweetText = newText;
                tweet.dateTweeted = Date.now();
                tweet.save()
                    .then(()=>res.status(200).json({"Message":"Tweet upated"}))
                    .catch(err=>res.status(400).json({"Message":"Cannot update tweet"}))
            })
    })
})

//DELETE /api/tweet/delete-tweet/:id
// Delete the tweet with the specified id
// returns 403 error if the user is not logged in.
// return 403 if the tweet is not tweeted by logged in user
//URL params - id

// If the deleted tweet is a retweet then this method will update the original tweet
router.route('/delete-tweet/:id').delete((req,res)=>{
    if(!req.session.userId){
        return res.status(403).json({"Message":"Cannot delete tweet."});
    }
    User.findById(req.session.userId)
        .then(user=>{
            Tweet.findById(req.params.id)
            .then(tweet=>{
                if(tweet.tweeter != user.username){
                    return res.status(403).json({"Message":"You cannot delete this tweet"});
                }
                if(tweet.originalTweetId != " "){
                    Tweet.findById(tweet.originalTweetId)
                        .then(orgTweet=>{
                            orgTweet.retweets -= 1;
                            orgTweet.save()
                                .then(()=>{
                                    Tweet.findByIdAndDelete(req.params.id)
                                        .then(()=>res.status(200).json({"Message":"Tweet Deleted"}))
                                        .catch(err=>req.status(400).json({"Message":"Could not delete this tweet"}))
                                })
                                .catch(err=>req.status(400).json({"Message":"Could not update originl tweet"}))
                        })
                }
                else{
                    Tweet.findByIdAndDelete(req.params.id)
                        .then(()=>res.status(200).json({"Message":"Tweet Deleted"}))
                        .catch(err=>req.status(400).json({"Message":"Could not delete this tweet"}))
                }
            })
        
    })
})
//POST /api/tweet/like-tweet/:id
// adds a like to the tweet
// returns 403 error if the user is not logged in.
//URL params - id

router.route('/like-tweet/:id').post((req,res)=>{
    if(!req.session.userId){
        return res.status(403).json({"Message":"Cannot like tweet."});
    }
    User.findById(req.session.userId)
        .then(user=>{
            Tweet.findById(req.params.id)
                .then(tweet=>{
                    if(!tweet.likedBy.includes(user.username)){
                        tweet.likedBy.addToSet(user.username);
                        tweet.totalLikes += 1
                        tweet.save()
                            .then(()=>res.status(201).json({"Message":"Tweet Liked by "+user.username}))
                            .catch(err=>res.status(400).json({"Message":"Cannot like tweet."}))
                    }
                    else{
                        return res.status(400).json({"Message":"Tweet already liked by "+user.username})
                    }
                })
            })
})
//POST /api/tweet/dislike-tweet/:id
//dislikes a post.
// returns 403 error if the user is not logged in.
router.route('/dislike-tweet/:id').post((req,res)=>{
    if(!req.session.userId){
        return res.status(403).json({"Message":"Cannot dislike tweet."});
    }
    User.findById(req.session.userId)
        .then(user=>{
            Tweet.findById(req.params.id)
                .then(tweet=>{
                    var delId = tweet.likedBy.indexOf(user.username);
                    if (delId != -1){
                        tweet.likedBy.splice(delId, 1)
                        tweet.totalLikes -= 1;
                        tweet.save()
                            .then(()=>res.status(201).json({"Message":"Tweet disliked by "+user.username}))
                            .catch(()=>res.status(400).json({"Message":"Tweet cannot be disliked"}))
                    }
                    else{
                        return res.status(400).json({"Message":"Tweet is not liked by "+user.username})
                    }
                    
                })
            })
})
// POST /api/tweet/retweet/:id
// retweets the post.
// returns 403 error if the user is not logged in.
//URL params - id
router.route('/retweet/:id').post((req, res)=>{
    if(!req.session.userId){
        return res.status(403).json({"Message":"Cannot retweet."});
    }
    User.findById(req.session.userId)
        .then(user=>{
            Tweet.findById(req.params.id)
                .then(tweet=>{
                    let retweet = Tweet({tweeter:user.username, tweetText: tweet.tweetText,originalTweetId:tweet.id})
                    retweet.save()
                        .then(()=>{
                            tweet.retweets += 1;
                            tweet.save()
                                .then(()=>{
                                    return res.status(201).json({"Tweet":retweet})
                                })
                                .catch(err=>res.status(400).json({"Message":"Error occured updating original tweet"}))
                            
                        })
                        .catch(err=>res.status(400).json({"Message":"Error occured retweet"}))
                })
        })
        .catch(err=>res.status(400).json({"Message":"Error finding user."}))

})
// POST /api/tweet/create-new-thread/:id
// Creates a new thread to tweet with specified if
// returns 403 error if the user is not logged in.
// return 403 if the tweet is not tweeted by logged in user
//URL params - id
//Payload body - {threadText}
router.route('/create-new-thread/:id').post((req,res)=>{
    let text = req.body.threadText;
    if(!req.session.userId){
        return res.status(403).json({"Message":"Cannot retweet."});
    }
    User.findById(req.session.userId)
        .then(user=>{
            Tweet.findById(req.params.id)
                .then(tweet=>{
                    let thread = Tweet({tweeter:user.username, tweetText: text, isAThread:true})
                    thread.save()
                        .then(()=>{
                            tweet.thread.addToSet(thread);
                            tweet.save()
                                .then(()=>res.status(201).json({"Message":"Thread Added"}))
                                .catch(err=>res.status(400).json({"Message":"Error attaching the thread"}))
                        })
                        .catch(err=>res.status(400).json({"Message":"Thread cannot be created "+ err})) 
                })
        })
})

module.exports = router