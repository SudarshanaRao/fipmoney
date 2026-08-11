import mongoose from 'mongoose';

const kycRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    documentType: {
      type: String,
      default: 'Aadhaar + PAN',
    },
    aadhaarNo: {
      type: String,
      trim: true,
    },
    panNo: {
      type: String,
      trim: true,
    },
    matchScore: {
      type: String,
      default: '98%',
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const KycRequest = mongoose.model('KycRequest', kycRequestSchema);

export default KycRequest;
