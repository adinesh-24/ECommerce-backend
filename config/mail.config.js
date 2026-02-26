const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // STARTTLS (must be false for port 587)
  
  auth: {
    user: process.env.BREVO_SENDER,     // SMTP Login (a36f2f001@smtp-brevo.com)
    pass: process.env.BREVO_API_KEY     // SMTP KEY (xsmtpsib-xxxx)
  },

  requireTLS: true,

  // Important for Render / cloud environments
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,

  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection when server starts
transporter.verify((error, success) => {
  if (error) {
    console.error(" SMTP connection failed:", error);
  } else {
    console.log(" SMTP server ready (Brevo)");
  }
});

module.exports = transporter;