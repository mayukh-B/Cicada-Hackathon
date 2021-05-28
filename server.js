require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const passportLocalMongoose = require('passport-local-mongoose')
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
  address: String,
  dob: String,
  gender: String,
  score: Number,
})

userSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', userSchema)
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const user = new User({
  username: 'manju',
  password: '12345',
  name: 'Manjulika Mondal',
  email: 'manju@gamil',
  userPhNum: '334444',
  address: 'bonga',
  dob: '15-04-01',
  gender: 'female',
  score: 12,
})

app.get('/docLogin', function (req, res) {
  res.render('docLogin')
})
// user.save();
/*=======================================================================
                            CREATE DOCTOR SCHEMA
========================================================================*/
const docSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  userPhNum: Number,
  address: String,
  gender: String,
})

docSchema.plugin(passportLocalMongoose)
const Doc = mongoose.model('Doc', docSchema)
passport.use(Doc.createStrategy())
passport.serializeUser(Doc.serializeUser())
passport.deserializeUser(Doc.deserializeUser())

const doc = new Doc({
  username: 'manju',
  password: '12345',
  name: 'Manjulika Mondal',
  email: 'manju@gamil',
  userPhNum: '334444',
  address: 'bonga',
  gender: 'female',
})
app.get('/userLogin', function (req, res) {
  res.render('userLogin')
})
// doc.save();

app.get('/', function (req, res) {
  res.render('home')
})

app.get('/bookAppointment', (req, res) => {
  res.render('bookAppointment')
})

//***********************************************************************************
//                            VIDEO CHAT ROUTE
//***********************************************************************************

var port = process.env.PORT || 5000
server.listen(port, function () {
  console.log('Server has started on PORT : ' + port)
})
