const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');
const DonorResponse = require('../models/DonorResponse');

/**
 * @desc    Get Admin Dashboard Statistics
 * @route   GET /api/admin/dashboard/stats
 * @access  Private (Admin)
 */
const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalHospitals = await User.countDocuments({ role: 'hospital' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const activeUsers = await User.countDocuments({ isActive: { $ne: false } });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    const activeDonors = await User.countDocuments({ role: 'donor', isActive: { $ne: false } });
    const inactiveDonors = await User.countDocuments({ role: 'donor', isActive: false });

    const activeHospitals = await User.countDocuments({ role: 'hospital', isActive: { $ne: false } });
    const inactiveHospitals = await User.countDocuments({ role: 'hospital', isActive: false });

    const totalBloodRequests = await BloodRequest.countDocuments();
    const activeBloodRequests = await BloodRequest.countDocuments({ status: { $in: ['pending', 'approved'] } });
    const pendingBloodRequests = await BloodRequest.countDocuments({ status: 'pending' });
    const approvedBloodRequests = await BloodRequest.countDocuments({ status: 'approved' });
    const fulfilledRequests = await BloodRequest.countDocuments({ status: 'fulfilled' });

    const pendingDonorResponses = await DonorResponse.countDocuments({ status: 'pending' });
    const acceptedResponses = await DonorResponse.countDocuments({ status: 'accepted' });
    const rejectedResponses = await DonorResponse.countDocuments({ status: 'rejected' });

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
        activeDonors,
        inactiveDonors,
        activeHospitals,
        inactiveHospitals,
        totalBloodRequests,
        activeBloodRequests,
        pendingBloodRequests,
        approvedBloodRequests,
        fulfilledBloodRequests,
        fulfilledRequests,
        pendingDonorResponses,
        acceptedResponses,
        rejectedResponses,
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
 * @desc    Get all users (general view)
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
 * @desc    Get all admin accounts for Admin Management
 * @route   GET /api/admin/management
 * @access  Private (Admin)
 */
const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: admins.length,
      admins,
      data: admins,
    });
  } catch (error) {
    console.error('Error fetching admin accounts:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching administrator list.',
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
      bloodGroup,
      city,
      address,
      available,
      isActive,
      verified,
      contactPerson,
      hospitalLicenseNumber,
      dateOfBirth,
      gender,
    } = req.body;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
    if (city !== undefined) user.city = city;
    if (address !== undefined) user.address = address;
    if (available !== undefined) user.available = available;
    if (isActive !== undefined) user.isActive = isActive;
    if (verified !== undefined) user.verified = verified;
    if (contactPerson !== undefined) user.contactPerson = contactPerson;
    if (hospitalLicenseNumber !== undefined) user.hospitalLicenseNumber = hospitalLicenseNumber;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;

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

// ============================================================
// DONOR MANAGEMENT CONTROLLERS
// ============================================================

/**
 * @desc    Get all donor accounts with filtering and search
 * @route   GET /api/admin/donors
 * @access  Private (Admin)
 */
const getAllDonors = async (req, res) => {
  try {
    const { bloodGroup, availability, available, status, city, search } = req.query;

    let query = { role: 'donor' };

    if (bloodGroup && bloodGroup !== 'all' && bloodGroup !== 'All') {
      query.bloodGroup = bloodGroup;
    }

    const availVal = availability !== undefined ? availability : available;
    if (availVal !== undefined && availVal !== 'all' && availVal !== 'All') {
      query.available = availVal === 'true' || availVal === true || availVal === 'Available';
    }

    if (status && status !== 'all' && status !== 'All') {
      if (status.toLowerCase() === 'active') {
        query.isActive = { $ne: false };
      } else if (status.toLowerCase() === 'inactive') {
        query.isActive = false;
      }
    }

    if (city && city !== 'all' && city !== 'All') {
      query.city = { $regex: city, $options: 'i' };
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { city: searchRegex },
        { bloodGroup: searchRegex },
      ];
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
      message: 'Unable to load donor profiles. Please try again.',
    });
  }
};

/**
 * @desc    Get single donor profile by ID with donation statistics
 * @route   GET /api/admin/donors/:id
 * @access  Private (Admin)
 */
const getDonorById = async (req, res) => {
  try {
    const donor = await User.findOne({ _id: req.params.id, role: 'donor' }).select('-password');

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found.',
      });
    }

    const donations = await Donation.find({ donor: donor._id }).sort({ donationDate: -1 });
    const totalDonations = donations.length;
    const lastDonationDate = donations.length > 0 ? donations[0].donationDate : null;

    const donorObj = donor.toObject();
    donorObj.totalDonations = totalDonations;
    donorObj.lastDonationDate = lastDonationDate;

    return res.status(200).json({
      success: true,
      donor: donorObj,
      data: donorObj,
    });
  } catch (error) {
    console.error('Error fetching donor by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving donor profile details.',
    });
  }
};

/**
 * @desc    Update donor profile information
 * @route   PUT /api/admin/donors/:id
 * @access  Private (Admin)
 */
