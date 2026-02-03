const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medicineName: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequency: {
        type: String, // e.g., "Twice a day"
        required: true
    },
    time: {
        type: String, // Store as string for flexibility? Or array of strings. Let's keep it simple string or array.
        // The frontend might send "8:00 AM" or similar.
    },
    instructions: {
        type: String // e.g., "After food"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reminder', reminderSchema);
