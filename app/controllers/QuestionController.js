const Question = require("../Models/Question");

class QuestionController {
  index(req, res, next) {}

  async create(req, res, next) {
    try {
      const question = new Question(req.body);
      const respone = await question.save();
      res.send(respone);
    } catch (err) {
      console.log(err);
      res.status(501);
    }
  }

  async vote(req) {
    try {
      const res = await Question.updateOne(
        { _id: req._id },
        { $set: { answers: req.answers } }
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  async findQuestion(req, res, next) {
    try {
      const question = await Question.find({ id_room: req.params.id });
      res.send(question);
    } catch (err) {
      console.log(err);
      res.status(501);
    }
  }

  async getQuestion(req) {
    try {
      const question = await Question.findOne({ _id: req });
      return question;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = new QuestionController();
