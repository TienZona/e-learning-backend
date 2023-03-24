const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostReply = new Schema({
  id_post: {type: String, require: true},
  author: { type: Object, require: true },
  content: { type: String, maxlength: 160, require: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("post_reply", PostReply);
