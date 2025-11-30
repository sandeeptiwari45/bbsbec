const express = require('express');

const authRoutes = require('./auth');
const noticeRoutes = require('./notices');
const studentRoutes = require('./students');
const codeRoutes = require('./codes');
const eventRoutes = require('./events');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/notices', noticeRoutes);
router.use('/students', studentRoutes);
router.use('/codes', codeRoutes);
router.use('/events', eventRoutes);

module.exports = router;

