require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
// const passport = require("passport");
// const session = require("express-session");
// const passportLocalMongoose = require("passport-local-mongoose");

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))


mongoose.connect(
  `mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.cebu5.mongodb.net/cicadaDB?retryWrites=true&w=majority`,
  { useUnifiedTopology: true, useNewUrlParser: true },
)

app.get('/', function (req, res) {
  res.render('index')
})

app.listen(5000, () => {
  console.log('server running at port 5000')
})
