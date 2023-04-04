const mongoose = require('mongoose')
const express = require('express')
require('dotenv').config()

const timestamp = require('time-stamp');

const user = process.env.MONGOUSER;
const pass = process.env.MONGOPASS;
const url = `mongodb+srv://${user}:${pass}@gamedb.ykigcxy.mongodb.net/GameDB`;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(cursor => {
    console.log(timestamp('YYYY-MM-DD HH:mm:ss') + " ✔ Database connection established")
}).catch(err => {
    console.log(`${timestamp('YYYY-MM-DD HH:mm:ss')} ✘ Database connection failed: ${err}`)
    process.exit(0)
})
