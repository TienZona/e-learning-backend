const express = require("express");
const app = require("./app");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const config = require("./app/config");
const { default: mongoose } = require("mongoose");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8888",
    methods: ["GET", "POST"],
  },
});

async function startServer() {
  try {
    await mongoose
      .connect(config.db.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Connected to the database!"))
      .catch((err) => console.error("Database conection error"));

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit();
  }
}

// socket io
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // when user join in room
  socket.on("join_room", (roomId, user) => {
    // user join in room
    socket.join(roomId);
    joinRoom(roomId, user, socket.id);
    console.log(`User with ID: ${socket.id} joined room: ${roomId}`);

    // receive user join in rom
    socket.emit("receive_user_join", selectRoom(roomId));
    socket.to(roomId).emit("receive_user_join", selectRoom(roomId));

    // send message handle
    socket.on("send_message", (data) => {
      addData(data);
      console.log(data.author + " send message room " + data.room);
      socket.to(data.room).emit("receive_message", selectRoom(roomId), data);
    });

    // handle user disconnected
    socket.on("disconnect", () => {
      removeUSer(roomId, socket.id);
      console.log("User Disconnected", socket.id);
      socket.to(roomId).emit("receive_user_disconnected", selectRoom(roomId));
    });
  });
});

startServer();

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
        if (user.socketID === socketID) newUsers.splice(index, 1);
      });

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
