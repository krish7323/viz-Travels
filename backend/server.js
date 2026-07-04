require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/payment');
const packageRoutes = require('./routes/packages');
const vendorAuthRoutes = require('./routes/vendorAuth');
const adminRoutes = require('./routes/adminRoutes');

// All backend integrations and dependencies loaded successfully
const app = express();


// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://viztravel.in',
    'https://www.viztravel.in',
    'https://tour-website-chi-ashen.vercel.app',
    // Render.com deployed URLs (update these after deployment)
    process.env.FRONTEND_URL,
    process.env.VENDOR_URL,
    process.env.ADMIN_URL,
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/vendor-auth', vendorAuthRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
