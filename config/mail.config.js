const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const dns = require('dns');

// Force IPv4 as the default for all network calls to resolve ENETUNREACH on IPv6 addresses
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  family: 4 // Explicitly force IPv4
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