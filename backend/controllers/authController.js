const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Regex patterns
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

/**
 * @desc    Register a new user (donor or hospital)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'donor',
      bloodGroup,
      dateOfBirth,
      gender,
      city,
      address,
      hospitalLicenseNumber,
      contactPerson,
    } = req.body;

    // Reject ADMIN registration attempts via public route
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin account creation is restricted and cannot be completed via public registration.',
      });
    }

    // Required fields check
    if (!name || !email || !phone || !password || !city || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Name, Email, Phone, Password, City, Address).',
      });
    }

    // Email validation
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Phone validation
    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      });
    }

    // Password validation
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (e.g. Password123!).',
      });
    }

    // Donor-specific check
    if (role === 'donor' && !bloodGroup) {
      return res.status(400).json({
        success: false,
        message: 'Blood group selection is required for donor registration.',
      });
    }

    // Check duplicate email
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role,
      bloodGroup: role === 'donor' ? bloodGroup : '',
      dateOfBirth: dateOfBirth || '',
      gender: gender || '',
      city,
      address,
      hospitalLicenseNumber: role === 'hospital' ? hospitalLicenseNumber : '',
      contactPerson: role === 'hospital' ? contactPerson : '',
      available: true,
      isActive: true,
      verified: role !== 'hospital', // Hospitals require admin verification
      lastLoginAt: new Date(),
    });

    if (user) {
      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        success: true,
        message: role === 'hospital' 
          ? 'Hospital registered successfully! Account pending admin verification.' 
          : 'Registration successful! Welcome to BloodConnect.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          bloodGroup: user.bloodGroup,
          city: user.city,
          address: user.address,
          available: user.available,
          availability: user.available,
          isActive: user.isActive,
          verified: user.verified,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data provided.',
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);

    // Handle Mongo Duplicate Key Error (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || 'email';
      return res.status(409).json({
        success: false,
        message: `An account with this ${field} already exists.`,
      });
    }

    // Handle Mongoose Validation Error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors || {}).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ') || 'Validation error during registration.',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Find user & include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check account status
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact the administrator.',
      });
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        bloodGroup: user.bloodGroup,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        city: user.city,
        address: user.address,
        available: user.available,
        availability: user.available,
        isActive: user.isActive,
        verified: user.verified,
        profileImage: user.profileImage,
        contactPerson: user.contactPerson,
        hospitalLicenseNumber: user.hospitalLicenseNumber,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

/**
 * @desc    Authenticate admin & get token
 * @route   POST /api/auth/admin/login
 * @access  Public (Admin only credential check)
 */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both admin email and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user || user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.',
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact the administrator.',
      });
    }

    const isMatch = await user.matchPassword(cleanPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.',
      });
    }

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during admin login.',
    });
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        bloodGroup: user.bloodGroup,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        city: user.city,
        address: user.address,
        available: user.available,
        availability: user.available,
        isActive: user.isActive,
        verified: user.verified,
        profileImage: user.profileImage,
        contactPerson: user.contactPerson,
        hospitalLicenseNumber: user.hospitalLicenseNumber,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving current user profile.',
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Public / Private
 */
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * @desc    Initiate password reset request
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email address.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'If the email exists, password reset instructions will be sent.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error processing password reset request.',
    });
  }
};

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Password reset completed.',
  });
};

module.exports = {
  register,
  login,
  adminLogin,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};
