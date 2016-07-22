'use strict'

let express = require('express')
let path = require('path')
let bodyParser = require("body-parser")
let mailRoute = require('./contactForm')

let app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('./public/dist'))

app.post('/contactform', mailRoute)

app.listen(3000)
console.log('node server listening on port 3000')