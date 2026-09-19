const mongoose = require('mongoose');

const bloodResponseSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    respondedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
    verificationDetails: {
      lastDonationDate: {
        type: Date,
      },
      totalDonations: {
        type: Number,
        default: 0,
      },
      eligibleSixMonths: {
        type: Boolean,
        default: true,
      },
      daysSinceLastDonation: {
        type: Number,
        default: null,
      },
      bloodGroupMatch: {
        type: Boolean,
        default: true,
      },
      availabilityMatch: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const bloodRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    unitsRequired: {
      type: Number,
      required: [true, 'Units required is mandatory'],
      min: [1, 'At least 1 unit must be requested'],
      default: 1,
    },
    fulfilledUnits: {
      type: Number,
      default: 0,
    },
    urgency: {
      type: String,
      enum: ['normal', 'urgent', 'critical'],
      default: 'normal',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    hospitalAddress: {
      type: String,
      required: [true, 'Hospital address is required'],
      trim: true,
    },
    requiredDate: {
      type: Date,
      required: [true, 'Required date is mandatory'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    responses: [bloodResponseSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
