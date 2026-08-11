import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    sparse: true,
    index: true,
  },
  email: {
    type: String,
    sparse: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Document will be automatically deleted after 10 minutes
  }
});

const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);

export default Otp;
