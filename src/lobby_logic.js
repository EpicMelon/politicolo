var io;
var socket;

var init = function (the_io, the_socket) {
    io = the_io;
    socket = the_socket;

    socket.on('create_lobby', randomLobbyId);
}

var test = function () {
    console.log("import is working.. ?");
}

function randomLobbyId () {
    var given_id = '';
    for (var i = 0; i < 4; i++) {
      given_id += Math.floor(10 * Math.random());
    }

    console.log("created id:" + given_id);

    socket.emit('goto', given_id);
}

module.exports.init = init;
module.exports.test = test;