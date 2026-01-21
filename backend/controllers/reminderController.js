const Reminder = require('../models/Reminder');

// Get all reminders for a user
exports.getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(reminders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add a reminder
exports.addReminder = async (req, res) => {
    try {
        const { name, dosage, time, days } = req.body;

        const newReminder = new Reminder({
            name,
            dosage,
            time,
            days,
            user: req.user.id,
        });

        const reminder = await newReminder.save();
        res.json(reminder);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return res.status(404).json({ msg: 'Reminder not found' });
        }

        // Check user
        if (reminder.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await reminder.deleteOne();
        res.json({ msg: 'Reminder removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
