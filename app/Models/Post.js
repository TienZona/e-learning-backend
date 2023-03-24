const mongoose = require("mongoose");
const { Schema } = mongoose;

const Posts = new Schema({
  id_class: { type: String, maxlength: 12, require: true },
  author: { type: Object, require: true },
  title: { type: String, maxlength: 50, require: true },
  content: { type: String, maxlength: 999, require: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Posts", Posts);
