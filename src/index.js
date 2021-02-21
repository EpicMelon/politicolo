// Our files
const lobby_logic = require('./lobby_logic.js');

lobby_logic.test();

const PORT = process.env.PORT || 3000;

// initializing express-session middleware
var Session = require('express-session');
var SessionStore = require('session-file-store')(Session);
var session = Session({store: new SessionStore({path: __dirname+'/tmp/sessions'}), secret: 'pass', resave: true, saveUninitialized: true});

// create express app
var express = require('express');
var app = express();
app.use(session);

// Pages
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/room/:code', (req, res) => {
  res.sendFile(__dirname + '/room.html');
});

// Attach express app to server
var http = require('http');
var server = http.createServer(app);
server.listen(PORT, () => {
  console.log('listening on *:3000');
});

// create new socket.io app
var ios = require('socket.io-express-session');
var io = require('socket.io')(server);
io.use(ios(session)); // session support

// QUIZOOO
// let questions = require('questions.json');
var fs=require('fs');
var data=fs.readFileSync('src/questions.json', 'utf8');
var questions=JSON.parse(data);

var room_counts = {};
var question_count = {};

// sockets
io.on('connection', (socket) => {
  var room_id = "lobby";

  // --- Lobby ---
  lobby_logic.init(io, socket);

  // --- Rooms ---

  // Join room
  socket.on('joinroom', function(room) {
    this.join(room);

    room_id = room;

    if (typeof room_counts[room] == "undefined") {
      room_counts[room] = 0;
    }
    room_counts[room] = room_counts[room] + 1;
    question_count[room] = 0;

    io.to(room).emit("new user", room_counts[room]);

    io.to(room_id).emit('status message', socket.handshake.session.username + " is de kamer binnengekomen.");

    console.log("[Room " + room_id + "] " + socket.handshake.session.username + " joined");
  });

  // Chat in room
  socket.on('chat message', (msg) => {
    io.to(room_id).emit('chat message', socket.handshake.session.username + ": " + msg);
    console.log("[Room " + room_id + "] " + socket.handshake.session.username + ": " + msg);
  });

  // Communication back
  socket.on('disconnect', () => {
    if (typeof room_counts[room_id] == "undefined") {
      room_counts[room_id] = 0;
    }
    room_counts[room_id] = room_counts[room_id] - 1;
     
    io.to(room_id).emit("new user", room_counts[room_id]);

    io.to(room_id).emit('status message', socket.handshake.session.username  +" heeft de kamer verlaten.");
    console.log("[Room " + room_id + "] " + socket.handshake.session.username + " left");
  });

  // set username
  socket.on('set username', function (username) {
    io.to(room_id).emit('status message', socket.handshake.session.username  +" heeft zich hernoemd tot " + username + ".");

    socket.handshake.session.username = username;
    socket.handshake.session.save();

    console.log('Registered username: ' + socket.handshake.session.username);
  });

  // --- Quizoo ---
  socket.on('new question', function () {
    q_data = questions[question_count[room_id]]

    if (q_data) {
      io.to(room_id).emit('show question', q_data);
    } else {
      io.to(room_id).emit('finish quiz', 5);
    }

    // next question
    question_count[room_id]++;
  });
});
