import express from 'express';
import FaqFeedback from '../models/FaqFeedback.js';

const router = express.Router();

// POST /api/faqs/feedback
// Submit or update a user's feedback for a specific FAQ
router.post('/feedback', async (req, res) => {
  try {
    const { faqId, userId, action } = req.body;
    
    if (!faqId || !userId || !['like', 'dislike', 'none'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid data provided' });
    }

    // Upsert the feedback document
    const feedback = await FaqFeedback.findOneAndUpdate(
      { faqId, userId },
      { action },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error('Error submitting FAQ feedback:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// GET /api/faqs/feedback?userId=<userId>
// Get aggregated feedback counts for all FAQs and the current user's specific actions
router.get('/feedback', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Aggregate likes and dislikes per faqId
    const counts = await FaqFeedback.aggregate([
      {
        $group: {
          _id: '$faqId',
          likes: { $sum: { $cond: [{ $eq: ['$action', 'like'] }, 1, 0] } },
          dislikes: { $sum: { $cond: [{ $eq: ['$action', 'dislike'] }, 1, 0] } }
        }
      }
    ]);

    // Format counts mapping for the client
    const stats = {};
    counts.forEach(item => {
      stats[item._id] = {
        likes: item.likes,
        dislikes: item.dislikes
      };
    });

    // If userId is provided, get the user's current selections
    let userSelections = {};
    if (userId) {
      const userFeedback = await FaqFeedback.find({ userId });
      userFeedback.forEach(item => {
        userSelections[item.faqId] = item.action;
      });
    }

    res.status(200).json({ success: true, stats, userSelections });
  } catch (error) {
    console.error('Error fetching FAQ feedback:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;
