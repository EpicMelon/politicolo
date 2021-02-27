// Our files
const server = require('./server.js');


// initializing express-session middleware
var Session = require('express-session');
var SessionStore = require('session-file-store')(Session);
var session = Session({store: new SessionStore({path: __dirname+'/tmp/sessions'}), secret: 'pass', resave: true, saveUninitialized: true});

// create express app
var express = require('express');
var app = express();
console.log('making static: ' + 'public');
app.use(express.static('public'));
app.use(session);

// Pages
app.get('', (req, res) => {
  res.sendFile('public/html/index.html', {root:'./'});
});

app.get('/room/([0-9]+)$', (req, res) => {
  res.sendFile('public/html/room.html', {root:'./'});
});

// Attach express app to server
const PORT = process.env.PORT || 3000;
var http = require('http');
var httpserver = http.createServer(app);
httpserver.listen(PORT, () => {
  console.log('listening on *:3000');
});

// create new socket.io app
var ios = require('socket.io-express-session');
var io = require('socket.io')(httpserver);
io.use(ios(session)); // session support

// initialize server
server.init(io);

io.on('connection', (socket) => {
  server.initSocket(socket);
});
