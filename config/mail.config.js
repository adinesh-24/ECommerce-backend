const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = transporter;