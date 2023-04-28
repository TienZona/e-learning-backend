const Calender = require("../Models/Calender");

class CalenderController {
  index(req, res, next) {}

  async create(req, res, next) {
    try {
      const calender = new Calender(req.body);
      await calender
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

  async findAll(req, res, next) {
    try {
      const respone = await Calender.find();

      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async getAll() {
    try {
      const respone = await Calender.find();

      return respone;
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async getStartTime() {
    try {
      const respone = await Calender.find({
        start_date: {
          $gte: Date.now() - 60000
        }
      });

      return respone;
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async findOfClass(req, res, next) {
    try {
      const respone = await Calender.find({
        id_class: req.params.id,
      });

      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }
}

module.exports = new CalenderController();
