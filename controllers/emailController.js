const { text } = require('express');
const transporter = require('../config/mail.config');
const dotenv = require('dotenv');
const AppError = require('../utils/appError');
dotenv.config();


exports.sendEmail = async (req, res,next) => {
  try {
    const { to, subject, message } = req.body;
    if (!to || !subject || !message) {
        return new AppError("Please enter all fields", 400);
    }
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message 
    });

    console.log('transporter', transporter,transporter.options.port);
    return res.status(200).json({ success: true, message: `Email sent successfully to ${message}  ` });
  } catch (error) {
    console.error('Error sending email:', error);
    return new AppError('Failed to send email', 500);
  }
};

