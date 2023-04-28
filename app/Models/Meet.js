const mongoose = require("mongoose");
const { Schema } = mongoose;

const Meets = new Schema({
  author: { type: Object, require: true },
  messages: { type: Array, require: true },
  members: { type: Array, requrie: true },
  id_room: { type: String, require: true },
  id_class: {type: String},
  start: { type: Date, default: Date.now() },
  end: { type: Date },
});

module.exports = mongoose.model("Meets", Meets);
