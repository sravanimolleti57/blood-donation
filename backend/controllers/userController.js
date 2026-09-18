const User = require('../models/User');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.city = req.body.city || user.city;
    user.address = req.body.address || user.address;
    user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
    user.gender = req.body.gender || user.gender;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.contactPerson = req.body.contactPerson || user.contactPerson;
    user.hospitalLicenseNumber = req.body.hospitalLicenseNumber || user.hospitalLicenseNumber;
    if (req.body.profileImage) user.profileImage = req.body.profileImage;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        bloodGroup: updatedUser.bloodGroup,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        city: updatedUser.city,
        address: updatedUser.address,
        available: updatedUser.available,
        verified: updatedUser.verified,
        profileImage: updatedUser.profileImage,
        contactPerson: updatedUser.contactPerson,
        hospitalLicenseNumber: updatedUser.hospitalLicenseNumber,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update donor availability state
 * @route   PUT /api/users/availability
 * @access  Private (Donor only)
 */
const updateAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.available = typeof req.body.available === 'boolean' ? req.body.available : !user.available;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Availability updated to ${user.available ? 'AVAILABLE' : 'UNAVAILABLE'}`,
      available: user.available,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Admin - Get all users
 * @route   GET /api/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Admin - Get all registered hospitals
 * @route   GET /api/users/hospitals
 * @access  Private (Admin)
 */
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await User.find({ role: 'hospital' }).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: hospitals.length, hospitals });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Admin - Verify or reject hospital account
 * @route   PUT /api/users/verify-hospital/:id
 * @access  Private (Admin)
 */
const verifyHospital = async (req, res) => {
  try {
    const { status } = req.body; // true or false
    const hospital = await User.findById(req.params.id);

    if (!hospital || hospital.role !== 'hospital') {
      return res.status(404).json({ success: false, message: 'Hospital account not found' });
    }

    hospital.verified = status === true || status === 'true';
    await hospital.save();

    return res.status(200).json({
      success: true,
      message: `Hospital ${hospital.name} verification set to ${hospital.verified}`,
      hospital,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateAvailability,
  getAllUsers,
  getAllHospitals,
  verifyHospital,
};
