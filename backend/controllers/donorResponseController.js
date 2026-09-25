const DonorResponse = require('../models/DonorResponse');
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const Donation = require('../models/Donation');

const MIN_DONATION_INTERVAL_MONTHS = 6;

/**
 * @desc    Donor submits response form for an active emergency blood request
 * @route   POST /api/blood-requests/:requestId/respond
 * @access  Private (Donor)
 */
const respondToBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const donorId = req.user._id;

    if (req.user.role !== 'donor') {
      return res.status(403).json({
        success: false,
        message: 'Only registered donor accounts can submit blood request responses.',
      });
    }

    const bloodRequest = await BloodRequest.findById(requestId);

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found.',
      });
    }

    if (bloodRequest.status === 'fulfilled' || bloodRequest.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This blood request has been fulfilled or closed and is no longer active.',
      });
    }

    // Check duplicate response
    const existingResponse = await DonorResponse.findOne({
      request: requestId,
      donor: donorId,
    });

    if (existingResponse) {
      return res.status(409).json({
        success: false,
        message: 'You have already responded to this blood request.',
      });
    }

    const {
      age,
      weight,
      lastDonationDate,
      monthsSinceLastDonation,
      bloodGroup,
      availability,
      city,
      phone,
      healthDeclaration,
      additionalNotes,
    } = req.body;

    if (!age || !weight || !bloodGroup || !city || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (Age, Weight, Blood Group, City, Phone Number).',
      });
    }

    if (healthDeclaration !== true && healthDeclaration !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'You must confirm the health declaration to proceed.',
      });
    }

    const parsedAge = Number(age);
    const parsedWeight = Number(weight);

    if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 65) {
      return res.status(400).json({
        success: false,
        message: 'Age must be between 18 and 65 years for donor eligibility.',
      });
    }

    if (isNaN(parsedWeight) || parsedWeight < 45) {
      return res.status(400).json({
        success: false,
        message: 'Weight must be at least 45 kg for donor eligibility.',
      });
    }

    let parsedLastDonationDate = lastDonationDate ? new Date(lastDonationDate) : null;
    let computedMonths = null;

    if (parsedLastDonationDate && !isNaN(parsedLastDonationDate.getTime())) {
      const diffDays = Math.floor((Date.now() - parsedLastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
      computedMonths = Math.floor(diffDays / 30);
    } else if (monthsSinceLastDonation !== undefined && monthsSinceLastDonation !== null && monthsSinceLastDonation !== '') {
      const val = Number(monthsSinceLastDonation);
      if (!isNaN(val)) {
        computedMonths = val;
      }
    }

    const newResponse = await DonorResponse.create({
      request: requestId,
      donor: donorId,
      age: parsedAge,
      weight: parsedWeight,
      bloodGroup,
      lastDonationDate: parsedLastDonationDate,
      monthsSinceLastDonation: computedMonths,
      availability: availability !== false,
      city,
      phone,
      healthDeclaration: true,
      additionalNotes: additionalNotes || '',
      status: 'responded',
      eligibilityStatus: 'responded',
    });

    const populatedResponse = await DonorResponse.findById(newResponse._id)
      .populate('request')
      .populate('donor', 'name email phone bloodGroup city available');

    return res.status(201).json({
      success: true,
      message: 'Response submitted successfully.',
      data: populatedResponse,
      donorResponse: populatedResponse,
    });
  } catch (error) {
    console.error('Error submitting donor response:', error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already responded to this blood request.',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error submitting donor response.',
    });
  }
};

/**
 * @desc    Get donor's own submitted responses with status
 * @route   GET /api/donor-responses/my-responses
 * @access  Private (Donor)
 */
const getMyResponses = async (req, res) => {
  try {
    const responses = await DonorResponse.find({ donor: req.user._id })
      .populate('request')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: responses.length,
      responses,
      data: responses,
    });
  } catch (error) {
    console.error('Error fetching my responses:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving your submitted responses.',
    });
  }
};

/**
 * @desc    Get all donor responses for Admin review
 * @route   GET /api/admin/donor-responses
 * @access  Private (Admin)
 */
const getAdminDonorResponses = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const responses = await DonorResponse.find(query)
      .populate('donor', 'name email phone bloodGroup city available dateOfBirth gender')
      .populate('request')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: responses.length,
      responses,
      data: responses,
    });
  } catch (error) {
    console.error('Error fetching admin donor responses:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving donor responses for admin review.',
    });
  }
};

/**
 * @desc    Get single donor response details for Admin review
 * @route   GET /api/admin/donor-responses/:id
 * @access  Private (Admin)
 */
const getDonorResponseById = async (req, res) => {
  try {
    const response = await DonorResponse.findById(req.params.id)
      .populate('donor', 'name email phone bloodGroup city available dateOfBirth gender isActive')
      .populate('request')
      .populate('reviewedBy', 'name email');

    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Donor response record not found.',
      });
    }

    const donorUser = response.donor;
    const reqDoc = response.request;

    // Perform software-level eligibility calculation
    let isAgeEligible = response.age >= 18 && response.age <= 65;
    let isWeightEligible = response.weight >= 45;
    let isBloodGroupCompatible =
      response.bloodGroup === reqDoc.bloodGroup || response.bloodGroup === 'O-';
    let isAvailable = response.availability !== false && donorUser?.available !== false;
    let isActiveAccount = donorUser?.isActive !== false;

    let isIntervalEligible = true;
    let daysSinceLast = null;
    let monthsSinceLast = response.monthsSinceLastDonation;

    if (response.lastDonationDate) {
      const diffDays = Math.floor((Date.now() - new Date(response.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24));
      daysSinceLast = diffDays;
      monthsSinceLast = Math.floor(diffDays / 30);
      isIntervalEligible = diffDays >= 180; // 6-month rule
    } else if (monthsSinceLast !== null && monthsSinceLast !== undefined) {
      isIntervalEligible = monthsSinceLast >= 6;
    }

    const overallEligible =
      isAgeEligible &&
      isWeightEligible &&
      isBloodGroupCompatible &&
      isAvailable &&
      isActiveAccount &&
      isIntervalEligible &&
      response.healthDeclaration === true;

    const responseObj = response.toObject();
    responseObj.calculatedEligibility = {
      isAgeEligible,
      isWeightEligible,
      isBloodGroupCompatible,
      isAvailable,
      isActiveAccount,
      isIntervalEligible,
      daysSinceLast,
      monthsSinceLast,
      overallEligible,
    };

    return res.status(200).json({
      success: true,
      donorResponse: responseObj,
      data: responseObj,
    });
  } catch (error) {
    console.error('Error fetching donor response details:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving response details.',
    });
  }
};

