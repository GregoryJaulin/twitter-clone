//load Config
require('dotenv').config()

//start new DB Connexion
const mongoose = require('mongoose')

mongoose.connect(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
)

//setting up express server
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//middleware for loading user base on provided token
app.use(require('cookie-parser')())

//all routes for the API
app.use('/API/auth/', require('./routes/auth'))
app.use('/API/post/', require('./routes/post'))
app.use('/API/user/', require('./routes/user'))
app.use('/API/search/', require('./routes/search'))

app.use(require('./middlewares/error-handler'))

app.listen(3000, () => {
        console.log(`Yup, i'm listening on port 3000 !`)
})