const updateDonor = async (req, res) => {
  try {
    const donor = await User.findOne({ _id: req.params.id, role: 'donor' });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor account not found.',
      });
    }

    const {
      name,
      phone,
      gender,
      dateOfBirth,
      bloodGroup,
      city,
      address,
      available,
      availability,
    } = req.body;

    if (name !== undefined) donor.name = name;
    if (phone !== undefined) donor.phone = phone;
    if (gender !== undefined) donor.gender = gender;
    if (dateOfBirth !== undefined) donor.dateOfBirth = dateOfBirth;
    if (bloodGroup !== undefined) donor.bloodGroup = bloodGroup;
    if (city !== undefined) donor.city = city;
    if (address !== undefined) donor.address = address;

    const availVal = availability !== undefined ? availability : available;
    if (availVal !== undefined) donor.available = Boolean(availVal);

    donor.role = 'donor';

    await donor.save();

    const updatedDonor = await User.findById(donor._id).select('-password');
    const donations = await Donation.find({ donor: donor._id }).sort({ donationDate: -1 });
    
    const donorObj = updatedDonor.toObject();
    donorObj.totalDonations = donations.length;
    donorObj.lastDonationDate = donations.length > 0 ? donations[0].donationDate : null;

    return res.status(200).json({
      success: true,
      message: 'Donor profile updated successfully.',
      donor: donorObj,
      data: donorObj,
    });
  } catch (error) {
    console.error('Error updating donor:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating donor profile.',
    });
  }
};

/**
 * @desc    Activate or deactivate donor account
 * @route   PATCH /api/admin/donors/:id/status
 * @access  Private (Admin)
 */
const updateDonorStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide isActive boolean status.',
      });
    }

    const donor = await User.findOne({ _id: req.params.id, role: 'donor' });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor account not found.',
      });
    }

    donor.isActive = Boolean(isActive);
    await donor.save();

    const safeDonor = await User.findById(donor._id).select('-password');

    return res.status(200).json({
      success: true,
      message: `Donor account ${donor.isActive ? 'activated' : 'deactivated'} successfully.`,
      donor: safeDonor,
      data: safeDonor,
    });
  } catch (error) {
    console.error('Error updating donor status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error changing donor status.',
    });
  }
};

/**
 * @desc    Delete donor account safely
 * @route   DELETE /api/admin/donors/:id
 * @access  Private (Admin)
 */
const deleteDonor = async (req, res) => {
  try {
    const donor = await User.findOne({ _id: req.params.id, role: 'donor' });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found.',
      });
    }

    await Donation.deleteMany({ donor: donor._id });
    await User.findByIdAndDelete(donor._id);

    return res.status(200).json({
      success: true,
      message: 'Donor profile deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting donor:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting donor account.',
    });
  }
};

/**
 * @desc    Get donor donation history by ID
 * @route   GET /api/admin/donors/:id/history
 * @access  Private (Admin)
 */
const getDonorDonationHistory = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.params.id })
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
    console.error('Error fetching donor donation history:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving donor donation history.',
    });
  }
};

// ============================================================
// HOSPITAL MANAGEMENT CONTROLLERS
// ============================================================

/**
 * @desc    Get all hospital accounts with statistics, search, and filtering
 * @route   GET /api/admin/hospitals
 * @access  Private (Admin)
 */
const getAllHospitals = async (req, res) => {
  try {
    const { search, city, status, sort } = req.query;

    let query = { role: 'hospital' };

    if (status && status !== 'all' && status !== 'All') {
      if (status.toLowerCase() === 'active') {
        query.isActive = { $ne: false };
      } else if (status.toLowerCase() === 'inactive') {
        query.isActive = false;
      }
    }

    if (city && city !== 'all' && city !== 'All') {
      query.city = { $regex: city, $options: 'i' };
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { city: searchRegex },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'name_asc' || sort === 'Name A-Z') {
      sortOptions = { name: 1 };
    } else if (sort === 'name_desc' || sort === 'Name Z-A') {
      sortOptions = { name: -1 };
    }

    const hospitals = await User.find(query)
      .select('-password')
      .sort(sortOptions);

    const hospitalList = await Promise.all(
      hospitals.map(async (h) => {
        const hObj = h.toObject();
        const totalBloodRequests = await BloodRequest.countDocuments({ requester: h._id });
        const pendingRequests = await BloodRequest.countDocuments({ requester: h._id, status: 'pending' });
        const fulfilledRequests = await BloodRequest.countDocuments({ requester: h._id, status: 'fulfilled' });
        
        hObj.totalBloodRequests = totalBloodRequests;
        hObj.pendingRequests = pendingRequests;
        hObj.fulfilledRequests = fulfilledRequests;

        return hObj;
      })
    );

    return res.status(200).json({
      success: true,
      count: hospitalList.length,
      hospitals: hospitalList,
      data: hospitalList,
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to load hospital profiles. Please try again.',
    });
  }
};

/**
 * @desc    Get hospital profile by ID with full blood request metrics
 * @route   GET /api/admin/hospitals/:id
 * @access  Private (Admin)
 */
