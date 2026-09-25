const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const Donation = require('../models/Donation');
const DonorResponse = require('../models/DonorResponse');

/**
 * @desc    Create a new blood request
 * @route   POST /api/blood-requests
 * @access  Private (Hospital, Admin, Donor)
 */
const createBloodRequest = async (req, res) => {
  try {
    const {
      hospitalName,
      bloodGroup,
      unitsRequired,
      urgency = 'normal',
      city,
      hospitalAddress,
      requiredDate,
      contactPhone,
      description,
    } = req.body;

    if (!hospitalName || !bloodGroup || !unitsRequired || !city || !hospitalAddress || !requiredDate || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory blood request fields.',
      });
    }

    const bloodRequest = await BloodRequest.create({
      requester: req.user._id,
      hospitalName,
      bloodGroup,
      unitsRequired: Number(unitsRequired),
      urgency,
      city,
      hospitalAddress,
      requiredDate,
      contactPhone,
      description: description || '',
      status: req.body.status || 'pending',
    });

    const populatedRequest = await BloodRequest.findById(bloodRequest._id)
      .populate('requester', 'name email phone role')
      .populate('responses.donor', 'name email phone bloodGroup city available gender dateOfBirth');

    return res.status(201).json({
      success: true,
      message: 'Blood request submitted successfully.',
      bloodRequest: populatedRequest,
      data: populatedRequest,
    });
  } catch (error) {
    console.error('Error creating blood request:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating blood request.',
    });
  }
};

/**
 * @desc    Get all blood requests
 * @route   GET /api/blood-requests
 * @access  Public / Private
 */
const getBloodRequests = async (req, res) => {
  try {
    const { bloodGroup, city, urgency, status, requester, activeOnly } = req.query;

    let query = {};

    if (bloodGroup && bloodGroup !== 'all') {
      query.bloodGroup = bloodGroup;
    }
    if (city && city !== 'all') {
      query.city = { $regex: city, $options: 'i' };
    }
    if (urgency && urgency !== 'all') {
      query.urgency = urgency;
    }
    if (status === 'active') {
      query.status = { $in: ['pending', 'approved'] };
    } else if (status && status !== 'all') {
      query.status = status;
    }

    if (activeOnly === 'true' || activeOnly === true) {
      query.status = { $in: ['pending', 'approved'] };
    }
    if (requester) {
      query.requester = requester;
    }

    const requests = await BloodRequest.find(query)
      .populate('requester', 'name email phone role city')
      .populate('responses.donor', 'name email phone bloodGroup city available gender dateOfBirth')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      bloodRequests: requests,
      data: requests,
    });
  } catch (error) {
    console.error('Error getting blood requests:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving blood requests.',
    });
  }
};

/**
 * @desc    Get fulfilled / cancelled blood request history
 * @route   GET /api/blood-requests/history
 * @access  Public / Private
 */
const getBloodRequestHistory = async (req, res) => {
  try {
    const historyRequests = await BloodRequest.find({
      status: { $in: ['fulfilled', 'cancelled'] },
    })
      .populate('requester', 'name email phone role city')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: historyRequests.length,
      bloodRequests: historyRequests,
      data: historyRequests,
    });
  } catch (error) {
    console.error('Error fetching blood request history:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving blood request history.',
    });
  }
};

/**
 * @desc    Get single blood request details with populated responses
 * @route   GET /api/blood-requests/:id
 * @access  Public / Private
 */
const getBloodRequestById = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id)
      .populate('requester', 'name email phone role city address')
      .populate('responses.donor', 'name email phone bloodGroup city available gender dateOfBirth');

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request record not found.',
      });
    }

    return res.status(200).json({
      success: true,
      bloodRequest,
      data: bloodRequest,
    });
  } catch (error) {
    console.error('Error getting blood request by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving blood request details.',
    });
  }
};

/**
 * @desc    Donor responds to an active emergency blood request
 * @route   POST /api/blood-requests/:id/respond
 * @access  Private (Donor)
 */
