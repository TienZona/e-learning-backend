const express = require("express");
const Course = require("../controllers/CoursesControlle");
const router = express.Router();

router.route("/").get(Course.findAll).post(Course.create);

router
  .route("/:id")
  .get(Course.find)
  .post(Course.create)
  .put(Course.update)
  .delete(Course.delete);

router.route("/search/:text").get(Course.search);

router.route("/member/:id").get(Course.getMember);

router.route("/join/:id").put(Course.joinCourse);

router.route("/studying/:id").get(Course.getStudyingClass);

router.route("/author/:id").get(Course.findAuthor);

module.exports = router;
