const express = require("express");
const app = require("./app");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const config = require("./app/config");
const { default: mongoose } = require("mongoose");
const uuid = require("uuid");
const server = http.createServer(app);
const timer = require("./timer.auto");
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
      .then(() => {
        console.log("Connected to the database!");
        // auto timer
        timer();
      })
      .catch((err) => console.error("Database conection error"));

    const PORT = config.app.port;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit();
  }
}

// socket io
const MeetController = require("./app/controllers/MeetController");
const SurveyController = require("./app/controllers/SurveyController");
const QuestionController = require("./app/controllers/QuestionController");

io.on("connection", (socket) => {
  // when user join in room

  socket.on("join_room", (roomId, user) => {
    // user join in room
    console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
    user.userID = socket.id;

    socket.join(roomId);

    // create meet
    MeetController.joinRoom({ id_room: roomId, user: user }).then((room) => {
      const members = room.members.filter((mem) => !mem.outTime);
      console.log(members);
      socket.to(roomId).emit("other-user-join", members);
    });

    socket.on("list-user", (list) => {
      socket.to(roomId).emit("list-user", list);
    });

    joinRoom(roomId, user, socket.id);

    // send message handle
    socket.on("send_message", (data) => {
      MeetController.chat(data).then((res) => {
        if (res) {
          io.to(roomId).emit("receive_message", data);
        }
      });
    });

    // survey
    socket.on("survey", (data) => {
      socket.to(roomId).emit("new-survey", data);
    });

    // question
    socket.on("question", (data) => {
      socket.to(roomId).emit("new-question", data);
    });

    socket.on("new-answer", (_id) => {
      SurveyController.getSurvey(_id).then((survey) => {
        socket.broadcast.to(roomId).emit("new-vote", survey);
      });
    });

    socket.on("vote", (vote) => {
      SurveyController.vote(vote).then((res) => {
        if (res.acknowledged) {
          SurveyController.getSurvey(vote._id).then((survey) => {
            socket.to(roomId).emit("new-vote", survey);
          });
        }
      });
    });

    socket.on("vote_answer", (vote) => {
      QuestionController.vote(vote).then((res) => {
        QuestionController.getQuestion(vote._id).then((question) => {
          socket.to(roomId).emit("new-question", question);
        });
      });
    });
    // handle user disconnected
    socket.on("disconnect", (data) => {
      removeUSer(roomId, socket.id);
      MeetController.outRoom({ id_room: roomId, id: socket.id }).then(
        (room) => {
          console.log("User Disconnected", socket.id);
          socket.to(roomId).emit("other-user-disconnected", socket.id);
        }
      );
      // console.log(data)
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
