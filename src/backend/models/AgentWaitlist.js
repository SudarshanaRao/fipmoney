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
    language: {
      type: String,
      required: true,
      default: 'English',
    },
    waitlistNumber: {
      type: Number,
      unique: true,
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

// Auto-assign waitlistNumber starting from 1048 before saving
agentWaitlistSchema.pre('save', async function (next) {
  if (!this.waitlistNumber) {
    const count = await mongoose.model('AgentWaitlist').countDocuments();
    this.waitlistNumber = 1048 + count;
  }
  next();
});

const AgentWaitlist = mongoose.model('AgentWaitlist', agentWaitlistSchema);

export default AgentWaitlist;
