const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

const httpServer = require('http').createServer((req, res) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

const io = require('socket.io')(httpServer);

io.on('connection', socket => {
  console.log('connect');
  socket.join("room1");

  socket.on('clienttoserver', (data) => {
    console.log(data);
    io.to("room1").emit("servertoclient", data);
  })
});

httpServer.listen(3000, '192.168.178.24', () => {
  console.log('go to 192.168.178.24:3000');
});