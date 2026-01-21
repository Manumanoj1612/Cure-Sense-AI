require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medbuddy', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/doctors', require('./routes/doctors'));

app.get('/', (req, res) => {
    res.send('MedBuddy AI Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
