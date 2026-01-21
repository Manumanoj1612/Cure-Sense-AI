const express = require('express');
const router = express.Router();
const { predictDisease, extractPrescription, recommendDoctors, chat, parseReminder } = require('../controllers/aiController');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/predict', predictDisease);
router.post('/extract_prescription', upload.single('file'), extractPrescription);
router.post('/recommend_doctors', recommendDoctors);
router.post('/chat', chat);
router.post('/parse_reminder', parseReminder);

module.exports = router;
