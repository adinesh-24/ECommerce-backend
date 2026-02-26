const User = require("../models/User");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mail.config");
const AppError = require("../utils/AppError");


const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      throw new AppError("Please enter all fields", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    // Create user but unverified
    await User.create({
      username,
      email,
      password,
      role: role || "user",
      isVerified: true
    });

    // Generate 6-digit OTP for initial verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, expiresAt });

    // Send email
    console.log(`Attempting to send Registration OTP to ${email}...`);
    try {
      await transporter.sendMail({
        from: `"Support" <${process.env.BREVO_SENDER}>`,
        to: email,
        subject: "Verify Your Account",
        text: `Your OTP for account verification is: ${otp}\n\nThis OTP is valid for 10 minutes.`
      });
      console.log(`Registration OTP sent successfully to ${email}`);
    } catch (mailError) {
      console.error("Failed to send registration email:", mailError);
      // We still created the user, they can retry verification later or use forgot password if needed
    }

    return res.status(201).json({
      message: "User registered successfully.",
      email
    });

  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("User already exists", 400);
    }
    throw new AppError(error.message || "Server error", 500);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Please enter all fields", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid credentials", 400);
    }

    // Use model instance method for password comparison
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 400);
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
    throw new AppError(error.message || "Server error", 500);
  }
};


// ===== Forgot Password - Step 1: Send OTP =====
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("No account found with this email", 404);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Remove any old OTP for this email
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({ email, otp, expiresAt });

    // Send email
    console.log(`Attempting to send OTP to ${email}...`);
    await transporter.sendMail({
      from: `"Support" <${process.env.BREVO_SENDER}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`
    });
    console.log(`OTP sent successfully to ${email}`);

    return res.status(200).json({
      message: "OTP sent to your email address"
    });

  } catch (error) {
    throw new AppError(error.message || "Failed to send OTP", 500);
  }
};


// ===== Verify OTP - Step 2 =====
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new AppError("Email and OTP are required", 400);
    }

    const record = await Otp.findOne({ email });

    if (!record) {
      throw new AppError("OTP not found or already expired", 400);
    }

    if (record.otp !== otp) {
      throw new AppError("Invalid OTP", 400);
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      throw new AppError("OTP has expired. Please request a new one", 400);
    }

    return res.status(200).json({
      message: "OTP verified successfully"
    });

  } catch (error) {
    throw new AppError(error.message || "OTP verification failed", 500);
  }
};


const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      throw new AppError("Email, OTP and new password are required", 400);
    }

    if (newPassword.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    const record = await Otp.findOne({ email });

    if (!record) {
      throw new AppError("OTP not found or already expired", 400);
    }

    if (record.otp !== otp) {
      throw new AppError("Invalid OTP", 400);
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      throw new AppError("OTP has expired. Please request a new one", 400);
    }

    // Find user and update password - will trigger pre-save hook
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.password = newPassword;
    user.isVerified = true; // Also mark as verified if they reset password
    await user.save();

    // Remove OTP after successful reset
    await Otp.deleteMany({ email });

    return res.status(200).json({
      message: "Password reset successfully"
    });

  } catch (error) {
    throw new AppError(error.message || "Password reset failed", 500);
  }
};


// ===== Verify Registration OTP [NEW] =====
const verifyRegistration = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new AppError("Email and OTP are required", 400);
    }

    const record = await Otp.findOne({ email });

    if (!record) {
      throw new AppError("OTP not found or already expired", 400);
    }

    if (record.otp !== otp) {
      throw new AppError("Invalid OTP", 400);
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      throw new AppError("OTP has expired. Please request a new one", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.isVerified = true;
    await user.save();

    // Remove OTP after successful verification
    await Otp.deleteMany({ email });

    return res.status(200).json({
      message: "Account verified successfully"
    });

  } catch (error) {
    throw new AppError(error.message || "OTP verification failed", 500);
  }
};


module.exports = { register, login, forgotPassword, verifyOtp, resetPassword, verifyRegistration };