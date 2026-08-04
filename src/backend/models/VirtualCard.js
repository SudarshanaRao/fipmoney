import mongoose from 'mongoose';

const virtualCardSchema = new mongoose.Schema(
  {
    vid: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
      default: '',
    },
    cardHash: {
      type: String,
      default: '',
    },
    detailsHash: {
      type: String,
      default: '',
    },
    expiry: {
      type: String,
      default: '',
    },
    nameOnCard: {
      type: String,
      default: '',
    },
    cvv: {
      type: String,
      default: '',
    },
    balance: {
      type: Number,
      default: 0,
    },
    isGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const VirtualCard = mongoose.model('VirtualCard', virtualCardSchema);

export default VirtualCard;
