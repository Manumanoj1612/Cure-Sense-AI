const express = require('express');
const router = express.Router();
const { register, login, getUserProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getUserProfile);

module.exports = router;
