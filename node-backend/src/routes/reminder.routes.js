const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const jwt = require('jsonwebtoken');

// Simple Middleware for now to keep it in one file or import
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.headers['x-auth-token']) {
        token = req.headers['x-auth-token'];
    }

    if (!token) return res.status(401).json({ message: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // just id
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token failed' });
    }
};

// POST /api/reminder/create
router.post('/create', protect, async (req, res) => {
    try {
        const { medicineName, time, frequency, days } = req.body;
        const reminder = await Reminder.create({
            userId: req.user.id,
            medicineName,
            time,
            frequency
            // days handling omitted for MVP schema consistency
        });
        res.status(201).json(reminder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating reminder' });
    }
});

// GET /api/reminder/
router.get('/', protect, async (req, res) => {
    try {
        const reminders = await Reminder.find({ userId: req.user.id });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reminders' });
    }
});

module.exports = router;
