const Donation = require('../models/Donation');
const BloodRequest = require('../models/BloodRequest');

/**
 * @desc    Log a new donation record
 * @route   POST /api/donations
 * @access  Private (Donor, Hospital, Admin)
 */
const createDonation = async (req, res) => {
  try {
    const {
      bloodRequestId,
      bloodGroup,
      units = 1,
      hospitalId,
      hospitalName,
      status = 'completed',
      notes,
    } = req.body;

    const donorId = req.user.role === 'donor' ? req.user._id : req.body.donorId;

    if (!donorId || !bloodGroup) {
      return res.status(400).json({
        success: false,
        message: 'Donor information and blood group are required.',
      });
    }

    const donation = await Donation.create({
      donor: donorId,
      bloodRequest: bloodRequestId || null,
      bloodGroup,
      units: Number(units),
      hospital: hospitalId || null,
      hospitalName: hospitalName || '',
      status,
      notes: notes || '',
    });

    // If linked to a blood request, increment fulfilledUnits and update status if completed
    if (bloodRequestId) {
      const request = await BloodRequest.findById(bloodRequestId);
      if (request) {
        request.fulfilledUnits = (request.fulfilledUnits || 0) + Number(units);
        if (request.fulfilledUnits >= request.unitsRequired) {
          request.status = 'fulfilled';
        }
        await request.save();
      }
    }

    const populated = await Donation.findById(donation._id)
      .populate('donor', 'name email phone bloodGroup city')
      .populate('bloodRequest')
      .populate('hospital', 'name email phone city');

    return res.status(201).json({
      success: true,
      message: 'Donation record saved successfully.',
      donation: populated,
      data: populated,
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating donation record.',
    });
  }
};

/**
 * @desc    Get all donation records
 * @route   GET /api/donations
 * @access  Private (Admin, Hospital)
 */
const getDonations = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'hospital') {
      query.hospital = req.user._id;
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name email phone bloodGroup city')
      .populate('bloodRequest')
      .populate('hospital', 'name email phone city')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: donations.length,
      donations,
      data: donations,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving donation records.',
    });
  }
};

/**
 * @desc    Get logged in donor's donation history
 * @route   GET /api/donations/my-history
 * @access  Private (Donor)
 */
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('bloodRequest')
      .populate('hospital', 'name email phone city')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: donations.length,
      donations,
      data: donations,
    });
  } catch (error) {
    console.error('Error fetching my donations:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving donation history.',
    });
  }
};

module.exports = {
  createDonation,
  getDonations,
  getMyDonations,
};
