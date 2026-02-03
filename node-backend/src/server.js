require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/reminder', require('./routes/reminder.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Node Backend running on port ${PORT}`));
