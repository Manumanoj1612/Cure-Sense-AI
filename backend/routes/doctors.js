const express = require('express');
const router = express.Router();
const { getDoctors, seedDoctors } = require('../controllers/doctorController');

router.get('/', getDoctors);
router.post('/seed', seedDoctors);

module.exports = router;
