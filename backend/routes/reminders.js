const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getReminders, addReminder, deleteReminder } = require('../controllers/reminderController');

router.get('/', auth, getReminders);
router.post('/', auth, addReminder);
router.delete('/:id', auth, deleteReminder);

module.exports = router;
