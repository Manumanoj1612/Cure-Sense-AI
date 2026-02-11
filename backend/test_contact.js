const axios = require('axios');

async function testContactDoctor() {
    try {
        console.log("Testing /api/contact-doctor endpoint...");
        const response = await axios.post('http://localhost:5000/api/contact-doctor', {
            doctorName: "Dr. Test",
            doctorEmail: "test@example.com", // This will be mocked if no credentials in .env
            patientName: "Test Patient",
            patientContact: "patient@example.com",
            summary: "Patient has reported a headache for 3 days.\nSeverity: Mild\nHistory: None"
        });

        if (response.data.success) {
            console.log("✅ API Test Passed: Email sent successfully.");
            console.log("Response:", response.data);
        } else {
            console.log("❌ API Test Failed:", response.data);
        }
    } catch (error) {
        console.error("❌ API Test Error:", error.message);
        if (error.response) {
            console.error("Server Response:", error.response.data);
        }
    }
}

testContactDoctor();
