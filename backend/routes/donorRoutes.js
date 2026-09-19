const express = require('express');
const router = express.Router();
const { getDonors, getDonorById } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDonors);
router.get('/:id', protect, getDonorById);

module.exports = router;
