const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function verifyReminder() {
    try {
        console.log("1. Registering/Logging in user...");
        let token;
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                name: "Test User",
                email: "test_reminder@example.com",
                password: "password123"
            });
            token = regRes.data.token;
            console.log("   User registered.");
        } catch (e) {
            if (e.response && e.response.status === 400) {
                console.log("   User already exists, logging in...");
                const loginRes = await axios.post(`${API_URL}/auth/login`, {
                    email: "test_reminder@example.com",
                    password: "password123"
                });
                token = loginRes.data.token;
                console.log("   User logged in.");
            } else {
                throw e;
            }
        }

        console.log("2. Calculating reminder time (1 minute from now)...");
        const now = new Date();
        const future = new Date(now.getTime() + 1 * 60000);
        const hours = String(future.getHours()).padStart(2, '0');
        const minutes = String(future.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        console.log(`   Reminder time set to: ${timeString}`);

        console.log("3. creating reminder...");
        const reminderData = {
            medicineName: "Test Medicine",
            dosage: "500mg",
            frequency: "Daily",
            time: timeString,
            instructions: "Take with water"
        };

        await axios.post(`${API_URL}/reminders`, reminderData, {
            headers: { 'x-auth-token': token }
        });
        console.log("   Reminder created successfully.");

        console.log("4. Verification instructions:");
        console.log(`   Wait until ${timeString} and check the backend console for an email notification.`);
        console.log("   If you see '[MOCK EMAIL] To: test_reminder@example.com...', the feature is working.");

    } catch (error) {
        console.error("❌ Verification Failed:", error.message);
        if (error.response) {
            console.error("   Server Response:", error.response.data);
        }
    }
}

verifyReminder();
