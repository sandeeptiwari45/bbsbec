const express = require('express');
const RegistrationCode = require('../models/RegistrationCode');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const codes = await RegistrationCode.find().sort({ createdAt: -1 });
    res.json(codes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { role, description } = req.body;
    if (!role) return res.status(400).json({ message: 'Role is required' });
    const code = await RegistrationCode.create({
      code: `BBSBEC-${role.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      role,
      isUsed: false,
      createdFor: description || `Generated on ${new Date().toLocaleDateString()}`,
    });
    res.status(201).json(code);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

