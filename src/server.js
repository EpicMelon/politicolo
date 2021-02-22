// Set up
var io;

// Variables
var room_id;
var room_counts = {};
var question_count = {};

var fs=require('fs');
var data=fs.readFileSync('src/questions.json', 'utf8');
var questions=JSON.parse(data);

var init = function(the_io) {
  io = the_io;
  console.log("set up io");
}

var initSocket = function (socket) {
  socket.username = "Anoniem"
  socket.room_id = "lobby"

  socket.on('create_lobby', () => randomLobbyId(socket));

  socket.on('joinroom', (room) => joinRoom(socket, room));
  socket.on('chat message', (msg) => sendMessage(socket, msg));
  socket.on('disconnect', () => disconnect(socket));

  socket.on('set username', (username) => changeUsername(socket, username));

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
}

function randomLobbyId (socket) {
    var given_id = '';
    for (var i = 0; i < 4; i++) {
      given_id += Math.floor(10 * Math.random());
    }
    console.log("created id:" + given_id);

    socket.emit('goto', given_id);
}

// --- Rooms ---

// Join room
function joinRoom(socket, room) {
  socket.room_id = room;

  socket.join(room);

  if (typeof room_counts[room] == "undefined") {
    room_counts[room] = 0;
  }
  room_counts[room] = room_counts[room] + 1;
  question_count[room] = 0;

  io.to(room).emit("new user", room_counts[room]);

  io.to(room).emit('status message', socket.username + " is de kamer binnengekomen.");

  console.log("[Room " + room + "] " + socket.username + " joined");
}

function sendMessage(socket, msg) {
  io.to(socket.room_id).emit('chat message', socket.username + ": " + msg);
  console.log("[Room " + socket.room_id + "] " + socket.username + ": " + msg);
}

function disconnect (socket) {
  if (typeof room_counts[socket.room_id] == "undefined") {
    room_counts[socket.room_id] = 0;
  }
  room_counts[socket.room_id] = room_counts[room_id] - 1;
    
  io.to(socket.room_id).emit("new user", room_counts[socket.room_id]);
  io.to(socket.room_id).emit('status message', socket.username  +" heeft de kamer verlaten.");
  console.log("[Room " + socket.room_id + "] " + socket.username + " left");

  socket.leave(socket.room_id);
  socket.room_id = "";
}

  // set username
function changeUsername(socket, username) {
  io.to(socket.room_id).emit('status message', socket.handshake.session.username  +" heeft zich hernoemd tot " + username + ".");

  socket.username = username;

  // socket.handshake.session.username = username; Voor als we willen redirecten
  // socket.handshake.session.save();

  console.log('Registered username: ' + username);
}

module.exports.init = init;
module.exports.initSocket = initSocket;