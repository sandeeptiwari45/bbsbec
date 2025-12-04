const express = require('express');
const RegistrationCode = require('../models/RegistrationCode');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const codes = await RegistrationCode.find().sort({ createdAt: -1 }).populate('usedBy', 'fullName email collegeRollNo department course year semester mobile fatherName');
    res.json(codes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { role, description, createdFor } = req.body;
    if (!role) return res.status(400).json({ message: 'Role is required' });
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const millis = now.getMilliseconds().toString().padStart(3, '0').slice(0, 2);

    const code = await RegistrationCode.create({
      code: `BBSBEC${year}${month}${day}${hour}${minute}${second}${millis}`,
      role,
      isUsed: false,
      createdFor: createdFor || description || `Generated on ${now.toLocaleDateString()}`,
    });
    res.status(201).json(code);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const code = await RegistrationCode.findById(req.params.id);
    if (!code) return res.status(404).json({ message: 'Code not found' });

    if (code.usedBy) {
      await User.findByIdAndDelete(code.usedBy);
    }

    await RegistrationCode.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

