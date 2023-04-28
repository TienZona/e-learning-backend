const { Int32 } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const Surveys = new Schema({
  id_room: { type: String, require: true },
  author: { type: Object, require: true },
  heading: {type: String, require: true},
  answers: { type: Array, require: true },
  created: {type: Boolean, require: true},
  time: {type: Number, require: true},
  create_answer: {type: Boolean, require: true},
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Surveys", Surveys);
