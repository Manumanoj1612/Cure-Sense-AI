const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/reminders
// @desc    Get all reminders for a user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.user._id });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/reminders
// @desc    Create a reminder
// @access  Private
router.post('/', protect, async (req, res) => {
    const { medicineName, dosage, frequency, time, instructions } = req.body;

    try {
        const reminder = new Reminder({
            user: req.user._id,
            medicineName,
            dosage,
            frequency,
            time,
            instructions
        });

        const createdReminder = await reminder.save();
        res.status(201).json(createdReminder);
    } catch (error) {
        res.status(400).json({ message: 'Invalid reminder data' });
    }
});

// @route   DELETE /api/reminders/:id
// @desc    Delete a reminder
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (reminder) {
            if (reminder.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await reminder.deleteOne();
            res.json({ message: 'Reminder removed' });
        } else {
            res.status(404).json({ message: 'Reminder not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
