require('dotenv').config()
const user = require('./user')
const socket = require('./socket')

const fs = require('fs')
const options = {
  key: fs.readFileSync('./https/localhost.key'),
  cert: fs.readFileSync('./https/localhost.crt'),
  ca: fs.readFileSync('./https/rootCA.pem'),
}

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const https = require('https').createServer(options, app)
const io = require('socket.io')(https)

const siofu = require("socketio-file-upload")

const bodyParser = require('body-parser')

const shared = require("express-socket.io-session")
const session = require('express-session')({
  resave: false, 
  saveUninitialized: true, 
  secret: process.env.cookie_secret, 
  cookie: { maxAge: 6000000 }
})

var forceSsl = require('express-force-ssl')

app.use(forceSsl)

app.use(express.static('./public'))
app.set('view engine', 'ejs')
app.set('views', './public/views/')

app.use(siofu.router)
app.use(bodyParser.json({
  verify: (req, _, buf) => {
    req.rawBody = buf.toString()
  },
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session)

io.use(shared(session, { autoSave:true }))

user(app)
socket(io,siofu)

//Start Server
http.listen(process.env.http_port, async () => {
  console.log(`Listening on HTTP Port: ${process.env.http_port}`)
})

https.listen(process.env.https_port, async () => {
  console.log(`Listening on HTTP Port: ${process.env.https_port}`)
})