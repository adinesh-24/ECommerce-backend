const express= require("express");
const router = express.Router();
// const transporter = require("../config/mail.config");
const { sendEmail } = require("../controllers/emailController");

router.post("/send-email", sendEmail);
module.exports = router;