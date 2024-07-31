const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

const players = {};

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

io.on('connection', (socket) => {
  console.log(socket.id + ' user connected');
  players[socket.id] = { x: 0, y: 0 };

  socket.emit('init', { id: socket.id, players });
  socket.broadcast.emit('newPlayer', { id: socket.id, x: 0, y: 0 });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    delete players[socket.id];
    socket.broadcast.emit('playerDisconnected', { id: socket.id });
});   

    socket.on('move', (data) => {
        players[socket.id].x = data.x;
        players[socket.id].y = data.y;
        socket.broadcast.emit('playerMoved', { id: socket.id, x: data.x, y: data.y });
    });
});

server.listen(2020, () => {
  console.log('listening on *:2020');
});
