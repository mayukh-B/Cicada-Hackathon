require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const app = express()
const mongoose = require('mongoose')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
// const passport = require("passport");
// const session = require("express-session");
// const passportLocalMongoose = require("passport-local-mongoose");


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



//***********************************************************************************
//                            VIDEO CHAT ROUTE
//*********************************************************************************** 


var port = process.env.PORT || 5000;
server.listen(port, function () {
    console.log('Server has started on PORT : ' + port);
});