const getHospitalById = async (req, res) => {
  try {
    const hospital = await User.findOne({ _id: req.params.id, role: 'hospital' }).select('-password');

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital account not found.',
      });
    }

    const totalBloodRequests = await BloodRequest.countDocuments({ requester: hospital._id });
    const pendingRequests = await BloodRequest.countDocuments({ requester: hospital._id, status: 'pending' });
    const approvedRequests = await BloodRequest.countDocuments({ requester: hospital._id, status: 'approved' });
    const fulfilledRequests = await BloodRequest.countDocuments({ requester: hospital._id, status: 'fulfilled' });
    const cancelledRequests = await BloodRequest.countDocuments({ requester: hospital._id, status: 'cancelled' });

    const hospitalObj = hospital.toObject();
    hospitalObj.totalBloodRequests = totalBloodRequests;
    hospitalObj.pendingRequests = pendingRequests;
    hospitalObj.approvedRequests = approvedRequests;
    hospitalObj.fulfilledRequests = fulfilledRequests;
    hospitalObj.cancelledRequests = cancelledRequests;

    return res.status(200).json({
      success: true,
      hospital: hospitalObj,
      data: hospitalObj,
    });
  } catch (error) {
    console.error('Error fetching hospital by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving hospital profile details.',
    });
  }
};

/**
 * @desc    Update hospital profile information
 * @route   PUT /api/admin/hospitals/:id
 * @access  Private (Admin)
 */
const updateHospital = async (req, res) => {
  try {
    const hospital = await User.findOne({ _id: req.params.id, role: 'hospital' });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital account not found.',
      });
    }

    const {
      name,
      phone,
      city,
      address,
      hospitalLicenseNumber,
      contactPerson,
    } = req.body;

    if (name !== undefined) hospital.name = name;
    if (phone !== undefined) hospital.phone = phone;
    if (city !== undefined) hospital.city = city;
    if (address !== undefined) hospital.address = address;
    if (hospitalLicenseNumber !== undefined) hospital.hospitalLicenseNumber = hospitalLicenseNumber;
    if (contactPerson !== undefined) hospital.contactPerson = contactPerson;

    hospital.role = 'hospital';

    await hospital.save();

    const updatedHospital = await User.findById(hospital._id).select('-password');
    const hospitalObj = updatedHospital.toObject();

    hospitalObj.totalBloodRequests = await BloodRequest.countDocuments({ requester: hospital._id });
    hospitalObj.pendingRequests = await BloodRequest.countDocuments({ requester: hospital._id, status: 'pending' });
    hospitalObj.fulfilledRequests = await BloodRequest.countDocuments({ requester: hospital._id, status: 'fulfilled' });

    return res.status(200).json({
      success: true,
      message: 'Hospital profile updated successfully.',
      hospital: hospitalObj,
      data: hospitalObj,
    });
  } catch (error) {
    console.error('Error updating hospital:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating hospital account.',
    });
  }
};

/**
 * @desc    Activate or deactivate hospital account
 * @route   PATCH /api/admin/hospitals/:id/status
 * @access  Private (Admin)
 */
const updateHospitalStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide isActive boolean status.',
      });
    }

    const hospital = await User.findOne({ _id: req.params.id, role: 'hospital' });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital account not found.',
      });
    }

    hospital.isActive = Boolean(isActive);
    await hospital.save();

    const safeHospital = await User.findById(hospital._id).select('-password');

    return res.status(200).json({
      success: true,
      message: `Hospital account ${hospital.isActive ? 'activated' : 'deactivated'} successfully.`,
      hospital: safeHospital,
      data: safeHospital,
    });
  } catch (error) {
    console.error('Error updating hospital status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error changing hospital status.',
    });
  }
};

/**
 * @desc    Delete hospital account safely
 * @route   DELETE /api/admin/hospitals/:id
 * @access  Private (Admin)
 */
const deleteHospital = async (req, res) => {
  try {
    const hospital = await User.findOne({ _id: req.params.id, role: 'hospital' });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital account not found.',
      });
    }

    await BloodRequest.deleteMany({ requester: hospital._id });
    await Donation.deleteMany({ hospital: hospital._id });

    await User.findByIdAndDelete(hospital._id);

    return res.status(200).json({
      success: true,
      message: 'Hospital profile deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting hospital:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting hospital account.',
    });
  }
};

/**
 * @desc    Get all donations for admin view
 * @route   GET /api/admin/donations
 * @access  Private (Admin)
 */
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({})
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
    console.error('Error fetching all donations:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving donation records.',
    });
  }
};

module.exports = {
  getAdminDashboardStats,
  getDashboardStats: getAdminDashboardStats,
  getUsers,
  getAdmins,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  
  // Donors
  getAllDonors,
  getDonors: getAllDonors,
  getDonorById,
  getDonorDonationHistory,
  updateDonor,
  updateDonorStatus,
  deleteDonor,
  
  // Hospitals
  getAllHospitals,
  getHospitals: getAllHospitals,
  getHospitalById,
  updateHospital,
  updateHospitalStatus,
  deleteHospital,

  // Donations
  getAllDonations,
};
