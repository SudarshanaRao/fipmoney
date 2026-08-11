import mongoose from 'mongoose';

const emailTemplateSchema = new mongoose.Schema(
  {
    templateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    template_id: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Template subject is required'],
      trim: true,
    },
    htmlContent: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'CUSTOM',
      trim: true,
    },
    variables: [
      {
        type: String,
      },
    ],
    msg91_template_id: {
      type: String,
      default: null,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      default: 'ADMIN',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure templateId and body/htmlContent stay synced
emailTemplateSchema.pre('save', function (next) {
  if (!this.template_id && this.templateId) {
    this.template_id = this.templateId;
  } else if (!this.templateId && this.template_id) {
    this.templateId = this.template_id;
  }
  if (!this.htmlContent && this.body) {
    this.htmlContent = this.body;
  } else if (!this.body && this.htmlContent) {
    this.body = this.htmlContent;
  }
  next();
});

const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model('EmailTemplate', emailTemplateSchema);

export default EmailTemplate;
