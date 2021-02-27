var socket = app.getSocket();

// create lobby
var create_button = document.getElementById('create button');

create_button.addEventListener('submit', function(e) {
    e.preventDefault();

    socket.emit('create_lobby');
    
    socket.on('goto', function(id) {
    window.location.replace(window.location + "room/" + id);
    });
});

// join lobby
var join_button = document.getElementById('join button');
var code = document.getElementById('code input');

join_button.addEventListener('submit', function(e) {
    e.preventDefault();

    if (code.value != '') {        
    window.location.replace(window.location + "room/" + code.value);
    }
});