const Doctor = require('../models/Doctor');
const axios = require('axios');
const AI_SERVICE_URL = 'http://127.0.0.1:8000';

// Get all doctors or search
exports.getDoctors = async (req, res) => {
    try {
        const { location, specialty } = req.query;
        let query = {};

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (specialty) {
            query.specialty = { $regex: specialty, $options: 'i' };
        }

        // If symptoms provided but no specialty, ask AI for recommendation
        if (!specialty && req.query.symptoms) {
            try {
                const aiResponse = await axios.post(`${AI_SERVICE_URL}/recommend_doctors`, {
                    location: location || '',
                    symptoms: req.query.symptoms
                });
                if (aiResponse.data.recommended_specialty) {
                    query.specialty = { $regex: aiResponse.data.recommended_specialty, $options: 'i' };
                }
            } catch (err) {
                console.error("AI Recommendation failed, falling back to all doctors");
            }
        }

        let doctors = await Doctor.find(query);

        // Auto-seed if empty
        if (doctors.length === 0 && !location && !specialty) {
            const seedData = [
                { name: 'Dr. Sarah Wilson', specialty: 'General Physician', hospital: 'City General Hospital', location: 'New York', rating: 4.8, distance: '2.5 km' },
                { name: 'Dr. James Chen', specialty: 'Cardiologist', hospital: 'Heart Care Center', location: 'New York', rating: 4.9, distance: '5.1 km' },
                { name: 'Dr. Emily Brown', specialty: 'Pulmonologist', hospital: 'Lung & Chest Clinic', location: 'New York', rating: 4.7, distance: '3.8 km' },
                { name: 'Dr. Michael Ross', specialty: 'Dermatologist', hospital: 'Skin Care Institute', location: 'California', rating: 4.6, distance: '1.2 km' },
                { name: 'Dr. Lisa Wang', specialty: 'Pediatrician', hospital: 'Children\'s Hospital', location: 'Chicago', rating: 4.9, distance: '3.0 km' }
            ];
            await Doctor.insertMany(seedData);
            doctors = await Doctor.find({});
        }

        res.json(doctors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Seed doctors (internal use)
exports.seedDoctors = async (req, res) => {
    try {
        const doctors = [
            { name: 'Dr. Sarah Wilson', specialty: 'General Physician', hospital: 'City General Hospital', location: 'New York', rating: 4.8, distance: '2.5 km' },
            { name: 'Dr. James Chen', specialty: 'Cardiologist', hospital: 'Heart Care Center', location: 'New York', rating: 4.9, distance: '5.1 km' },
            { name: 'Dr. Emily Brown', specialty: 'Pulmonologist', hospital: 'Lung & Chest Clinic', location: 'New York', rating: 4.7, distance: '3.8 km' },
            { name: 'Dr. Michael Ross', specialty: 'Dermatologist', hospital: 'Skin Care Institute', location: 'California', rating: 4.6, distance: '1.2 km' },
        ];

        await Doctor.deleteMany({}); // Clear existing
        await Doctor.insertMany(doctors);

        res.json({ msg: 'Doctors seeded' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
