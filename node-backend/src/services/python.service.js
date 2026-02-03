const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const PYTHON_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

exports.checkSymptoms = async (data) => {
    try {
        const response = await axios.post(`${PYTHON_URL}/api/ai/symptom-check`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('AI Service Unavailable');
    }
};

exports.processPrescription = async (filePath) => {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        const response = await axios.post(`${PYTHON_URL}/api/ai/prescription`, form, {
            headers: {
                ...form.getHeaders()
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('AI Service Unavailable');
    }
};
