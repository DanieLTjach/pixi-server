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
    socket.broadcast.emit("new_player", { name: socket.id, x: players[socket.id].x, y: players[socket.id].y});
  });

  socket.on("PRESS_W", function () {
    players[socket.id].y -= 1;
    io.emit("playerMoved", { name: socket.id, x: players[socket.id].x, y: players[socket.id].y, angle: -90});
  });
  socket.on("PRESS_S", function () {
    players[socket.id].y += 1;
    io.emit("playerMoved", { name: socket.id, x: players[socket.id].x, y: players[socket.id].y, angle: 90});
  });
  socket.on("PRESS_A", function () {
    players[socket.id].x -= 1;
    io.emit("playerMoved", { name: socket.id, x: players[socket.id].x, y: players[socket.id].y, angle: 180});
  });
  socket.on("PRESS_D", function () {
    players[socket.id].x += 1;
    io.emit("playerMoved", { name: socket.id, x: players[socket.id].x, y: players[socket.id].y , angle: 0});
  });

  socket.on("disconnect", function () {
    console.log(socket.io +"user disconnected");
    delete players[socket.id];
    io.emit("playerDisconnected", { name: socket.id});
  });
});

server.listen(2020, () => {
  console.log('listening on *:2020');
});