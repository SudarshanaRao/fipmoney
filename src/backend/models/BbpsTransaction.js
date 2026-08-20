import mongoose from 'mongoose';

const bbpsTransactionSchema = new mongoose.Schema(
  {
    txnId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    billerName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Mobile Recharge',
        'Electricity',
        'DTH',
        'LPG Gas',
        'Fastag',
        'Water Bill',
        'Broadband',
        'Credit Card Bill',
        'Piped Gas',
      ],
      default: 'Mobile Recharge',
    },
    accountNumber: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    goldCashbackEarned: {
      type: Number,
      default: 0,
    },
    goldCashbackFormatted: {
      type: String,
      default: '0.000 g',
    },
    paymentGateway: {
      type: String,
      default: 'Setu BBPS NPCI',
    },
    bbpsRefNo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Success', 'Pending', 'Failed', 'Refunded'],
      default: 'Success',
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const BbpsTransaction = mongoose.models.BbpsTransaction || mongoose.model('BbpsTransaction', bbpsTransactionSchema);

export default BbpsTransaction;
