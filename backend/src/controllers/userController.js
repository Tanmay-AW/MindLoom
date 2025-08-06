import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Function to generate a JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.isVerified) {
    res.status(400);
    throw new Error('User with this email already exists.');
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  if (existingUser) {
    existingUser.otp = otp;
    existingUser.otpExpires = otpExpires;
    await existingUser.save();
  } else {
    await User.create({ email, otp, otpExpires, isVerified: false });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // --- NEW HTML EMAIL TEMPLATE ---
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; padding: 20px; background-color: #4A90E2; color: white; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">MindLoom</h1>
        <p style="margin: 5px 0 0; font-size: 16px;">Email Verification</p>
      </div>
      <div style="padding: 30px 20px;">
        <h2 style="font-size: 22px; color: #333;">Verify Your Email Address</h2>
        <p style="font-size: 16px; color: #555;">
          Thank you for signing up for MindLoom! To complete your registration, please enter the following verification code:
        </p>
        <div style="text-align: center; margin: 30px 0; padding: 20px; border: 2px dashed #4A90E2; border-radius: 5px;">
          <p style="font-size: 36px; font-weight: bold; color: #333; letter-spacing: 10px; margin: 0;">
            ${otp}
          </p>
        </div>
        <p style="font-size: 14px; color: #777;">
          <strong>Important:</strong> This code will expire in 10 minutes for security reasons.
        </p>
        <p style="font-size: 14px; color: #777;">
          If you didn't create a MindLoom account, you can safely ignore this email.
        </p>
      </div>
      <div style="text-align: center; padding: 20px; font-size: 12px; color: #aaa; border-top: 1px solid #ddd;">
        &copy; ${new Date().getFullYear()} MindLoom. All rights reserved.
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"MindLoom" <${process.env.EMAIL_USER}>`, // Sender name
    to: email,
    subject: 'Your MindLoom Verification Code',
    // text: `Your verification code is: ${otp}. It will expire in 10 minutes.`, // Fallback text
    html: emailHtml, // Use the new HTML template
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification code sent successfully.' });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500);
    throw new Error('Failed to send verification code.');
  }
});

// --- registerUser, loginUser, and googleAuthCallback functions remain unchanged ---
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('Please send a verification code to this email first.');
  }
  if (user.isVerified && user.password) {
    res.status(400);
    throw new Error('User is already registered. Please log in.');
  }
  if (user.otp !== otp || user.otpExpires < new Date()) {
    res.status(400);
    throw new Error('Invalid or expired verification code.');
  }
  user.name = name;
  user.password = password;
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  const updatedUser = await user.save();
  if (updatedUser) {
    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && user.isVerified && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const googleAuthCallback = asyncHandler(async (req, res) => {
  if (req.user) {
    const token = generateToken(req.user._id);
    const user = req.user;
    res.redirect(`${process.env.FRONTEND_URL}/?token=${token}&id=${user._id}&name=${user.name}&email=${user.email}`);
  } else {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
  }
});

export { 
  registerUser, 
  loginUser, 
  sendOtp,
  googleAuthCallback
};
