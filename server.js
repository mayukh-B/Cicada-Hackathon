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
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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
});

docSchema.plugin(passportLocalMongoose);
const Doc = mongoose.model("Doc",docSchema);
passport.use(Doc.createStrategy());
passport.serializeUser(Doc.serializeUser());
passport.deserializeUser(Doc.deserializeUser());



app.get("/" , function(req,res){
  res.render("home");
});

app.get("/docLogin" , function(req,res){
  res.render("docLogin");
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


