const Meet = require("../Models/Meet");
const uuid = require("uuid");

class MeetController {
  index(req, res, next) {}

  async create(req, res, next) {
    try {
      const meet = new Meet(req.body);
      const room_id = uuid.v4();
      meet.id_room = room_id;
      await meet
        .save()
        .then((respone) => {
          res.send(respone);
        })
        .catch((err) => res.send(err));
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async closeRoom(req, res, next) {
    try {
      const respone = await Meet.updateOne(
        { id_room: req.params.id },
        {
          $set: {
            end: Date.now(),
          },
        }
      );
      console.log(respone)
      res.send(respone);
    } catch (err) {
      console.log(err);
      res.status(501);
    }
  }

  async findRoom(req, res, next) {
    try {
      const meet = await Meet.findOne({ id_room: req.params.id });
      res.send(meet);
    } catch (err) {
      console.log(err);
    }
  }

  async findMeetingRoom(req, res, next) {
    try {
      const date = new Date(req.query.date);
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const respone = await Meet.find({
        id_class: req.params.id,
        start: {
          $gte: firstDay,
          $lte: lastDay,
        },
      });
      res.send(respone);
    } catch (err) {
      console.log(err);
    }
  }

  async autoCreate(id_class, author) {
    const meet = new Meet({ id_class, author });
    const room_id = uuid.v4();
    meet.id_room = room_id;
    var data = false;
    await meet
      .save()
      .then((respone) => {
        data = respone;
      })
      .catch((err) => {
        console.log(err);
      });
    return data;
  }

  async joinRoom(req) {
    try {
      const meet = await Meet.findOne({ id_room: req.id_room });

      req.user.joinTime = Date.now();
      meet.members.push(req.user);

      const respone = await Meet.updateOne({ id_room: req.id_room }, meet);
      return meet;
    } catch (err) {
      console.log(err);
    }
  }

  async chat(req) {
    try {
      const itemChat = {
        auth: {
          name: req.name,
          email: req.email,
          avatar: req.avatar,
        },
        content: req.message,
        time: req.time,
        created_at: Date.now(),
      };
      const res = await Meet.updateOne(
        { id_room: req.room },
        {
          $push: {
            messages: itemChat,
          },
        }
      );
      return res.modifiedCount;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async outRoom(req) {
    try {
      const meet = await Meet.findOne({ id_room: req.id_room });
      meet.members = meet.members.map((member) => {
        if (member.userID === req.id) {
          member.outTime = Date.now();
          console.log(member.outTime);
        }
        return member;
      });
      const respone = await Meet.updateOne({ id_room: req.id_room }, meet);
      return meet;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new MeetController();
