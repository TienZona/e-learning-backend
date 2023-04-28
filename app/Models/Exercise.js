const mongoose = require("mongoose");
const { Schema } = mongoose;

const Exercise = new Schema({
  id_class: { type: String, maxLength: 12, require: true },
  author: { type: Object, require: true },
  title: { type: String, maxLength: 100, require: true },
  content: { type: String, require: true },
  students: { type: Array, require: true },
  deadline: { type: Date, require: true },
  late: { type: Boolean, require: true },
  score: { type: Number, require: true },
  edit: { type: Boolean, require: true },
  created_at: { type: Date, default: Date.now() },
  update_at: { type: Date, default: Date.now() },
  files: { type: Array, require: true },
  deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Exercises", Exercise);
