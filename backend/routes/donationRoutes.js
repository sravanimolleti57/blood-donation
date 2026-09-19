const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonations,
  getMyDonations,
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createDonation);
router.get('/', getDonations);
router.get('/my-history', getMyDonations);

module.exports = router;
