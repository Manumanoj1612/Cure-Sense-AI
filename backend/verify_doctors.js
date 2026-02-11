const axios = require('axios');

async function testDoctorAPI() {
    try {
        console.log('--- Testing Fetch All Doctors ---');
        const allDoctors = await axios.get('http://localhost:5000/api/doctors');
        console.log(`Fetched ${allDoctors.data.length} doctors.`);

        console.log('\n--- Testing Filter by Cardiologist ---');
        const cardiologists = await axios.get('http://localhost:5000/api/doctors?specialty=Cardiologist');
        console.log(`Fetched ${cardiologists.data.length} cardiologists.`);
        if (cardiologists.data.length > 0 && cardiologists.data[0].specialization === 'Cardiologist') {
            console.log('✅ Filtering working correctly.');
        } else {
            console.error('❌ Filtering failed.');
        }

        console.log('\n--- Testing Contact Doctor (Mock Email) ---');
        // Assuming mock email service is active if creds are missing, or real if present.
        const contactResponse = await axios.post('http://localhost:5000/api/contact-doctor', {
            doctorName: "Dr. Test",
            doctorEmail: "test.doctor@example.com",
            patientName: "Test Patient",
            patientContact: "1234567890",
            summary: "Test consultation request."
        });

        if (contactResponse.data.success) {
            console.log('✅ Contact API success:', contactResponse.data.message);
        } else {
            console.error('❌ Contact API failed:', contactResponse.data);
        }

    } catch (error) {
        console.error('❌ Verification Error:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

testDoctorAPI();
