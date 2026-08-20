import mongoose from 'mongoose';

const agentWaitlistSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
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
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    isAddressVerified: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      required: true,
      default: 'English',
    },
    waitlistNumber: {
      type: Number,
      unique: true,
    },
    formattedWaitlistNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'contacted'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-assign waitlistNumber starting from 1 before saving in DGA0001 format
agentWaitlistSchema.pre('save', async function (next) {
  if (!this.waitlistNumber) {
    const count = await mongoose.model('AgentWaitlist').countDocuments();
    this.waitlistNumber = 1 + count;
  }
  const padded = String(this.waitlistNumber).padStart(4, '0');
  this.formattedWaitlistNumber = `DGA${padded}`;
  next();
});

const AgentWaitlist = mongoose.model('AgentWaitlist', agentWaitlistSchema);

export default AgentWaitlist;
