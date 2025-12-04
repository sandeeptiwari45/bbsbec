const express = require('express');
const router = express.Router();
const ProfileUpdateRequest = require('../models/ProfileUpdateRequest');
const User = require('../models/User');

// Create a new profile update request
router.post('/request', async (req, res) => {
    try {
        const { userId, changes } = req.body;

        // Check if there's already a pending request for this user
        const existingRequest = await ProfileUpdateRequest.findOne({ user: userId, status: 'pending' });
        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending profile update request.' });
        }

        const newRequest = await ProfileUpdateRequest.create({
            user: userId,
            requestedChanges: changes,
        });

        res.status(201).json(newRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all pending requests (for admin)
router.get('/pending', async (req, res) => {
    try {
        const requests = await ProfileUpdateRequest.find({ status: 'pending' }).populate('user');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
