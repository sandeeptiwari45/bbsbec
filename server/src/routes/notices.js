const express = require('express');
const Notice = require('../models/Notice');

const router = express.Router();

const buildNoticeFilter = (user) => {
  if (user.role === 'admin') return {};
  if (user.role === 'faculty') return { publishedBy: user.id };

  const targetFilters = [];
  const addFilter = (field, value) => {
    if (value) targetFilters.push({
      [`target.${field}`]: { $in: [value] },
    });
  };

  addFilter('courses', user.course);
  addFilter('departments', user.department);
  addFilter('years', user.year);
  addFilter('semesters', user.semester);
  addFilter('sections', user.section);

  return {
    $or: [
      {
        'target.courses': { $size: 0 },
        'target.departments': { $size: 0 },
        'target.years': { $size: 0 },
        'target.semesters': { $size: 0 },
        'target.sections': { $size: 0 },
      },
      ...(targetFilters.length ? [{ $and: targetFilters }] : []),
    ],
  };
};

router.get('/', async (req, res) => {
  try {
    const user = {
      id: req.query.userId,
      role: req.query.role,
      course: req.query.course,
      department: req.query.department,
      year: req.query.year,
      semester: req.query.semester,
      section: req.query.section,
    };

    if (!user.role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    const filter = buildNoticeFilter(user);
    if (filter.publishedBy && !filter.publishedBy) delete filter.publishedBy;

    const notices = await Notice.find(filter).sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const newNotice = await Notice.create({
      title: payload.title,
      description: payload.description,
      category: payload.category,
      publishedBy: payload.publishedBy,
      publishedByName: payload.publishedByName,
      isPinned: payload.isPinned || false,
      eventDate: payload.eventDate,
      target: payload.target || { courses: [], departments: [], years: [], semesters: [], sections: [] },
    });

    // Create notifications for target users
    const Notification = require('../models/Notification');
    const User = require('../models/User');

    // Build query to find target users
    const targetQuery = { role: 'student' }; // Default to students for notices

    const usersToNotify = await User.find(targetQuery).select('_id');

    const notifications = usersToNotify.map(user => ({
      userId: user._id,
      message: `New Notice: ${newNotice.title}`,
      type: 'info',
      relatedId: newNotice._id,
      createdAt: new Date()
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json(newNotice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const notice = await Notice.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    const alreadyRead = notice.readBy.some(r => r.userId.toString() === userId);
    if (!alreadyRead) {
      notice.readBy.push({ userId, readAt: new Date() });
      await notice.save();
    }

    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

