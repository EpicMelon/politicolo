var socket = app.getSocket();

var roomname_text = document.getElementById('roomname');
var usersonline_text = document.getElementById('users online');


document.title = room_name + "ste kamer";
roomname_text.textContent = "de " + room_name + "ste kamer";

socket.on("new user", function(data) {
    if ((data) == "1") {
        usersonline_text.textContent = "Je bent alleen";
    }
    else {
        usersonline_text.textContent = data + " kamerleden";
    }
});