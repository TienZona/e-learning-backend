const Exercise = require("../Models/Exercise");
const SendMailer = require("../controllers/SendMailer");

class ExerciseController {
  index(req, res, next) {}

  async create(req, res, next) {
    const exc = req.body;
    exc.students = exc.students.map((student) => {
      return {
        email: student.email,
        name: student.name,
        avatar: student.avatar,
        submit: false,
        files: [],
        submit_time: null,
        score: 0,
      };
    });
    const exercise = new Exercise(req.body);
    const link = ` http://localhost:8888/classroom/${exercise.id_class}`;
    try {
      await exercise
        .save()
        .then((respone) => {
          console.log(respone);
          res.send(respone);
          const mails = exercise.students.map((student) => student.email);
          const title = "Bài tập mới " + exercise.title;
          const html =
            "<h2>Bạn có một bài tập mới</h2>" +
            `<p>${exercise.content}</p>` +
            `<p>Link lớp học: <a href="${link}">${link}</a></p>`;
          SendMailer.send(mails, title, html);
        })
        .catch((err) => res.send(err));
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async findOfClass(req, res, next) {
    try {
      const respone = await Exercise.find({
        deleted: false,
        id_class: req.params.id,
      }).sort({ created_at: -1 });
      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async submitScore(req, res, next) {
    const email = req.body.params.student.email;
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      "students.email": email,
    });

    exercise.students = exercise.students.map((student) => {
      if ((student.email = email))
        student.score = req.body.params.student.score;
      return student;
    });

    try {
      const respone = await Exercise.updateOne(
        { _id: req.params.id },
        exercise
      );
      res.json({ message: "Chấm điểm thành công", submit: true });
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async findOfClassByStudent(req, res, next) {
    try {
      const respone = await Exercise.find({
        deleted: false,
        id_class: req.query.id,
        "students.email": req.query.email,
      }).sort({ created_at: -1 });
      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async submitExc(req, res, next) {
    const exc = await Exercise.findOne({ _id: req.body.id_exc });
    const dateNow = new Date();
    const dateLate = new Date(exc.deadline);

    if (!exc.late && dateLate < dateNow) {
      res.json({ message: "Quá hạn", submit: false });
    } else {
      exc.students = exc.students.filter((student) => {
        if (student.email === req.body.email) {
          student.files = req.body.files;
          student.submit_time = dateNow;
          student.submit = true;
          student.score = 0;
          return student;
        } else {
          return student;
        }
      });
      try {
        const respone = await Exercise.updateOne({ _id: req.body.id_exc }, exc);
        res.json({ message: "Nộp bài thành công", submit: true });
      } catch (err) {
        res.status(501);
        console.log(err);
      }
    }
  }

  async findStudentExc(req, res, next) {
    try {
      const respone = await Exercise.findOne(
        {
          _id: req.params.id,
        },
        "students"
      );
      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }
}

module.exports = new ExerciseController();
