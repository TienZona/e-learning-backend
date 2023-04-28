const Calender = require("./app/controllers/CalenderController");
const Meet = require("./app/controllers/MeetController");
const Course = require("./app/controllers/CoursesControlle");
const SendMailer = require("./app/controllers/SendMailer");

const timerApp = async () => {
  clockTimer();
};

const clockTimer = () => {
  var myInt = setInterval(async () => {
    var list = await Calender.getStartTime();
    list.forEach((item) => {
      const dateStart = new Date(item.start_date);
      const startTime = parseInt(dateStart.getTime() / 60000);
      const dateNow = parseInt(Date.now() / 60000);
      if (dateNow === startTime) {
        console.log("Đến giờ học lớp ID: " + item.id_class);
        handle(item.id_class);
      }
    });
  }, 60000);
};

const handle = async (id_class) => {
  const course = await Course.getClass(id_class);

  // create meeting
  const meeting = await Meet.autoCreate(id_class, course.author);

  //   send mail from students
  const mails = course.member.map((student) => student.email);
  mails.push(course.author.email);
  const title = "Đến giờ học  " + course.name;
  const link = `http://localhost:8888/meeting/${meeting.id_room}`;
  const html =
    "<h2>Lớp học đang diễn ra</h2>" +
    `<p>Link lớp học: <a href="${link}">${link}</a></p>`;
  SendMailer.send(mails, title, html);
};

module.exports = timerApp;
