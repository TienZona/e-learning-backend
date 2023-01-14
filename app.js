const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const contactsRouter = require("./app/routes/contact.route");
const { v4: uuidV4 } = require("uuid");

const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(cors());
app.use(express.json());

// handle

app.get("/metting", (req, res) => {
  res.json({ message: "aaaa" });
});

app.get("/hello", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    var roomData = {
      id: roomId,
      data: [],
    };

    socket.join(roomId);
    io.to(roomId).emit("test", "userID: " + userId);
    socket.to(roomId).emit("user-connected", userId);

    socket.to(roomId).on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });

    socket.to(roomId).on("create-user", (roomID, data) => {
      roomData.id = roomID;
      roomData.data.push(data);
      io.to(roomId).emit("list-user-connected", roomData);
      // socket.emit("users", `${users}`);
    });
  });
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal server Error",
  });
});

module.exports = app;
