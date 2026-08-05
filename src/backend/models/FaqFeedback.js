import mongoose from 'mongoose';

const faqFeedbackSchema = new mongoose.Schema({
  faqId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ['like', 'dislike', 'none'],
    required: true,
  }
}, {
  timestamps: true,
});

// Ensure a user can only have one feedback record per FAQ
faqFeedbackSchema.index({ faqId: 1, userId: 1 }, { unique: true });

const FaqFeedback = mongoose.model('FaqFeedback', faqFeedbackSchema);
export default FaqFeedback;
