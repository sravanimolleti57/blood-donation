require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedAdminAccount = require('./utils/seedAdmin');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'BloodConnect API Service is live and running.',
    version: '1.0.0',
  });
});

// Register API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedAdminAccount();

    app.listen(PORT, () => {
      console.log(`[BloodConnect Server] Server running on port ${PORT}`);
      console.log(
        `[BloodConnect Server] Allowed Client CORS Origin: ${
          process.env.CLIENT_URL || 'http://localhost:5173'
        }`
      );
    });
  } catch (error) {
    console.error('[BloodConnect Server] Failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
