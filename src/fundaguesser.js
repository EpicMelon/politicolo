// Set up
var io;

// Parse questions
var fs = require('fs');
var data = fs.readFileSync('src/houses.json', 'utf8');
var houses = JSON.parse(data);

// CONFIG
var delay = 5000.0;

var init = function(the_io) {
    io = the_io;

    console.log("Set up game.");
  }
  
var initSocket = function (socket) {
  socket.on('start game', () => startGame(socket));
}


function startGame(socket) {
  recursiveGameLoop(socket.room_id, 0);
}

function recursiveGameLoop(room, index) {
  showHouse(room, index);

  if (houses[index+1]) {
    setTimeout(function() {recursiveGameLoop(room, index+1)}, delay);
  }
  else {
    io.to(room).emit('finish quiz');
  }
}

function showHouse(room, index) {
  console.log("Showing House " + index);

  houseData = houses[index];
  io.to(room).emit('show house', houseData);
}

module.exports.init = init;
module.exports.initSocket = initSocket;