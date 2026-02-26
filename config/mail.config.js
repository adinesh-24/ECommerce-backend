const nodemailer = require("nodemailer");
const dns = require("dns");

// Force IPv4 as the default for all network calls to resolve ENETUNREACH on IPv6 addresses
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,       // Use 2525 as an alternative to 587 to bypass cloud firewalls
  secure: false,    // STARTTLS

  auth: {
    user: process.env.BREVO_SENDER,     // SMTP Login (a36f2f001@smtp-brevo.com)
    pass: process.env.BREVO_API_KEY     // SMTP KEY (xsmtpsib-xxxx)
  },

  tls: {
    rejectUnauthorized: false
  },
  family: 4,
  connectionTimeout: 15000, // 15 seconds
  greetingTimeout: 15000,
  socketTimeout: 30000
});

// Verify connection when server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP server connection failed:", error.message);
  } else {
    console.log("SMTP server ready (Brevo)");
  }
});

module.exports = transporter;