const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const users = require('socket.io.users');

var room_counts = {};
var max_room_id = 1000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/room/:code', (req, res) => {
  res.sendFile(__dirname + '/room.html');
});

io.on('connection', (socket) => {
  socket.username = "Someone";

  var room_id = "lobby";

  // --- Lobby ---
  socket.on('create_lobby', function () {
    var given_id = Math.round(max_room_id * Math.random());

    // TODO check dat ie niet al bestaat enzo;

    socket.emit('goto', given_id);
  });

  // --- Rooms ---

  // Join room
  socket.on('joinroom', function(room) {
    this.join(room);

    room_id = room;

    if (typeof room_counts[room] == "undefined") {
      room_counts[room] = 0;
    }
    room_counts[room] = room_counts[room] + 1;

    io.to(room).emit("new user", room_counts[room]);

    io.to(room_id).emit('status message', socket.username+" joined the room.");
    console.log("[Room " + room_id + "] Someone joined");
  });

  // Chat in room
  socket.on('chat message', (msg) => {
    io.to(room_id).emit('chat message', socket.username+": "+msg);
    console.log("[Room " + room_id + "] " + msg);
  });

  // Communication back
  socket.on('disconnect', () => {
    if (typeof room_counts[room_id] == "undefined") {
      room_counts[room_id] = 0;
    }
    room_counts[room_id] = room_counts[room_id] - 1;
     
    io.to(room_id).emit("new user", room_counts[room_id]);

    io.to(room_id).emit('status message', socket.username+" left the room.");
    console.log("[Room " + room_id + "] Someone left");
  });

  // set username
  socket.on('set username', function (username) {
    socket.username = username; // this dont work

    console.log(socket.id);
  });
});

http.listen(3000, "192.168.178.24", () => {
  console.log('listening on *:3000');
});