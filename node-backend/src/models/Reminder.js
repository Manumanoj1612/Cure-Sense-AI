const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicineName: { type: String, required: true },
    time: { type: String, required: true }, // "09:00"
    frequency: { type: String, required: true }, // "daily"
    startDate: { type: Date, default: Date.now },
    status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
