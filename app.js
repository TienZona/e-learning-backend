const express = require("express");
const cors = require("cors");
const CourseRoute = require("./app/routes/course.route")
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/class", CourseRoute)

app.use(("/"), (req, res) => {
  res.json({message: 'welcome elearning backend'})
})



app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal server Error",
  });
});

module.exports = app;
