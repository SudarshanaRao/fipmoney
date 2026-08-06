import mongoose from 'mongoose';
import crypto from 'crypto';

const vaultTransactionSchema = new mongoose.Schema(
  {
    txId: {
      type: String,
      required: true,
      unique: true,
      default: () => 'FIP' + Math.floor(100000 + Math.random() * 900000),
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['BUY', 'SELL', 'REFERRAL_BONUS'],
      required: true,
    },
    metal: {
      type: String,
      enum: ['GOLD', 'SILVER'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    grams: {
      type: Number,
      required: true,
    },
    ratePerGram: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'FAILED', 'PENDING'],
      default: 'COMPLETED',
    },
    paymentMethod: {
      type: String,
      default: 'UPI',
    },
    source: {
      type: String,
      default: 'Digital Vault',
    },
  },
  {
    timestamps: true,
    collection: 'dev_vault_transactions',
  }
);

const VaultTransaction = mongoose.model('VaultTransaction', vaultTransactionSchema);

export default VaultTransaction;
