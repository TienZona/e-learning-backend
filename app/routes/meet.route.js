const express = require("express");
const Meet = require("../controllers/MeetController");
const Survey = require("../controllers/SurveyController");
const Question = require("../controllers/QuestionController");
const router = express.Router();

router.route("/").post(Meet.create);
router.route("/:id").get(Meet.findMeetingRoom).delete(Meet.closeRoom);
router.route("/chat/:id").post(Meet.chat);
router.route("/room/:id").get(Meet.findRoom);
router.route("/survey").post(Survey.create);
router.route("/survey/:id").get(Survey.findSurvey);

router.route("/survey/create_ans").post(Survey.createAns);
router.route("/question").post(Question.create);
router.route("/question/:id").get(Question.findQuestion);


module.exports = router;
