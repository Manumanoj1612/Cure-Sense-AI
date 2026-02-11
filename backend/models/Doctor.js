const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    location: {
        type: String, // e.g., "New York, NY"
        required: true
    },
    hospital: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    image: {
        type: String, // URL to image
        default: 'https://via.placeholder.com/150'
    },
    distance: {
        type: String, // e.g., "2.5 km" (This would normally be calculated, but storing for simplicity as per requirement)
        default: 'N/A'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
