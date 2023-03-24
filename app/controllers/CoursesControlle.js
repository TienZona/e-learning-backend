const Course = require("../Models/Course");

class CoursesController {
  index(req, res) {}

  async findAll(req, res, next) {
    try {
      const results = await Course.find({ deleted: false });
      res.send(results);
    } catch (err) {
      res.send(err);
      console.log(err);
    }
  }

  async find(req, res, next) {
    try {
      const results = await Course.findOne({
        id: req.params.id,
        deleted: false,
      });
      res.send(results);
    } catch (err) {
      res.send(err);
      console.log(err);
    }
  }

  async findAuthor(req, res, next) {
    try {
      const data = await Course.find({
        "author.email": req.params.id,
        deleted: false,
      });
      res.send(data);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async create(req, res, next) {
    const data = req.body;
    const course = new Course(data.course);
    try {
      await course
        .save()
        .then((data) => res.send("Course created"))
        .catch((err) => res.send("Course not create"));
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async delete(req, res, next) {
    try {
      const respone = await Course.updateOne(
        { id: req.params.id },
        { deleted: true }
      );
      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async update(req, res, next) {
    try {
      const respone = await Course.updateOne(
        { id: req.params.id },
        req.body.course
      );
      console.log(req.body.course);
      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async joinCourse(req, res, next) {
    try {
      const respone = await Course.updateOne({ id: req.params.id }, req.body);
      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async getMember(req, res, next) {
    try {
      const respone = await Course.findOne({ id: req.params.id }, [
        "member",
        "author",
      ]);
      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async getStudyingClass(req, res, next) {
    try {
      const userEmail = req.params.id;

      const respone = await Course.find({
        "member.email": req.params.id,
        deleted: false,
      });
      
      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }
}

module.exports = new CoursesController();
