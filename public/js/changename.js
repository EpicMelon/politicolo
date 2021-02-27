var socket = app.getSocket();

var username_form = document.getElementById('username_form');
var username_input = document.getElementById('username_input');

username_form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (username_input.value) {
      socket.emit('set username', username_input.value);;
      username_input.value = '';
    }
  });