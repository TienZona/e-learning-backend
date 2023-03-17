const mongoose = require("mongoose");
const { Schema } = mongoose;

const Course = new Schema({
    id: {type: String, maxLength: 12, require: true},
    name: {type: String, maxLength: 50, require: true},
    category: {type: String, require: true},
    content: { type: String, maxLength: 100, require: true},
    author: { type: Object, require: true},
    is_password: {type: Boolean},
    password: {type: String},
    theme: {type: Array, require: true},
    member: {type: Array},
    created_at: {type: Date, default: Date.now()},
    update_at: {type: Date, default: Date.now()},
    deleted: {type: Boolean, default: false}

})



module.exports = mongoose.model("Courses", Course);
