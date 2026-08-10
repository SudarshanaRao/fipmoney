import express from 'express';
import AgentWaitlist from '../models/AgentWaitlist.js';

const router = express.Router();

// @desc    Register new Digital Gold Agent for waitlist
// @route   POST /api/agent-waitlist
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { username, mobile, email, city, language } = req.body;

    if (!username || !mobile || !email || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: username, mobile, email, city',
      });
    }

    // Check if user already registered with mobile or email
    const existingAgent = await AgentWaitlist.findOne({
      $or: [{ mobile }, { email }],
    });

    if (existingAgent) {
      return res.status(200).json({
        success: true,
        alreadyRegistered: true,
        waitlistNumber: existingAgent.waitlistNumber,
        data: existingAgent,
        message: `You are already registered on the DGA waitlist at position #${existingAgent.waitlistNumber}!`,
      });
    }

    const count = await AgentWaitlist.countDocuments();
    const assignedWaitlistNumber = 1048 + count;

    const newWaitlistEntry = await AgentWaitlist.create({
      username,
      mobile,
      email,
      city,
      language: language || 'English',
      waitlistNumber: assignedWaitlistNumber,
    });

    res.status(201).json({
      success: true,
      alreadyRegistered: false,
      waitlistNumber: newWaitlistEntry.waitlistNumber,
      data: newWaitlistEntry,
      message: `Congratulations! You joined the Digital Gold Agent Beta Waitlist at position #${newWaitlistEntry.waitlistNumber}!`,
    });
  } catch (error) {
    console.error('[AgentWaitlist API Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error registering waitlist entry',
      error: error.message,
    });
  }
});

// @desc    Get waitlist statistics
// @route   GET /api/agent-waitlist/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const count = await AgentWaitlist.countDocuments();
    res.status(200).json({
      success: true,
      totalWaitlist: 1047 + count,
      registeredCount: count,
      nextWaitlistNumber: 1048 + count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
