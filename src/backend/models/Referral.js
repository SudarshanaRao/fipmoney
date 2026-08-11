import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema(
  {
    refId: {
      type: String,
      unique: true,
      sparse: true,
    },
    referrerMobile: {
      type: String,
      required: true,
      index: true,
    },
    refereeMobile: {
      type: String,
      required: true,
      unique: true, // A user can only be referred once
    },
    referralCodeUsed: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['JOINED', 'KYC_COMPLETED', 'GOLD_PURCHASED', 'REWARD_CREDITED', 'FLAGGED_FRAUD', 'Flagged Fraud', 'Credited', 'Joined', 'KYC Completed', 'Gold Purchased'],
      default: 'JOINED',
    },
    rewardAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'referrals',
  }
);

const Referral = mongoose.model('Referral', referralSchema);

export default Referral;
