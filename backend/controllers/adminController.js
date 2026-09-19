const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');

/**
 * @desc    Get Admin Dashboard Statistics
 * @route   GET /api/admin/dashboard/stats
 * @access  Private (Admin)
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalHospitals = await User.countDocuments({ role: 'hospital' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({ isActive: { $ne: false } });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    const totalBloodRequests = await BloodRequest.countDocuments();
    const pendingBloodRequests = await BloodRequest.countDocuments({ status: 'pending' });
    const fulfilledBloodRequests = await BloodRequest.countDocuments({ status: 'fulfilled' });

    const totalDonations = await Donation.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDonors,
        totalHospitals,
        totalAdmins,
        activeUsers,
        inactiveUsers,
        totalBloodRequests,
        pendingBloodRequests,
        fulfilledBloodRequests,
        totalDonations,
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving admin statistics.',
    });
  }
};

/**
 * @desc    Get all users with filtering/search
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;

    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      if (status === 'active') {
        query.isActive = { $ne: false };
      } else if (status === 'inactive') {
        query.isActive = false;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { bloodGroup: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
      data: users,
    });
  } catch (error) {
    console.error('Error getting admin users:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user list.',
    });
  }
};

/**
 * @desc    Get single user details by ID
 * @route   GET /api/admin/users/:id
 * @access  Private (Admin)
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
      data: user,
    });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user details.',
    });
  }
};

/**
 * @desc    Update user profile by Admin
 * @route   PUT /api/admin/users/:id
 * @access  Private (Admin)
 */
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const {
      name,
      phone,
      role,
      bloodGroup,
      city,
      address,
      available,
      isActive,
      verified,
      contactPerson,
      hospitalLicenseNumber,
    } = req.body;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
    if (city !== undefined) user.city = city;
    if (address !== undefined) user.address = address;
    if (available !== undefined) user.available = available;
    if (isActive !== undefined) user.isActive = isActive;
    if (verified !== undefined) user.verified = verified;
    if (contactPerson !== undefined) user.contactPerson = contactPerson;
    if (hospitalLicenseNumber !== undefined) user.hospitalLicenseNumber = hospitalLicenseNumber;

    const updatedUser = await user.save();
    const safeUser = await User.findById(updatedUser._id).select('-password');

    return res.status(200).json({
      success: true,
      message: 'User account updated successfully.',
      user: safeUser,
      data: safeUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating user account.',
    });
  }
};

/**
 * @desc    Update user account active/inactive status
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (Admin)
 */
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please specify the isActive status boolean.',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Protect against deactivating the last admin
    if (user.role === 'admin' && !isActive) {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate the only active system administrator account.',
        });
      }
    }

    user.isActive = Boolean(isActive);
    await user.save();

    const safeUser = await User.findById(user._id).select('-password');

    return res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      user: safeUser,
      data: safeUser,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error changing user account status.',
    });
  }
};

/**
 * @desc    Delete user by Admin
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Do not allow admin to delete self or last admin
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own active admin account.',
      });
    }

    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the only remaining admin account in the system.',
        });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'User account deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting user account.',
    });
  }
};

/**
 * @desc    Get all donors list
 * @route   GET /api/donors
 * @access  Private / Public
 */
const getDonors = async (req, res) => {
  try {
    const { bloodGroup, city, available } = req.query;
    let query = { role: 'donor', isActive: { $ne: false } };

    if (bloodGroup && bloodGroup !== 'all') {
      query.bloodGroup = bloodGroup;
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (available !== undefined && available !== 'all') {
      query.available = available === 'true' || available === true;
    }

    const donors = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: donors.length,
      donors,
      data: donors,
    });
  } catch (error) {
    console.error('Error fetching donors:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching donors list.',
    });
  }
};

/**
 * @desc    Get donor by ID
 * @route   GET /api/donors/:id
 * @access  Private
 */
const getDonorById = async (req, res) => {
  try {
    const donor = await User.findOne({ _id: req.params.id, role: 'donor' }).select('-password');
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found.' });
    }
    return res.status(200).json({ success: true, donor, data: donor });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching donor.' });
  }
};

/**
 * @desc    Get all hospitals list
 * @route   GET /api/hospitals
 * @access  Private / Public
 */
const getHospitals = async (req, res) => {
  try {
    const { city } = req.query;
    let query = { role: 'hospital', isActive: { $ne: false } };

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const hospitals = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals,
      data: hospitals,
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching hospitals list.',
    });
  }
};

/**
 * @desc    Get hospital by ID
 * @route   GET /api/hospitals/:id
 * @access  Private
 */
const getHospitalById = async (req, res) => {
  try {
    const hospital = await User.findOne({ _id: req.params.id, role: 'hospital' }).select('-password');
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital account not found.' });
    }
    return res.status(200).json({ success: true, hospital, data: hospital });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching hospital.' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  getDonors,
  getDonorById,
  getHospitals,
  getHospitalById,
};
