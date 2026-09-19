const express = require('express');
const router = express.Router();
const {
  respondToBloodRequest,
  getMyResponses,
  getAdminDonorResponses,
  getDonorResponseById,
  acceptDonorResponse,
  rejectDonorResponse,
} = require('../controllers/donorResponseController');
const { protect, adminMiddleware } = require('../middleware/authMiddleware');

// Donor routes
router.post('/blood-requests/:requestId/respond', protect, respondToBloodRequest);
router.get('/my-responses', protect, getMyResponses);

// Admin routes
router.get('/admin/donor-responses', protect, adminMiddleware, getAdminDonorResponses);
router.get('/admin/donor-responses/:id', protect, adminMiddleware, getDonorResponseById);
router.patch('/admin/donor-responses/:id/accept', protect, adminMiddleware, acceptDonorResponse);
router.patch('/admin/donor-responses/:id/approve', protect, adminMiddleware, acceptDonorResponse);
router.patch('/admin/donor-responses/:id/reject', protect, adminMiddleware, rejectDonorResponse);

module.exports = router;
