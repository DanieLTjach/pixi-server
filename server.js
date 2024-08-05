const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

const players = {};

io.on("connection", function (socket) {
  console.log(socket.id +" user connected");
  socket.emit("current_players", { players });
  socket.on("add_player", function (data) {
    players[socket.id] = data;
    socket.broadcast.emit("new_player", { name: socket.id, data });
  });
  socket.on("disconnect", function () {
    console.log(socket.io +"user disconnected");
    delete players[socket.id];
    io.emit("playerDisconnected", { name: socket.id});
  });
  socket.on("playerIsMoving", function (data) {
    players[socket.id] = data;
    console.log(data);
    socket.broadcast.emit("playerMoved", { name: socket.id, data });
  });
});

server.listen(2020, () => {
  console.log('listening on *:2020');
});