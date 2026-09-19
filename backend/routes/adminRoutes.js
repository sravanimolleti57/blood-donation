const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
} = require('../controllers/adminController');
const { protect, adminMiddleware } = require('../middleware/authMiddleware');

// All admin routes require protect + adminMiddleware
router.use(protect, adminMiddleware);

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
