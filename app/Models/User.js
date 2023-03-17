const mongoose = require('mongoose')
const { Schema } = mongoose;

const User  = new Schema({
    id: {type: String},
    name: {type: String},
    email: {type: String}
})

module.exports = mongoose.model('Users', User);