const respondToBloodRequest = async (req, res) => {
  try {
    const donorId = req.user._id;

    if (req.user.role !== 'donor') {
      return res.status(403).json({
        success: false,
        message: 'Only registered donors can respond to blood requests.',
      });
    }

    const bloodRequest = await BloodRequest.findById(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Emergency blood request not found.',
      });
    }

    if (bloodRequest.status === 'fulfilled' || bloodRequest.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This blood request is closed/fulfilled and no longer accepting donor responses.',
      });
    }

    // Check if donor already responded
    const alreadyResponded = bloodRequest.responses.some(
      (r) => r.donor.toString() === donorId.toString()
    );

    if (alreadyResponded) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted a response for this blood request.',
      });
    }

    // Calculate donor eligibility details from MongoDB
    const pastDonations = await Donation.find({ donor: donorId, status: 'completed' })
      .sort({ donationDate: -1 });

    const totalDonations = pastDonations.length;
    const lastDonationDate = pastDonations.length > 0 ? pastDonations[0].donationDate : null;

    let daysSinceLastDonation = null;
    let eligibleSixMonths = true;

    if (lastDonationDate) {
      const diffTime = Math.abs(new Date() - new Date(lastDonationDate));
      daysSinceLastDonation = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      // 6-month rule: 180 days minimum interval
      eligibleSixMonths = daysSinceLastDonation >= 180;
    }

    // Blood group compatibility matching
    const donorBloodGroup = req.user.bloodGroup || '';
    const requestBloodGroup = bloodRequest.bloodGroup;
    const bloodGroupMatch =
      donorBloodGroup === requestBloodGroup || donorBloodGroup === 'O-'; // O- is universal donor

    const availabilityMatch = req.user.available !== false;

    // Attach response to blood request
    bloodRequest.responses.push({
      donor: donorId,
      respondedAt: new Date(),
      status: 'pending',
      notes: req.body.notes || `Donor ${req.user.name} responded to emergency request for ${bloodRequest.hospitalName}`,
      verificationDetails: {
        lastDonationDate,
        totalDonations,
        eligibleSixMonths,
        daysSinceLastDonation,
        bloodGroupMatch,
        availabilityMatch,
      },
    });

    await bloodRequest.save();

    const updatedRequest = await BloodRequest.findById(bloodRequest._id)
      .populate('requester', 'name email phone role')
      .populate('responses.donor', 'name email phone bloodGroup city available gender dateOfBirth');

    return res.status(200).json({
      success: true,
      message: 'Your donation response has been submitted to the Admin Portal for verification.',
      bloodRequest: updatedRequest,
      data: updatedRequest,
    });
  } catch (error) {
    console.error('Error responding to blood request:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error submitting donor response.',
    });
  }
};

/**
 * @desc    Admin verifies donor response (ACCEPT or REJECT)
 * @route   PATCH /api/blood-requests/:id/responses/:responseId/verify
 * @access  Private (Admin)
 */
const verifyDonorResponse = async (req, res) => {
  try {
    const { id, responseId } = req.params;
    const { action, notes } = req.body; // action: 'accept' | 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "accept" or "reject".',
      });
    }

    const bloodRequest = await BloodRequest.findById(id);

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request record not found.',
      });
    }

    const donorResponse = bloodRequest.responses.id(responseId);

    if (!donorResponse) {
      return res.status(404).json({
        success: false,
        message: 'Donor response record not found.',
      });
    }

    if (action === 'accept') {
      donorResponse.status = 'approved';
      if (notes) donorResponse.notes = notes;

      // Update standalone DonorResponse collection document
      await DonorResponse.findOneAndUpdate(
        { request: bloodRequest._id, donor: donorResponse.donor },
        {
          status: 'approved',
          eligibilityStatus: 'eligible',
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
          adminNotes: notes || '',
        }
      );

      // Create a completed Donation record in MongoDB
      await Donation.create({
        donor: donorResponse.donor,
        bloodRequest: bloodRequest._id,
        bloodGroup: bloodRequest.bloodGroup,
        units: 1,
        hospital: bloodRequest.requester,
        hospitalName: bloodRequest.hospitalName,
        status: 'completed',
        notes: notes || `Admin verified and accepted response from donor.`,
      });

      // Increment fulfilled units and mark request as FULFILLED (CLOSED)
      bloodRequest.fulfilledUnits = (bloodRequest.fulfilledUnits || 0) + 1;
      bloodRequest.status = 'fulfilled';
    } else if (action === 'reject') {
      donorResponse.status = 'rejected';
      if (notes) donorResponse.notes = notes;

      await DonorResponse.findOneAndUpdate(
        { request: bloodRequest._id, donor: donorResponse.donor },
        {
          status: 'rejected',
          eligibilityStatus: 'not_eligible',
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
          adminNotes: notes || '',
        }
      );
    }

    await bloodRequest.save();

    const updatedRequest = await BloodRequest.findById(bloodRequest._id)
      .populate('requester', 'name email phone role')
      .populate('responses.donor', 'name email phone bloodGroup city available gender dateOfBirth');

    return res.status(200).json({
      success: true,
      message: `Donor response has been ${action === 'accept' ? 'ACCEPTED' : 'REJECTED'}. ${
        bloodRequest.status === 'fulfilled' ? 'Request is now FULFILLED and CLOSED.' : ''
      }`,
      bloodRequest: updatedRequest,
      data: updatedRequest,
    });
  } catch (error) {
    console.error('Error verifying donor response:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing admin verification action.',
    });
  }
};

