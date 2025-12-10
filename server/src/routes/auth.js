const express = require('express');
const User = require('../models/User');
const RegistrationCode = require('../models/RegistrationCode');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.role === 'student' && !user.isApproved) {
      return res.status(403).json({ message: 'Account waiting for approval' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { code, userData, allowedRoles = ['student'] } = req.body;
    if (!code || !userData || !userData.password) {
      return res.status(400).json({ message: 'Registration code, user data, and password are required' });
    }

    const registrationCode = await RegistrationCode.findOne({ code, isUsed: false });
    if (!registrationCode) {
      return res.status(400).json({ message: 'Invalid or expired registration code' });
    }

    if (allowedRoles.length && !allowedRoles.includes(registrationCode.role)) {
      return res.status(403).json({ message: 'Code role is not allowed for this registration form' });
    }

    const existing = await User.findOne({ email: userData.email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await User.create({
      ...userData,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: registrationCode.role,
      isApproved: registrationCode.role === 'student' ? false : true,
    });

    registrationCode.isUsed = true;
    registrationCode.usedBy = newUser._id;
    await registrationCode.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset url
    // In production, this should point to your frontend URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    // For local development with separate frontend (React running on 5173 usually)
    // We'll construct the frontend URL. Assuming frontend is on localhost:5173
    const frontendUrl = process.env.FRONTEND_URL
      ? `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
      : `http://localhost:5173/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${frontendUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/reset-password/:resetToken', async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, data: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

