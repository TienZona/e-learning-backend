const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const CourseRoute = require("./app/routes/course.route");
const ClassroomRoute = require("./app/routes/classroom.route");
const MeetRouter = require("./app/routes/meet.route")
var nodemailer =  require('nodemailer'); 

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/class", CourseRoute);
app.use("/api/classroom", ClassroomRoute);
app.use("/meet", MeetRouter)

app.use(express.static('public/uploads')); 
app.use('/files', express.static('public/uploads'));

app.use('/sendmail', function(req, res, next) {
  var transporter =  nodemailer.createTransport({ // config mail server
      service: 'Gmail',
      auth: {
          user: 'learnmorewebsite@gmail.com',
          pass: 'jloifgzlenotyjwz'
      }
  });
  var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
      from: 'Tiến Zona',
      to: 'tienzona001@gmail.com',
      subject: 'Test Nodemailer',
      text: 'You recieved message from ' + req.body.email,
      html: '<p>You have got a new message</b><ul><li>Username:' + req.body.name + '</li><li>Email:' + req.body.email + '</li><li>Username:' + req.body.message + '</li></ul>'
  }

  transporter.sendMail(mainOptions, function(err, info){
      if (err) {
          console.log(err);
          res.redirect('/');
      } else {
          console.log('Message sent: ' +  info.response);
          res.redirect('/');
      }
  });
  console.log('send mail')
});


// upload file
const multer = require("multer");
const Meet = require("./app/Models/Meet");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

app.post("/upload", upload.array("file", 12), (req, res, next) => {
  const files = req.files;
  console.log(files)
  if (!files) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(req.files);
});

app.get('/download', function(req, res){
  const file = `./public/uploads/${req.query.fileName}`;
  res.download(file, req.query.fileName); // Set disposition and send it.
});

app.use("/", (req, res) => {
  res.json({ message: "welcome elearning backend" });
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal server Error",
  });
});


module.exports = app;
