import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema(
  {
    logId: {
      type: String,
      required: true,
      unique: true,
    },
    toEmail: {
      type: String,
      required: true,
    },
    templateId: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    variables: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      enum: ['SENT', 'FAILED', 'MOCK_DELIVERED'],
      default: 'SENT',
    },
    error: {
      type: String,
      default: '',
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const EmailLog = mongoose.models.EmailLog || mongoose.model('EmailLog', emailLogSchema);

export default EmailLog;
