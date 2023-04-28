var nodemailer = require("nodemailer");

class SendMailer {
  index(req, res, next) {}

  async send(emails, title, html) {
    var transporter = nodemailer.createTransport({
      // config mail server
      service: "Gmail",
      auth: {
        user: "learnmorewebsite@gmail.com",
        pass: "jloifgzlenotyjwz",
      },
    });
    var mainOptions = {
      // thiết lập đối tượng, nội dung gửi mail
      from: "students",
      to: emails,
      subject: title,
      text: "You recieved message " ,
      html: html,
    };

    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        console.log("Message sent: " + info.response);
        res.redirect("/");
      }
    });
  }
}

module.exports = new SendMailer();