/**
 * @desc    Update blood request details
 * @route   PUT /api/blood-requests/:id
 * @access  Private (Requester / Admin)
 */
const updateBloodRequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found.',
      });
    }

    if (
      bloodRequest.requester.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to update this request.',
      });
    }

    const {
      hospitalName,
      bloodGroup,
      unitsRequired,
      urgency,
      city,
      hospitalAddress,
      requiredDate,
      contactPhone,
      description,
      status,
    } = req.body;

    if (hospitalName !== undefined) bloodRequest.hospitalName = hospitalName;
    if (bloodGroup !== undefined) bloodRequest.bloodGroup = bloodGroup;
    if (unitsRequired !== undefined) bloodRequest.unitsRequired = Number(unitsRequired);
    if (urgency !== undefined) bloodRequest.urgency = urgency;
    if (city !== undefined) bloodRequest.city = city;
    if (hospitalAddress !== undefined) bloodRequest.hospitalAddress = hospitalAddress;
    if (requiredDate !== undefined) bloodRequest.requiredDate = requiredDate;
    if (contactPhone !== undefined) bloodRequest.contactPhone = contactPhone;
    if (description !== undefined) bloodRequest.description = description;
    if (status !== undefined) bloodRequest.status = status;

    const updatedRequest = await bloodRequest.save();
    const populated = await BloodRequest.findById(updatedRequest._id)
      .populate('requester', 'name email phone role')
      .populate('responses.donor', 'name email phone bloodGroup city available gender dateOfBirth');

    return res.status(200).json({
      success: true,
      message: 'Blood request updated successfully.',
      bloodRequest: populated,
      data: populated,
    });
  } catch (error) {
    console.error('Error updating blood request:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating blood request.',
    });
  }
};

/**
 * @desc    Update blood request status
 * @route   PATCH /api/blood-requests/:id/status
 * @access  Private (Requester / Admin)
 */
const updateBloodRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'fulfilled', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value provided.',
      });
    }

    const bloodRequest = await BloodRequest.findById(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found.',
      });
    }

    if (
      bloodRequest.requester.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to modify status.',
      });
    }

    bloodRequest.status = status;
    await bloodRequest.save();

    const populated = await BloodRequest.findById(bloodRequest._id)
      .populate('requester', 'name email phone role')
      .populate('responses.donor', 'name email phone bloodGroup city available gender dateOfBirth');

    return res.status(200).json({
      success: true,
      message: `Blood request status set to '${status}'.`,
      bloodRequest: populated,
      data: populated,
    });
  } catch (error) {
    console.error('Error updating blood request status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating request status.',
    });
  }
};

/**
 * @desc    Delete blood request
 * @route   DELETE /api/blood-requests/:id
 * @access  Private (Requester / Admin)
 */
const deleteBloodRequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found.',
      });
    }

    if (
      bloodRequest.requester.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to delete this request.',
      });
    }

    await BloodRequest.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Blood request deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting blood request:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting blood request.',
    });
  }
};

module.exports = {
  createBloodRequest,
  getBloodRequests,
  getBloodRequestHistory,
  getBloodRequestById,
  respondToBloodRequest,
  verifyDonorResponse,
  updateBloodRequest,
  updateBloodRequestStatus,
  deleteBloodRequest,
};
