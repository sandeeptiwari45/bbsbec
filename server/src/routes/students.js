const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const includePending = req.query.includePending === 'true';
    const filter = { role: 'student' };
    if (!includePending) filter.isApproved = true;
    const students = await User.find(filter).sort({ fullName: 1 });
    res.json(students);
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

module.exports = router;

