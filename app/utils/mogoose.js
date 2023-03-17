module.exports = {
    mutipleMongooseToOject: function (mongoose) {
        return mongoose.map((mongoose) => mongoose.toObject());
    },
    mongoseToObject: function (monggose) {
        return monggose ? monggose.toObject() : monggose;
    }
}