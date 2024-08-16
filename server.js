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

let can_use_object;
const players = {};
const objects = [
  {name: "NotUsable", x: 0, y: 0, texture: 'something', size: {width: 45, height: 45}, is_usable: false, hitbox: {x: -5, y: 5, width: 55, height: 55}},
  {name: "Usable", x: 300, y: 400, texture: 'something', size: {width: 45, height: 45}, is_usable: true, hitbox: {x: 300-5, y: 400-5, width: 55, height: 55}},
];


io.on("connection", function (socket) {
  console.log(socket.id + " user connected");
  socket.emit("current_players", { players });

  socket.on("add_player", function (data) {
    players[socket.id] = data;
    socket.broadcast.emit("new_player", { name: socket.id, x: players[socket.id].x, y: players[socket.id].y });
  });

  socket.emit("current_objects", { objects });
  
  socket.on("keys_controller", function (data) {
    players[socket.id].pressedKeys = data.keys;
   
    if (players[socket.id].pressedKeys.up === true) {
      let collisionDetected = false;
      for (let i = 0; i < objects.length; i++) {
        if(objects[i].is_usable){
          if (players[socket.id].x <= objects[i].hitbox.x + objects[i].hitbox.width &&
            players[socket.id].x + players[socket.id].size.width >= objects[i].hitbox.x &&
            players[socket.id].y <= objects[i].hitbox.y + objects[i].hitbox.height &&
            players[socket.id].y + players[socket.id].size.height >= objects[i].hitbox.y){
            can_use_object = objects[i].name;    
          }
          else{
            can_use_object = null;
          }
        }
        if (
          players[socket.id].x <= objects[i].x + objects[i].size.width &&
          players[socket.id].x + players[socket.id].size.width >= objects[i].x &&
          players[socket.id].y-1 <= objects[i].y + objects[i].size.height &&
          players[socket.id].y-1 + players[socket.id].size.height >= objects[i].y
        ) {
          collisionDetected = true;
          break;
        }

      }
      if (!collisionDetected) {
        players[socket.id].y -= 1;
      }
    }
    
    if (players[socket.id].pressedKeys.down === true) {
      let collisionDetected = false;
      for (let i = 0; i < objects.length; i++) {
        if(objects[i].is_usable){
          if (players[socket.id].x <= objects[i].hitbox.x + objects[i].hitbox.width &&
            players[socket.id].x + players[socket.id].size.width >= objects[i].hitbox.x &&
            players[socket.id].y <= objects[i].hitbox.y + objects[i].hitbox.height &&
            players[socket.id].y + players[socket.id].size.height >= objects[i].hitbox.y){
            can_use_object = objects[i].name;
          }
          else{
            can_use_object = null;
          }
        }
        if (
          players[socket.id].x <= objects[i].x + objects[i].size.width &&
          players[socket.id].x + players[socket.id].size.width >= objects[i].x &&
          players[socket.id].y+1 <= objects[i].y + objects[i].size.height &&
          players[socket.id].y+1 + players[socket.id].size.height >= objects[i].y
          ) {
          collisionDetected = true;
          break;
        }
        
      }
      if (!collisionDetected) {
        players[socket.id].y += 1;
      }
    }
    
    if (players[socket.id].pressedKeys.left === true) {
      let collisionDetected = false;
      for (let i = 0; i < objects.length; i++) {
        if(objects[i].is_usable){
          if (players[socket.id].x <= objects[i].hitbox.x + objects[i].hitbox.width &&
            players[socket.id].x + players[socket.id].size.width >= objects[i].hitbox.x &&
            players[socket.id].y <= objects[i].hitbox.y + objects[i].hitbox.height &&
            players[socket.id].y + players[socket.id].size.height >= objects[i].hitbox.y){
            can_use_object = objects[i].name;
          }
          else{
            can_use_object = null;
          }
        }
        if (
          players[socket.id].x-1 <= objects[i].x + objects[i].size.width &&
          players[socket.id].x-1 + players[socket.id].size.width >= objects[i].x &&
          players[socket.id].y <= objects[i].y + objects[i].size.height &&
          players[socket.id].y + players[socket.id].size.height >= objects[i].y
        ) {
          collisionDetected = true;
          break;
        }
      }
      if (!collisionDetected) {
        players[socket.id].x -= 1;
      }
    }
    
    if (players[socket.id].pressedKeys.right === true) {
      let collisionDetected = false;
      for (let i = 0; i < objects.length; i++) {
        if(objects[i].is_usable){
          if (players[socket.id].x <= objects[i].hitbox.x + objects[i].hitbox.width &&
            players[socket.id].x + players[socket.id].size.width >= objects[i].hitbox.x &&
            players[socket.id].y <= objects[i].hitbox.y + objects[i].hitbox.height &&
            players[socket.id].y + players[socket.id].size.height >= objects[i].hitbox.y){
            can_use_object = objects[i].name;
          }
          else{
            can_use_object = null;
          }
        }
        if (
          players[socket.id].x+1 <= objects[i].x + objects[i].size.width &&
          players[socket.id].x+1 + players[socket.id].size.width >= objects[i].x &&
          players[socket.id].y <= objects[i].y + objects[i].size.height &&
          players[socket.id].y + players[socket.id].size.height >= objects[i].y
        ) {

          collisionDetected = true;
          break;
        }
      }
      if (!collisionDetected) {
        players[socket.id].x += 1;
      }
    }
    if(players[socket.id].pressedKeys.use === true){
      for(let i = 0; i < objects.length; i++){
        if(objects[i].is_usable){
          if(objects[i].name === can_use_object){
            io.emit("object_used", {player_name: socket.id, object_name: can_use_object});
            break;
          }
        }
      }
    }
    if(can_use_object){
      io.emit("player_can_use", {player_name: socket.id, object_name: can_use_object});
    }
    else{
      io.emit("player_cannot_use", {player_name: socket.id, object_name: can_use_object});
    }
    io.emit("playerMoved", { name: socket.id, x: players[socket.id].x, y: players[socket.id].y });
  });
  
  socket.on("disconnect", function () {
    console.log(socket.id + " user disconnected");
    delete players[socket.id];
    io.emit("playerDisconnected", { name: socket.id });
  });
});

server.listen(2020, () => {
  console.log('listening on *:2020');
});
