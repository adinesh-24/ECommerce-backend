const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Helps in some restricted environments
  }
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP server connection failed:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

module.exports = transporter;