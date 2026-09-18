const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updateAvailability,
  getAllUsers,
  getAllHospitals,
  verifyHospital,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Authenticated user profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/availability', protect, authorizeRoles('donor', 'admin'), updateAvailability);

// Admin-only management routes
router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.get('/hospitals', protect, authorizeRoles('admin'), getAllHospitals);
router.put('/verify-hospital/:id', protect, authorizeRoles('admin'), verifyHospital);

module.exports = router;
