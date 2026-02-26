const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // TLS is used with STARTTLS on port 587
  auth: {
    user: process.env.BREVO_SENDER,
    pass: process.env.BREVO_API_KEY
  },
  tls: {
    rejectUnauthorized: false
  },
  family: 4 // Force IPv4 for Render reliability
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP server connection failed:", error.message);
  } else {
    console.log("SMTP server ready (Brevo)");
  }
});

module.exports = transporter;