const express = require('express');
const pug = require('pug');
const path = require('path');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const discover = require('./src/main/routes/discover.route');

var app = express();

const PORT = process.env.PORT;

app.disable('x-powered-by');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/src/main/views'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

// Routes
app.use('/discover', discover);

 //App Listening
app.listen(PORT, () => {
    console.log(`Express started on port ${PORT}!`);
});
