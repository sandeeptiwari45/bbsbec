const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const includePending = req.query.includePending === 'true';
    const role = req.query.role || 'student';
    const filter = { role };
    if (!includePending && role === 'student') filter.isApproved = true;
    const students = await User.find(filter).sort({ fullName: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    const existing = await User.findOne({ email: userData.email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(userData.password || 'password123', 10);

    const newUser = await User.create({
      ...userData,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      isApproved: true,
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const allowedFields = [
      'fullName',
      'email',
      'course',
      'department',
      'year',
      'section',
      'collegeRollNo',
      'universityRollNo',
      'fatherName',
      'gender',
      'profileImage',
      'mobile',
      'address',
      'caste',
      'designation',
      'subjects',
    ];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const student = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/pending/list', async (_req, res) => {
  try {
    const pending = await User.find({ role: 'student', isApproved: false }).sort({ createdAt: 1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/approve', async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/favourites', async (req, res) => {
  try {
    const { noticeId } = req.body;
    if (!noticeId) return res.status(400).json({ message: 'noticeId is required' });

    const student = await User.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'User not found' });

    const favs = student.favourites || [];
    if (favs.some((id) => id.toString() === noticeId)) {
      student.favourites = favs.filter((id) => id.toString() !== noticeId);
    } else {
      student.favourites = [...favs, noticeId];
    }

    await student.save();
    res.json(student.favourites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const RegistrationCode = require('../models/RegistrationCode');

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Also delete the registration code associated with this user
    await RegistrationCode.findOneAndDelete({ usedBy: req.params.id });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/reset-password', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

