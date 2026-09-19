const express = require('express');
const router = express.Router();
const {
  createBloodRequest,
  getBloodRequests,
  getBloodRequestHistory,
  getBloodRequestById,
  updateBloodRequest,
  updateBloodRequestStatus,
  deleteBloodRequest,
} = require('../controllers/bloodRequestController');
const { respondToBloodRequest } = require('../controllers/donorResponseController');
const { protect, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', getBloodRequests);
router.get('/history', getBloodRequestHistory);
router.get('/:id', getBloodRequestById);

router.post('/', protect, createBloodRequest);
router.post('/:requestId/respond', protect, respondToBloodRequest);

router.put('/:id', protect, updateBloodRequest);
router.patch('/:id/status', protect, updateBloodRequestStatus);
router.delete('/:id', protect, deleteBloodRequest);

module.exports = router;
