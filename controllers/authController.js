const express = require("express");
const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const AppError = require("../utils/appError");


// ===== Nodemailer transporter =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// ===== Register =====
const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return next(new AppError("Please enter all fields", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    return res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError("User already exists", 400));
    }
    return next(new AppError(error.message || "Server error", 500));
  }
};


// ===== Login =====
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please enter all fields", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Invalid credentials", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 400));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      token,
      role: user.role,
      message: "Login successful"
    });

  } catch (error) {
    return next(new AppError(error.message || "Server error", 500));
  }
};


// ===== Forgot Password - Step 1: Send OTP =====
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("No account found with this email", 404));
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Remove any old OTP for this email
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({ email, otp, expiresAt });

    // Send email
    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`
    });

    return res.status(200).json({
      message: "OTP sent to your email address"
    });

  } catch (error) {
    return next(new AppError(error.message || "Failed to send OTP", 500));
  }
};


// ===== Verify OTP - Step 2 =====
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new AppError("Email and OTP are required", 400));
    }

    const record = await Otp.findOne({ email });

    if (!record) {
      return next(new AppError("OTP not found or already expired", 400));
    }

    if (record.otp !== otp) {
      return next(new AppError("Invalid OTP", 400));
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return next(new AppError("OTP has expired. Please request a new one", 400));
    }

    return res.status(200).json({
      message: "OTP verified successfully"
    });

  } catch (error) {
    return next(new AppError(error.message || "OTP verification failed", 500));
  }
};


// ===== Reset Password - Step 3 =====
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return next(new AppError("Email, OTP and new password are required", 400));
    }

    if (newPassword.length < 6) {
      return next(new AppError("Password must be at least 6 characters", 400));
    }

    const record = await Otp.findOne({ email });

    if (!record) {
      return next(new AppError("OTP not found or already expired", 400));
    }

    if (record.otp !== otp) {
      return next(new AppError("Invalid OTP", 400));
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return next(new AppError("OTP has expired. Please request a new one", 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Remove OTP after successful reset
    await Otp.deleteMany({ email });

    return res.status(200).json({
      message: "Password reset successfully"
    });

  } catch (error) {
    return next(new AppError(error.message || "Password reset failed", 500));
  }
};


module.exports = { register, login, forgotPassword, verifyOtp, resetPassword };