// Ye file aapke application ke main modules ko connect karne ke liye hai
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes Imports
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/payment');

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Root route
app.get('/', (req, res) => {
    res.send("Backend API is running!");
});

module.exports = app;