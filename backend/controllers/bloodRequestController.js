const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

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
      status: req.user.role === 'admin' || req.user.role === 'hospital' ? 'approved' : 'pending',
    });

    const populatedRequest = await BloodRequest.findById(bloodRequest._id).populate('requester', 'name email phone role');

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
    const { bloodGroup, city, urgency, status, requester } = req.query;

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
    if (status && status !== 'all') {
      query.status = status;
    }
    if (requester) {
      query.requester = requester;
    }

    const requests = await BloodRequest.find(query)
      .populate('requester', 'name email phone role city')
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
 * @desc    Get single blood request details
 * @route   GET /api/blood-requests/:id
 * @access  Public / Private
 */
const getBloodRequestById = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id)
      .populate('requester', 'name email phone role city address');

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
 * @desc    Update blood request
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

    // Check ownership or admin role
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
    const populated = await BloodRequest.findById(updatedRequest._id).populate('requester', 'name email phone role');

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

    const populated = await BloodRequest.findById(bloodRequest._id).populate('requester', 'name email phone role');

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
  getBloodRequestById,
  updateBloodRequest,
  updateBloodRequestStatus,
  deleteBloodRequest,
};
