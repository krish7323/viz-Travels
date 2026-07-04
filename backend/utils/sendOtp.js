const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user:"chauhandivyanshu2026@gmail.com",
    pass:"lwkttuyhtmkudyhv",
  },
});

const sendEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
  });
};

module.exports = sendEmail;