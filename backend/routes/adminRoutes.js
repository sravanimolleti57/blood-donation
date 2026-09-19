const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getUsers,
  getAdmins,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  getAllDonors,
  getDonorById,
  getDonorDonationHistory,
  updateDonor,
  updateDonorStatus,
  deleteDonor,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  updateHospitalStatus,
  deleteHospital,
  getAllDonations,
} = require('../controllers/adminController');
const { protect, adminMiddleware } = require('../middleware/authMiddleware');

// All admin routes require protect + adminMiddleware
router.use(protect, adminMiddleware);

// Dashboard
router.get('/dashboard/stats', getAdminDashboardStats);

// Management
router.get('/management', getAdmins);

// Donors Management
router.get('/donors', getAllDonors);
router.get('/donors/:id', getDonorById);
router.get('/donors/:id/history', getDonorDonationHistory);
router.put('/donors/:id', updateDonor);
router.patch('/donors/:id/status', updateDonorStatus);
router.delete('/donors/:id', deleteDonor);

// Hospitals Management
router.get('/hospitals', getAllHospitals);
router.get('/hospitals/:id', getHospitalById);
router.put('/hospitals/:id', updateHospital);
router.patch('/hospitals/:id/status', updateHospitalStatus);
router.delete('/hospitals/:id', deleteHospital);

// General Users Management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// All Donations
router.get('/donations', getAllDonations);

module.exports = router;
