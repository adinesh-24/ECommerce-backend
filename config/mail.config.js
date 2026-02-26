const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // ⭐ explicit host
  port: 587,              // ⭐ use 587 (more cloud-friendly)
  secure: false,          // true only for 465
  family: 4,              // force IPv4
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP server connection failed:", error);
  } else {
    console.log("SMTP server ready");
  }
});

module.exports = transporter;