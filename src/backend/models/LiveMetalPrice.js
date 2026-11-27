import mongoose from 'mongoose';

const liveMetalPriceSchema = new mongoose.Schema(
  {
    goldPrice: {
      type: Number,
      required: true,
      default: 11200.00,
    },
    silverPrice: {
      type: Number,
      required: true,
      default: 115.00,
    },
    updatedBy: {
      type: String,
      default: 'Super Admin',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const LiveMetalPrice = mongoose.model('LiveMetalPrice', liveMetalPriceSchema);
export default LiveMetalPrice;
