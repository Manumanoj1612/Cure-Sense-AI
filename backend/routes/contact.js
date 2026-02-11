const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/emailService');

// @route   POST api/contact-doctor
// @desc    Send consultation request to doctor
// @access  Public
router.post('/', async (req, res) => {
    const { doctorName, doctorEmail, patientName, patientContact, summary } = req.body;

    if (!doctorEmail || !summary) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const emailContent = `
        <h2>Patient Consultation Request</h2>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Patient Name:</strong> ${patientName || 'Anonymous'}</p>
        <p><strong>Contact:</strong> ${patientContact || 'Not provided'}</p>
        <h3>Consultation Summary:</h3>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            <pre style="white-space: pre-wrap;">${summary}</pre>
        </div>
    `;

    const result = await sendEmail({
        to: doctorEmail,
        subject: `New Consultation Request from ${patientName || 'Patient'}`,
        html: emailContent
    });

    if (result.success) {
        res.status(200).json({ success: true, message: "Email sent successfully" });
    } else {
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
});

module.exports = router;
