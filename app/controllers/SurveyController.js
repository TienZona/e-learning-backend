const { response } = require("../../app");
const Survey = require("../Models/Survey");

class SurveyController {
  index(req, res, next) {}

  async create(req, res, next) {
    try {
      const survey = new Survey(req.body);
      const respone = await survey.save();
      res.send(respone);
    } catch (err) {
      console.log(err);
      res.status(501);
    }
  }

  async vote(req) {
    try {
      const res = await Survey.updateOne(
        { _id: req._id },
        { $set: { answers: req.answers } }
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  async find(req, res, next) {
    try {
      const survey = await Survey.findOne({ _id: req.params.id });
      return survey;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async findSurvey(req, res, next) {
    try {
      const survey = await Survey.find({ id_room: req.params.id });
      res.send(survey);
    } catch (err) {
      console.log(err);
      res.status(501);
    }
  }

  async getSurvey(req) {
    try {
      const survey = await Survey.findOne({ _id: req });
      return survey;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async createAns(req, res, next) {
    try {
      const respone = await Survey.updateOne(
        { _id: req.body._id },
        {
          $push: {
            answers: {
              content: req.body.content,
              vote: [],
            },
          },
        }
      );
      res.send(respone);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new SurveyController();
