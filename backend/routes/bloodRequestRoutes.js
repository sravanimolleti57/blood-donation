const express = require('express');
const router = express.Router();
const {
  createBloodRequest,
  getBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  updateBloodRequestStatus,
  deleteBloodRequest,
} = require('../controllers/bloodRequestController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getBloodRequests);
router.get('/:id', getBloodRequestById);

router.post('/', protect, createBloodRequest);
router.put('/:id', protect, updateBloodRequest);
router.patch('/:id/status', protect, updateBloodRequestStatus);
router.delete('/:id', protect, deleteBloodRequest);

module.exports = router;
