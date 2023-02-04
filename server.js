const express = require("express");
const app = require("./app");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8888",
    methods: ["GET", "POST"],
  },
});

var rooms = [];
var host = {
  username: "",
  id: "",
};

const joinRoom = (id, user, socketID) => {
  user.socketID = socketID;
  if (rooms.find((item) => item.id === id)) {
    rooms = rooms.map((item) => {
      if (item.id === id) {
        item.users.push(user);
        item = {
          id: item.id,
          users: item.users,
          data: item.data,
        };
      }

      return item;
    });
  } else {
    console.log("add new room");
    const newRoom = {
      id,
      users: [user],
      data: [],
    };

    host = {
      username: user,
      id,
    };

    rooms.push(newRoom);
  }
};

const removeUSer = (roomID, socketID) => {
  rooms = rooms.map((room) => {
    if (room.id == roomID) {
      const newUsers = room.users;

      room.users.forEach((user, index) => {
        if(user.socketID === socketID)
          newUsers.splice(index, 1);
      })

      room.users = newUsers;
    } 
    return room;
  });
};

const addData = (data) => {
  rooms.map((room) => {
    if (room.id === data.room) {
      room.data = [data];
      return room;
    } else {
      return room;
    }
  });
};

const selectRoom = (roomID) => {
  return rooms.filter((item) => item.id == roomID)[0];
};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // when user join in room
  socket.on("join_room", (roomId, user) => {
    socket.join(roomId);
    console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
    joinRoom(roomId, user, socket.id);
    socket.to(roomId).emit("receive_user_join", selectRoom(roomId), user);

    socket.on("send_message", (data) => {
      addData(data);
      console.log(data.author + " send message room " + data.room);
      socket.to(data.room).emit("receive_message", selectRoom(roomId), data);
    });

    socket.on("disconnect", () => {
      removeUSer(roomId, socket.id);
      console.log("User Disconnected", socket.id);
    });
  });
});

server.listen(3000, () => {
  console.log("SERVER RUNNING");
});
