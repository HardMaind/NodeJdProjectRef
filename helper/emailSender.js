
const nodemailer = require("nodemailer");

const sendMail = (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: false,
    auth: {
      user: "mh.idea2code@gmail.com",
      pass:"Idea2code@mh",
    },
  });
  const mailOptions = {
    from: "mh.idea2code@gmail.com",
    to: data.to,
    subject: data.sub,
    html: data.html,
    cc: data.cc,
    attachments: data.attachments,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
    // else {
    //   console.log("Email sent: " + info.response);
    // }
  });
};

module.exports.sendMail = sendMail;
