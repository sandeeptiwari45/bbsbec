const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { role, course, department, year, semester } = req.query;
    let query = {};

    if (role === 'student') {
      if (course) query.course = { $in: [course, 'All'] };
      if (department) query.department = { $in: [department, 'All'] };
      if (year) query.year = { $in: [year, 'All'] };
      if (semester) query.semester = { $in: [semester, 'All'] };
    }

    const events = await Event.find(query).sort({ eventDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const event = await Event.create({
      title: payload.title,
      description: payload.description,
      eventDate: payload.eventDate,
      createdBy: payload.createdBy,
      createdByName: payload.createdByName,
      course: payload.course || 'All',
      department: payload.department || 'All',
      year: payload.year || 'All',
      semester: payload.semester || 'All',
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

