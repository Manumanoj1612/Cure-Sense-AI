import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

// Prescription endpoint update
export const extractPrescription = async (formData) => {
    // Assuming formData contains 'file'
    const response = await api.post('/ai/prescription', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// Update to match new backend contract
export const predictDisease = async (symptoms, age = 25, duration = "1 day", severity = "moderate") => {
    // Backend expects: { symptoms: [], age, duration, severity }
    // Frontend passes string "symptoms", convert to array if needed or handle
    const symptomsList = typeof symptoms === 'string' ? symptoms.split(',') : symptoms;
    const response = await api.post('/ai/symptom-check', {
        symptoms: symptomsList,
        age,
        duration,
        severity
    });
    return response.data;
};

export const recommendDoctors = async (location, symptoms) => {
    const response = await api.post('/ai/recommend_doctors', { location, symptoms });
    return response.data;
};

export const chatWithBot = async (message) => {
    const response = await api.post('/ai/chat', { message });
    return response.data;
};

// Persistence APIs
export const getReminders = async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/reminders', { headers: { 'x-auth-token': token } });
    return response.data;
};

export const addReminder = async (reminder) => {
    const token = localStorage.getItem('token');
    const response = await api.post('/reminders', reminder, { headers: { 'x-auth-token': token } });
    return response.data;
};

export const parseReminder = async (instruction) => {
    const response = await api.post('/ai/parse_reminder', { instruction });
    return response.data;
};

export const deleteReminder = async (id) => {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/reminders/${id}`, { headers: { 'x-auth-token': token } });
    return response.data;
};

export const getDoctors = async (location, specialty, symptoms) => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (specialty) params.append('specialty', specialty);
    if (symptoms) params.append('symptoms', symptoms);

    const response = await api.get(`/doctors?${params.toString()}`);
    return response.data;
};

export default api;
