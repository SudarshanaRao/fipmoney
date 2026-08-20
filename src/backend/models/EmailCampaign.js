import mongoose from 'mongoose';

const emailCampaignSchema = new mongoose.Schema(
  {
    campaignId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Campaign subject is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Marketing',
      trim: true,
    },
    fromEmail: {
      type: String,
      default: 'info@fipmoney.com',
      trim: true,
    },
    htmlContent: {
      type: String,
      required: [true, 'Campaign HTML content is required'],
    },
    targetAudience: {
      type: String,
      enum: ['ALL_USERS', 'KYC_VERIFIED', 'DGA_AGENTS', 'SPECIFIC_USERS'],
      default: 'ALL_USERS',
    },
    targetEmails: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['DRAFT', 'SENDING', 'SENT', 'FAILED', 'CANCELLED'],
      default: 'DRAFT',
    },
    stats: {
      totalRecipients: { type: Number, default: 0 },
      sentCount: { type: Number, default: 0 },
      failedCount: { type: Number, default: 0 },
    },
    sentAt: {
      type: Date,
      default: null,
    },
    sentBy: {
      type: String,
      default: 'ADMIN',
    },
    zohoCampaignId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const EmailCampaign = mongoose.models.EmailCampaign || mongoose.model('EmailCampaign', emailCampaignSchema);

export default EmailCampaign;
