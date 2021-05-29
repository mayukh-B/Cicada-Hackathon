require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const app = express()
const mongoose = require('mongoose')
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local").Strategy;
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(
  session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(
  `mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.cebu5.mongodb.net/cicadaDB?retryWrites=true&w=majority`,
  { useUnifiedTopology: true, useNewUrlParser: true },
)

/*=======================================================================
                            CREATE USER SCHEMA
========================================================================*/
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  userPhNum: Number,
  address:String,
  dob:String,
  gender: String,
  score: Number,
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User",userSchema);
passport.use('userLocal', new LocalStrategy(User.authenticate()));


/*=======================================================================
                            CREATE DOCTOR SCHEMA
========================================================================*/
const docSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  userPhNum: Number,
  address:String,
  gender: String,
  degree:String,
  pendingAppointment: [
    {
      patientName: String,
      timeSlot: String,
      description: String,
      email: String,
    },
  ],
  bookedAppointment: [
    {
      patientName: String,
      timeSlot: String,
      description: String,
      email: String,
    },
  ],
});

  docSchema.plugin(passportLocalMongoose);
  const Doc = mongoose.model("Doc",docSchema);
  passport.use('docLocal', new LocalStrategy(Doc.authenticate()));

  /*=======================================================================
                            SERIALIZE AND DESERIALIZE
========================================================================*/

passport.serializeUser(function(user, done) { 
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  if(user!=null)
    done(null,user);
});

app.get("/" , function(req,res){
  res.render("home");
});

/*=======================================================================
                            HOME ROUTE
========================================================================*/
app.get("/docLogin" , function(req,res){
  res.render("docLogin");
});

/*=======================================================================
                            USER LOGIN
========================================================================*/
app.get("/userLogin" , function(req,res){
  res.render("userLogin");
});

app.post("/userLogin", function(req, res) {
  const user = new User({
      username: req.body.username,
      password: req.body.password,
  });

    req.login(user, function(err) {
        if (err) {
            console.log(err);
        } 
        else{
          // passport.authenticate("local")(req,res,function(){
          //   res.redirect("/userLanding")
          // })

          passport.authenticate('userLocal')(req, res, function () {
          res.redirect('/userLanding');
          });
        }
    });
});

/*=======================================================================
                            USER REGISTER
========================================================================*/

app.get('/userRegister', function (req, res) { 
      res.render('userRegister');
});

app.post('/userRegister', function (req, res) {
  User.register({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        userPhNum: req.body.phnum,
        address:req.body.address,
        dob:req.body.dob,
        gender: req.body.gender,
      }, req.body.password,
      function(err,user){
        if(err){
          console.log(err);
          res.redirect("/userRegister");
        }
        else{
        
          passport.authenticate('userLocal')(req, res, function () {
          res.redirect('/userLanding');
          });
        }
      }
  )
    });
 
/*=======================================================================
                            USER LANDING
========================================================================*/
app.get('/userLanding', function (req, res) { 
  if(req.isAuthenticated()){
    res.render('userLanding');
    console.log(req.user);
  }
  else{
    res.redirect("/userLogin");
  }
});

/*=======================================================================
                            DOCTOR LOGIN
========================================================================*/
app.get("/docLogin" , function(req,res){
  res.render("docLogin");
});

app.post("/docLogin", function(req, res) {
  const doc = new Doc({
      username: req.body.username,
      password: req.body.password,
  });

    req.login(doc, function(err) {
        if (err) {
            console.log(err);
        } 
        else{
          // passport.authenticate("local")(req,res,function(){
          //   res.redirect("/userLanding")
          // })

          passport.authenticate('docLocal')(req, res, function () {
          res.redirect('/docLanding');
          });
        }
    });
});

/*=======================================================================
                            DOCTOR REGISTER
========================================================================*/

app.get('/docRegister', function (req, res) { 
  res.render('docRegister');
});

app.post('/docRegister', function (req, res) {
Doc.register({
  username: req.body.username,
  name: req.body.name,
  email: req.body.email,
  userPhNum: req.body.phnum,
  address:req.body.address,
  gender: req.body.gender,
  }, req.body.password,
  function(err,doc){
    if(err){
      console.log(err);
      res.redirect("/docRegister");
    }
    else{
      passport.authenticate('docLocal')(req, res, function () {
        res.redirect('/docLanding');
      })
    }
  }
)
});
/*=======================================================================
                            DOCTOR FIND
========================================================================*/
app.get("/api/doctors",(req,res)=>{
  Doc.find({},(err,foundUsers)=>{
      if(err){
          console.log(err);
      }else{
          res.json(foundUsers);
      }
  })
})
/*=======================================================================
                            SEARCH
========================================================================*/

app.get("/users/search",(req,res)=>{
  res.render("searchPage")
})


/*=======================================================================
                            USER ROUTE DOCTOR PROFILE
========================================================================*/
app.get("/users/doctors/:id",(req,res)=>{
  const requestedDoctorId = req.params.id;
  Doc.find({_id:requestedDoctorId},(err,foundDoctor)=>{
    if(err){
      console.log(err);
    }else{
      console.log(foundDoctor);
    }
  })
})
/*=======================================================================
                            DOCTOR LANDING
========================================================================*/
app.get('/docLanding', function (req, res) { 
  if(req.isAuthenticated()){
    let name = req.user.name;
    let email = req.user.email;
    let phNum = req.user.userPhNum;
    let address = req.user.address;
    let degree = req.user.degree;
    let gender = req.user.gender;
    let pending = req.user.pendingAppointment;
    res.render('docLanding', {name, email, phNum, address, degree, gender, pending});
  }
  else{
    res.redirect("/docLogin");
  }
});

//***********************************************************************************
//                            VIDEO CHAT ROUTE
//*********************************************************************************** 
app.get('/VideoCall', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('VideoChat', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId)
    socket.on("chat-msg", function (data) {
      io.to(roomId).emit("chat-msg", data);
    });
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-connected', userId)
    })
  })
})

var port = process.env.PORT || 5000;
server.listen(port, function () {
    console.log('Server has started on PORT : ' + port);
});


//***********************************************************************************
//                            QUIZ ROUTE
//*********************************************************************************** 

app.get("/userLanding",(req,res)=>{
    res.render('userLanding')
})

app.get("/user/quiz",(req,res)=>{
    res.render('quiz')
})

app.post("/user/quiz",(req,res)=>{
    res.redirect('/user/quiz')
})

app.get("/user/result",(req,res)=>{
    res.render('result')
})

app.post("/user/result",(req,res)=>{
    console.log(req.body)
    res.redirect('/user/result')
})


//***********************************************************************************
//                            ACTIVITIES
//*********************************************************************************** 
app.get("/user/activities",(req,res)=>{
    res.render('quiz')
})
// app.get("/user/:id",(req,res) => {
//   // if(req.isAuthenticated()){
//     const reqUser = req.params.id;
//     res.render("userProfile")
//   // }else{
//   //   res.redirect("/userLogin");
//   // }

// })

