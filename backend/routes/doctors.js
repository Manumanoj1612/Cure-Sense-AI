const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// @route   GET /api/doctors
// @desc    Get all doctors with filtering
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { specialty, location, symptoms } = req.query;
        let query = {};

        if (specialty && specialty !== 'All') {
            query.specialization = specialty;
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // basic AI/keyword matching for symptoms if specialty is not provided
        if (!specialty && symptoms) {
            const symptomLower = symptoms.toLowerCase();
            if (symptomLower.includes('heart') || symptomLower.includes('chest')) {
                query.specialization = 'Cardiologist';
            } else if (symptomLower.includes('skin') || symptomLower.includes('rash')) {
                query.specialization = 'Dermatologist';
            } else if (symptomLower.includes('child') || symptomLower.includes('baby')) {
                query.specialization = 'Pediatrician';
            } else if (symptomLower.includes('headache') || symptomLower.includes('brain')) {
                query.specialization = 'Neurologist';
            } else if (symptomLower.includes('mood') || symptomLower.includes('depression')) {
                query.specialization = 'Psychiatrist';
            } else if (symptomLower.includes('bone') || symptomLower.includes('joint')) {
                query.specialization = 'Orthopedic Surgeon';
            }
        }

        const doctors = await Doctor.find(query);
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
