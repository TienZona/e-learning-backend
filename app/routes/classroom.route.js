const express = require("express");
const Post = require("../controllers/PostsController");
const PostReply = require("../controllers/PostReplysController")
const Exercise = require("../controllers/ExerciseController")
const Calender = require("../controllers/CalenderController")

const router = express.Router();

router.route("/post")
    .get(Post.findAll)
    .post(Post.create)

router.route("/post/:id")
    .get(Post.findOfClass)
    .delete(Post.delete)

router.route("/post/reply/:id")
    .get(PostReply.findOfPost)
    .post(PostReply.create)


router.route("/exercise")
    .post(Exercise.create)

router.route("/exercise/:id")
    .get(Exercise.findOfClass)

router.route("/student/exercise")
    .get(Exercise.findOfClassByStudent)
    .post(Exercise.submitExc)

router.route("/exercise/students/:id")
    .get(Exercise.findStudentExc)
    .post(Exercise.submitScore)

router.route("/calender/:id")
    .get(Calender.findOfClass)
    .post(Calender.create)

router.route("/calender")
    .get(Calender.findAll)

module.exports = router;