/**
 * @desc    Admin accepts donor response
 * @route   PATCH /api/admin/donor-responses/:id/accept
 * @access  Private (Admin)
 */
const acceptDonorResponse = async (req, res) => {
  try {
    const response = await DonorResponse.findById(req.params.id)
      .populate('donor')
      .populate('request');

    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Donor response record not found.',
      });
    }

    if (response.status === 'accepted' || response.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This donor response has already been approved.',
      });
    }

    const donorUser = response.donor;
    const bloodRequest = response.request;

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Associated blood request not found.',
      });
    }

    if (bloodRequest.status === 'fulfilled') {
      return res.status(400).json({
        success: false,
        message: 'This blood request has already been fulfilled and closed.',
      });
    }

    // Backend re-verify eligibility rules before accepting
    if (donorUser && donorUser.isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Cannot accept response: Donor account is deactivated.',
      });
    }

    if (response.availability === false || (donorUser && donorUser.available === false)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot accept response: Donor is currently marked as unavailable.',
      });
    }

    // 6-Month interval check
    if (response.lastDonationDate) {
      const diffDays = Math.floor((Date.now() - new Date(response.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 180) {
        response.eligibilityStatus = 'not_eligible';
        await response.save();
        return res.status(400).json({
          success: false,
          message: `Cannot accept response: Donor donated ${diffDays} days ago, failing the 6-month minimum interval requirement.`,
        });
      }
    } else if (response.monthsSinceLastDonation !== null && response.monthsSinceLastDonation < 6) {
      response.eligibilityStatus = 'not_eligible';
      await response.save();
      return res.status(400).json({
        success: false,
        message: `Cannot accept response: Donor last donated ${response.monthsSinceLastDonation} months ago, failing 6-month rule.`,
      });
    }

    // Mark Response Approved
    response.status = 'approved';
    response.eligibilityStatus = 'eligible';
    response.reviewedBy = req.user._id;
    response.reviewedAt = new Date();
    if (req.body.adminNotes) response.adminNotes = req.body.adminNotes;
    await response.save();

    // Synchronize subdocument in bloodRequest responses array if present
    if (bloodRequest && Array.isArray(bloodRequest.responses)) {
      const subResp = bloodRequest.responses.find(
        (r) => r.donor?.toString() === donorUser._id.toString()
      );
      if (subResp) {
        subResp.status = 'approved';
        if (req.body.adminNotes) subResp.notes = req.body.adminNotes;
      }
    }

    // Mark Blood Request Fulfilled (CLOSED)
    bloodRequest.fulfilledUnits = (bloodRequest.fulfilledUnits || 0) + 1;
    bloodRequest.status = 'fulfilled'; // Request is now fulfilled and closed
    await bloodRequest.save();

    // Create completed Donation record in MongoDB
    await Donation.create({
      donor: donorUser._id,
      bloodRequest: bloodRequest._id,
      bloodGroup: bloodRequest.bloodGroup,
      units: 1,
      hospital: bloodRequest.requester,
      hospitalName: bloodRequest.hospitalName,
      status: 'completed',
      notes: req.body.adminNotes || `Accepted by Admin ${req.user.name}`,
    });

    const updatedResponse = await DonorResponse.findById(response._id)
      .populate('donor')
      .populate('request');

    return res.status(200).json({
      success: true,
      message: 'Donor response accepted! Blood request has been marked as FULFILLED and CLOSED.',
      data: updatedResponse,
      donorResponse: updatedResponse,
    });
  } catch (error) {
    console.error('Error accepting donor response:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error accepting donor response.',
    });
  }
};

/**
 * @desc    Admin rejects donor response
 * @route   PATCH /api/admin/donor-responses/:id/reject
 * @access  Private (Admin)
 */
const rejectDonorResponse = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const response = await DonorResponse.findById(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Donor response record not found.',
      });
    }

    response.status = 'rejected';
    response.eligibilityStatus = 'not_eligible';
    response.adminNotes = adminNotes || 'Response rejected during admin verification.';
    response.reviewedBy = req.user._id;
    response.reviewedAt = new Date();
    await response.save();

    const updatedResponse = await DonorResponse.findById(response._id)
      .populate('donor')
      .populate('request');

    return res.status(200).json({
      success: true,
      message: 'Donor response rejected. Emergency blood request remains active for other donors.',
      data: updatedResponse,
      donorResponse: updatedResponse,
    });
  } catch (error) {
    console.error('Error rejecting donor response:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error rejecting donor response.',
    });
  }
};

module.exports = {
  respondToBloodRequest,
  getMyResponses,
  getAdminDonorResponses,
  getDonorResponseById,
  acceptDonorResponse,
  rejectDonorResponse,
};
