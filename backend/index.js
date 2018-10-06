const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
const socketio = require('socket.io');
dotenv.config();

const discover = require('./src/main/routes/discover.route');

const app = express();

const PORT = process.env.PORT;

app.disable('x-powered-by');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/src/main/views'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

// Routes
app.use('/discover', discover);

// Setup for Angular
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append(
      'Access-Control-Allow-Headers',
      `Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, 
      X-Requested-With, Content-Type, Access-Control-Request-Method, 
      Access-Control-Request-Headers`
  );
  res.append('Access-Control-Allow-Credentials', true);
  next();
});

// App Listening
const server = app.listen(PORT, () => {
  console.log(`Express started on port ${PORT}!`);
});

let rooms = [];

// Socket set-up
const io = socketio.listen(server);
io.sockets.on('connection', (socket) => {
  socket.on('join', (data) => {
    if (!rooms.includes(data.room)) {
      rooms.push({room: data.room});
    }
    socket.join(data.room);
  });

  socket.on('message', (data) => {
    io.in(data.room).emit('new message', {
      user: data.user,
      message: data.message,
    });
    let messages = rooms[rooms.indexOf(data.room)].messages;
    messages.push(data.message);
  });

  socket.on('song-change', (data) => {

  });
});
