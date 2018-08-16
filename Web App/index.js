const express = require('express');
const pug = require('pug');
const path = require('path');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const index = require('./src/main/routes/index.route');

var app = express();

const PORT = process.env.CLIENT_ID;

// Hides information about the server from the header
app.disable('x-powered-by');

// Template engine attributes
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

// Routes
app.use('/', index);

// Catch 404
app.use(function(req, res, next) {
    next(createError(404));
});
  
// Handle Error
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message
    });
});

 //App Listening
app.listen(PORT, () => {
    console.log("Express started!");
});
