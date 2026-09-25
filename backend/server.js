require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedAdminAccount = require('./utils/seedAdmin');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const mongoose = require('mongoose');

const app = express();

// Configure CORS for local development and deployed frontend URLs
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure database connection for incoming requests (serverless & standalone)
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
      await seedAdminAccount();
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'BloodConnect API Service is live and running.',
    version: '1.0.0',
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'BloodConnect API Service is live and running.',
    version: '1.0.0',
  });
});

// Register API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/blood-requests', require('./routes/bloodRequestRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api', require('./routes/donorResponseRoutes'));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BloodConnect Server] Server running on port ${PORT}`);
    console.log(
      `[BloodConnect Server] Allowed Client CORS Origin(s): ${
        process.env.CLIENT_URL || 'http://localhost:5173'
      }`
    );
  });

  try {
    await connectDB();
    await seedAdminAccount();
  } catch (error) {
    console.error('[BloodConnect Server] Initial MongoDB Connection Notice:', error.message);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
