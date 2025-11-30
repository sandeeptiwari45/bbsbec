const express = require('express');
const User = require('../models/User');
const RegistrationCode = require('../models/RegistrationCode');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });
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
    if (!code || !userData) {
      return res.status(400).json({ message: 'Registration code and user data are required' });
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

    const newUser = await User.create({
      ...userData,
      email: userData.email.toLowerCase(),
      role: registrationCode.role,
      isApproved: registrationCode.role === 'student' ? false : true,
    });

    registrationCode.isUsed = true;
    await registrationCode.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

