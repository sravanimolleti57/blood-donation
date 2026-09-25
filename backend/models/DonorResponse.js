const mongoose = require('mongoose');

const donorResponseSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      required: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required for eligibility check'],
      min: [18, 'Donor must be at least 18 years of age'],
      max: [65, 'Donor age cannot exceed 65 years'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required for eligibility check'],
      min: [45, 'Donor weight must be at least 45 kg'],
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    monthsSinceLastDonation: {
      type: Number,
      default: null,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    healthDeclaration: {
      type: Boolean,
      required: [true, 'Health declaration is required'],
      default: true,
    },
    additionalNotes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'approved', 'rejected', 'responded'],
      default: 'responded',
    },
    eligibilityStatus: {
      type: String,
      enum: ['pending', 'eligible', 'not_eligible', 'responded'],
      default: 'responded',
    },
    adminNotes: {
      type: String,
      trim: true,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index to prevent duplicate responses for the same request by the same donor
donorResponseSchema.index({ request: 1, donor: 1 }, { unique: true });

module.exports = mongoose.model('DonorResponse', donorResponseSchema);
