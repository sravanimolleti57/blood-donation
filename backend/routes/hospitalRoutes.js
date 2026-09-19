const express = require('express');
const router = express.Router();
const { getHospitals, getHospitalById } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getHospitals);
router.get('/:id', protect, getHospitalById);

module.exports = router;
