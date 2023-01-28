const express = require("express");
const meet = require("../controllers/meet.controller");

const router = express.Router();

router.route("/meet").post(meet.create);

module.exports = router;
