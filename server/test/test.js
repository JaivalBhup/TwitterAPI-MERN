let server = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should()
chai.use(chaiHttp);
describe('Section 1 APIs', ()=>{
    describe("Test Login - route /api/users/login", ()=>{
        it("It should login the user",(done)=>{
            chai.request(server)
                .post('/api/user/login')
                .set('content-type', 'application/json')
                .send({username: 'JaivalBhuptani', password:"Jaivaln2529"})
                .end((err, response)=>{
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('Message').eq("Logged in successfully.");
                    response.body.should.have.property("User");
                    done();
                })
            })
    }),
    describe("Test Login failed by invalid credentials - route /api/users/login", ()=>{
        it("It should NOT login the user as credentials are not correct.",(done)=>{
            chai.request(server)
                .post('/api/user/login')
                .set('content-type', 'application/json')
                .send({username: 'JaivalBhuptani', password:"Jaival2529"})
                .end((err, response)=>{
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('Message').eq("Invalid username or password");
                    done();
                })
            })
    }),
    describe("Test Register - route /api/users/register", ()=>{
        it("It should register new user",(done)=>{
            chai.request(server)
                .post('/api/user/register')
                .set('content-type', 'application/json')
                .send({username: 'Jaival', password:"Jaivaln2529"})
                .end((err, response)=>{
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('Message').eq("Registered Successfully");
                    done();
                })
            })
    }),
    describe("Test Register failed by repeating username - route /api/users/register", ()=>{
        it("It should fail registration of a new user",(done)=>{
            chai.request(server)
                .post('/api/user/register')
                .set('content-type', 'application/json')
                .send({username: 'JaivalBhuptani', password:"Jaivaln2529"})
                .end((err, response)=>{
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('Message').eq("Username already exists try something else...");
                    done();
                })
            })
    }),
    describe("Test Register failed by invalid password use - route /api/users/register", ()=>{
        it("It should fail registration of a new user",(done)=>{
            chai.request(server)
                .post('/api/user/register')
                .set('content-type', 'application/json')
                .send({username: 'Jaival1', password:"Jaiva"})
                .end((err, response)=>{
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('Message').eq("Password should contain more than 5 character with atleast one uppercase, one lowercase and one number.");
                    done();
                })
            })
    })
})

describe('Section 2 APIs', ()=>{
    describe("Test send chat - route /api/user/send-message",()=>{
        it("This test will result in 403 error because user is not logged in.", done=>{
            chai.request(server)
                .post("/api/user/send-message")
                .set('content-type','application/json')
                .send({sender:'JaivalBhuptani', receiver:'NupurAdhvaryu'})
                .end((err, res)=>{
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property("Message").eq("User Not Logged in");
                    done();
                })
        })
    }),
    describe("Create Tweets - route /api/tweet/create-tweet",()=>{
        it("This test will result in 403 error because user is not logged in.", done=>{
            chai.request(server)
                .post("/api/tweet/create-tweet")
                .set('content-type','application/json')
                .send({text:'Hi this is new Tweet'})
                .end((err, res)=>{
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property("Message").eq("Login to Tweet");
                    done();
                })
        })
    }),
    describe("Read Tweets - route /api/tweet/get-all-tweets",()=>{
        it("This test will read all the tweets.", done=>{
            chai.request(server)
                .get("/api/tweet/get-all-tweets")
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property("tweets");
                    done();
                })
        })
    }),
    describe("Update Tweets - route /api/tweet/update-tweet",()=>{
        it("This test will result in 403 error because user is not logged in.", done=>{
            chai.request(server)
                .post("/api/tweet/update-tweet/sampleid")
                .set('content-type','application/json')
                .send({newText:'This is updated tweet'})
                .end((err, res)=>{
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property("Message").eq("Cannot update tweet.");
                    done();
                })
        })
    }),
    describe("Delete Tweets - route /api/tweet/delete-tweet",()=>{
        it("This test will result in 403 error because user is not logged in.", done=>{
            chai.request(server)
                .delete("/api/tweet/delete-tweet/sampleid")
                .end((err, res)=>{
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property("Message").eq("Cannot delete tweet.");
                    done();
                })
        })
    })
})