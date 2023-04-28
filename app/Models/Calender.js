const mongoose = require("mongoose");
const { Schema } = mongoose;

const Calender = new Schema({
    id_class: {type: String, maxLength: 12, require: true},
    title: {type: String, maxLength: 100, require: true},
    start_date: {type: Date, require: true},
    end_date: {type: Date, require: true},
})



module.exports = mongoose.model("Calenders", Calender);
