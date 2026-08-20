import mongoose from 'mongoose';

const sipPlanSchema = new mongoose.Schema(
  {
    planId: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    minAmount: {
      type: Number,
      required: true,
      default: 10,
    },
    category: {
      type: String,
      required: true,
      default: 'Daily Micro-SIP',
    },
    activeUsers: {
      type: Number,
      default: 0,
    },
    totalInvested: {
      type: String,
      default: '₹0',
    },
    goldGram: {
      type: String,
      default: '0.000 g',
    },
    returnsRate: {
      type: String,
      default: '8.5%',
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Inactive'],
      default: 'Active',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const SipPlan = mongoose.models.SipPlan || mongoose.model('SipPlan', sipPlanSchema);

export default SipPlan;
