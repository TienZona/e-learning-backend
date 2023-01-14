const express = require("express");
const contacts = require("../controllers/contact.controller");

const router = express.Router();

router.route("/").get(contacts.findAll);

module.exports = router;
