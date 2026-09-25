const express = require('express');
const router = express.Router();
const {
  createBloodRequest,
  getBloodRequests,
  getBloodRequestHistory,
  getBloodRequestById,
  respondToBloodRequest,
  verifyDonorResponse,
  updateBloodRequest,
  updateBloodRequestStatus,
  deleteBloodRequest,
} = require('../controllers/bloodRequestController');
const { protect, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', getBloodRequests);
router.get('/history', getBloodRequestHistory);
router.get('/:id', getBloodRequestById);

router.post('/', protect, createBloodRequest);
router.post('/:requestId/respond', protect, respondToBloodRequest);
router.patch('/:id/responses/:responseId/verify', protect, adminMiddleware, verifyDonorResponse);

router.put('/:id', protect, updateBloodRequest);
router.patch('/:id/status', protect, updateBloodRequestStatus);
router.delete('/:id', protect, deleteBloodRequest);

module.exports = router;
