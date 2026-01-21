const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    specialty: {
        type: String,
        required: true,
    },
    hospital: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    distance: {
        type: String, // In a real app, this would be calculated
        default: '0 km',
    },
});

module.exports = mongoose.model('Doctor', doctorSchema);
