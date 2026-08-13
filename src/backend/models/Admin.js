import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide admin name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide admin email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Please provide admin mobile number'],
      unique: true,
      trim: true,
    },
    secretCode: {
      type: String,
      required: [true, 'Please provide 4-digit secret code'],
      trim: true,
      default: '2787',
    },
    password: {
      type: String,
      required: [true, 'Please provide password/PIN'],
    },
    role: {
      type: String,
      enum: ['Super Admin', 'Finance Manager', 'Support Lead', 'Compliance Officer'],
      default: 'Super Admin',
    },
    status: {
      type: String,
      enum: ['Active', 'Pending Approval', 'Suspended'],
      default: 'Active',
    },
    permissions: {
      type: [String],
      default: ['all'],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;
