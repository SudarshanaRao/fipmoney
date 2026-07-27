import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    collection: 'dev_users', // Stores in dev table / collection
  }
);

const User = mongoose.model('User', userSchema);

export default User;
