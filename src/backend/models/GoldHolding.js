import mongoose from 'mongoose';

const goldHoldingSchema = new mongoose.Schema(
  {
    auditRefId: {
      type: String,
      required: true,
      unique: true,
    },
    vaultLocation: {
      type: String,
      required: true,
      trim: true,
    },
    custodian: {
      type: String,
      required: true,
      trim: true,
    },
    movementType: {
      type: String,
      required: true,
    },
    weightKg: {
      type: Number,
      required: true,
    },
    weightFormatted: {
      type: String,
      required: true,
    },
    purityCert: {
      type: String,
      required: true,
    },
    auditStatus: {
      type: String,
      enum: ['Verified & Insured', 'Audited & Verified', 'Dispatched to Doorstep', 'Pending Verification'],
      default: 'Verified & Insured',
    },
  },
  {
    timestamps: true,
    collection: 'goldholdings',
  }
);

const GoldHolding = mongoose.model('GoldHolding', goldHoldingSchema);

export default GoldHolding;
