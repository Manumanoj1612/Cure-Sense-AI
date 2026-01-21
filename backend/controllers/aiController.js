const axios = require('axios');

const AI_SERVICE_URL = 'http://127.0.0.1:8000';

exports.predictDisease = async (req, res) => {
    try {
        const { symptoms } = req.body;
        const response = await axios.post(`${AI_SERVICE_URL}/predict_disease`, { symptoms });
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('AI Service Error');
    }
};

const FormData = require('form-data');

exports.extractPrescription = async (req, res) => {
    try {
        console.log('Received file upload request');
        if (!req.file) {
            console.error('No file in req.file');
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        console.log('File details:', req.file.originalname, req.file.mimetype, req.file.size);

        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname);

        console.log('Forwarding to AI service...');
        const response = await axios.post(`${AI_SERVICE_URL}/extract_prescription`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });
        console.log('AI Service response:', response.status);
        res.json(response.data);
    } catch (err) {
        console.error('Error in extractPrescription:', err.message);
        if (err.response) {
            console.error('AI Service Error Data:', err.response.data);
            console.error('AI Service Error Status:', err.response.status);
        }
        res.status(500).send('AI Service Error');
    }
};

exports.recommendDoctors = async (req, res) => {
    try {
        const { location, symptoms } = req.body;
        const response = await axios.post(`${AI_SERVICE_URL}/recommend_doctors`, { location, symptoms });
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('AI Service Error');
    }
};

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        const response = await axios.post(`${AI_SERVICE_URL}/chat`, { message });
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('AI Service Error');
    }
};

exports.parseReminder = async (req, res) => {
    try {
        const { instruction } = req.body;
        const response = await axios.post(`${AI_SERVICE_URL}/parse_medicine_reminder`, { instruction });
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('AI Service Error');
    }
};
