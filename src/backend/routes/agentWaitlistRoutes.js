import express from 'express';
import AgentWaitlist from '../models/AgentWaitlist.js';
import Otp from '../models/Otp.js';

const router = express.Router();

const formatWaitlistNumber = (num) => {
  if (!num) return 'DGA0001';
  const parsed = typeof num === 'number' ? num : parseInt(String(num).replace(/\D/g, ''), 10);
  if (isNaN(parsed) || parsed < 1) return 'DGA0001';
  return `DGA${String(parsed).padStart(4, '0')}`;
};

// Re-index remaining pending waitlist applicants after an approval or removal
export const reindexPendingWaitlist = async () => {
  try {
    const pendingList = await AgentWaitlist.find({
      status: { $nin: ['approved', 'APPROVED'] }
    }).sort({ createdAt: 1, _id: 1 });

    for (let i = 0; i < pendingList.length; i++) {
      const newNum = i + 1;
      const formatted = formatWaitlistNumber(newNum);
      if (pendingList[i].waitlistNumber !== newNum || pendingList[i].formattedWaitlistNumber !== formatted) {
        pendingList[i].waitlistNumber = newNum;
        pendingList[i].formattedWaitlistNumber = formatted;
        await pendingList[i].save();
      }
    }
  } catch (err) {
    console.error('[ReindexPendingWaitlist Error]:', err.message);
  }
};

// @desc    Check if user is already registered on waitlist
// @route   GET /api/agent-waitlist/check
// @access  Public
router.get('/check', async (req, res) => {
  try {
    const { mobile, email } = req.query;
    if (!mobile && !email) {
      return res.status(400).json({ success: false, message: 'Please provide mobile or email' });
    }

    const query = [];
    if (mobile) query.push({ mobile });
    if (email) query.push({ email });

    const existingAgent = await AgentWaitlist.findOne({ $or: query });

    if (existingAgent) {
      const isApproved = existingAgent.status === 'approved' || existingAgent.status === 'APPROVED';
      const formattedNumber = isApproved ? 'APPROVED' : (existingAgent.formattedWaitlistNumber || formatWaitlistNumber(existingAgent.waitlistNumber));
      return res.status(200).json({
        success: true,
        alreadyRegistered: true,
        isApproved,
        status: existingAgent.status || 'pending',
        waitlistNumber: existingAgent.waitlistNumber,
        formattedWaitlistNumber: formattedNumber,
        data: existingAgent,
      });
    }

    return res.status(200).json({
      success: true,
      alreadyRegistered: false,
      isApproved: false,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Register new Digital Gold Agent for waitlist (One chance per user)
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

    // Check if user already registered with mobile or email (Single chance per user)
    const existingAgent = await AgentWaitlist.findOne({
      $or: [{ mobile }, { email }],
    });

    if (existingAgent) {
      const formattedNumber = existingAgent.formattedWaitlistNumber || formatWaitlistNumber(existingAgent.waitlistNumber);
      return res.status(200).json({
        success: true,
        alreadyRegistered: true,
        waitlistNumber: existingAgent.waitlistNumber,
        formattedWaitlistNumber: formattedNumber,
        data: existingAgent,
        message: `You are already registered on the DGA waitlist! Your assigned number is ${formattedNumber}.`,
      });
    }

    const pendingCount = await AgentWaitlist.countDocuments({ status: { $nin: ['approved', 'APPROVED'] } });
    const assignedWaitlistNumber = 1 + pendingCount;
    const formattedNumber = formatWaitlistNumber(assignedWaitlistNumber);

    const newWaitlistEntry = await AgentWaitlist.create({
      username,
      mobile,
      email,
      city,
      language: language || 'English',
      waitlistNumber: assignedWaitlistNumber,
      formattedWaitlistNumber: formattedNumber,
    });

    res.status(201).json({
      success: true,
      alreadyRegistered: false,
      waitlistNumber: newWaitlistEntry.waitlistNumber,
      formattedWaitlistNumber: newWaitlistEntry.formattedWaitlistNumber || formattedNumber,
      data: newWaitlistEntry,
      message: `Congratulations! You joined the Digital Gold Agent Beta Waitlist with number ${formattedNumber}!`,
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
    const pendingCount = await AgentWaitlist.countDocuments({ status: { $nin: ['approved', 'APPROVED'] } });
    res.status(200).json({
      success: true,
      totalWaitlist: pendingCount,
      registeredCount: pendingCount,
      nextWaitlistNumber: pendingCount + 1,
      nextFormattedWaitlistNumber: formatWaitlistNumber(pendingCount + 1),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all DGA Waitlist entries for Admin Dashboard
// @route   GET /api/agent-waitlist/admin/all
// @access  Admin
router.get('/admin/all', async (req, res) => {
  try {
    const list = await AgentWaitlist.find({}).sort({ waitlistNumber: 1, createdAt: 1 });
    const formattedList = list.map(item => ({
      _id: item._id,
      id: item._id,
      username: item.username,
      mobile: item.mobile,
      email: item.email,
      city: item.city,
      language: item.language,
      waitlistNumber: item.waitlistNumber,
      formattedWaitlistNumber: (item.status === 'approved' || item.status === 'APPROVED') ? 'APPROVED' : (item.formattedWaitlistNumber || formatWaitlistNumber(item.waitlistNumber)),
      status: item.status || 'pending',
      createdAt: item.createdAt,
    }));
    res.status(200).json({
      success: true,
      data: formattedList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Admin Single-Action Update Status (approve, reject, contacted, pending)
// @route   PUT /api/agent-waitlist/admin/update-status
// @access  Admin
router.put('/admin/update-status', async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, message: 'Please provide entry id and status' });
    }

    const updated = await AgentWaitlist.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Waitlist entry not found' });
    }

    // Forward the queue: re-index remaining pending waitlist applicants
    await reindexPendingWaitlist();

    res.status(200).json({
      success: true,
      message: `Waitlist entry updated to '${status}' successfully! Queue forwarded for remaining applicants.`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Admin Single Action Bulk Update Status
// @route   PUT /api/agent-waitlist/admin/bulk-update-status
// @access  Admin
router.put('/admin/bulk-update-status', async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!ids || !Array.isArray(ids) || !status) {
      return res.status(400).json({ success: false, message: 'Please provide ids array and status' });
    }

    await AgentWaitlist.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );

    // Forward the queue: re-index remaining pending waitlist applicants
    await reindexPendingWaitlist();

    res.status(200).json({
      success: true,
      message: `Successfully updated ${ids.length} waitlist entries to '${status}'! Queue forwarded for remaining applicants.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Admin Single Action Delete Entry
// @route   DELETE /api/agent-waitlist/admin/:id
// @access  Admin
router.delete('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await AgentWaitlist.findByIdAndDelete(id);
    await reindexPendingWaitlist();
    res.status(200).json({
      success: true,
      message: 'Waitlist entry removed successfully! Queue forwarded for remaining applicants.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Send OTP to Digital Gold Agent registered mobile number
// @route   POST /api/agent-waitlist/send-otp
// @access  Public
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    const cleanMobile = String(mobile).replace(/\D/g, '').slice(-10);
    if (!cleanMobile || cleanMobile.length !== 10) {
      return res.status(400).json({ success: false, message: 'Invalid 10-digit mobile number' });
    }

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Upsert in Otp model
    await Otp.findOneAndUpdate(
      { mobileNumber: cleanMobile },
      { otp: generatedOtp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send SMS via SMSCountry DLT Template 1277178696497004597 & Sender ID FIPMNY
    await sendAgentSmsOtp(cleanMobile, generatedOtp);

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to registered mobile number +91 ${cleanMobile}`,
    });
  } catch (error) {
    console.error('[DGA Send OTP Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Verify OTP for Digital Gold Agent
// @route   POST /api/agent-waitlist/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: 'Mobile number and OTP are required' });
    }

    const cleanMobile = String(mobile).replace(/\D/g, '').slice(-10);
    const cleanOtp = String(otp).trim();

    const otpRecord = await Otp.findOne({ mobileNumber: cleanMobile });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Please request a new OTP.' });
    }

    if (otpRecord.otp !== cleanOtp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP entered. Please check and try again.' });
    }

    // Delete verified OTP record
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      success: true,
      message: 'Agent OTP verified successfully.',
    });
  } catch (error) {
    console.error('[DGA Verify OTP Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

async function sendAgentSmsOtp(mobile, otpCode) {
  const authKey = process.env.SMSCOUNTRY_AUTH_KEY;
  const authToken = process.env.SMSCOUNTRY_AUTH_TOKEN;
  const senderId = process.env.SMSCOUNTRY_SENDER_ID || "FIPMNY";
  const templateId = "1277178696497004597";
  
  const messageText = `Dear Digital Gold Agent, Your Fipmoney login OTP is ${otpCode} . Valid for 10 minutes. Never share this OTP with anyone. - Finpages Tech`;

  if (!authKey || !authToken) {
    console.log(`[DGA SMS OTP Mock Fallback - No Credentials] Digital Gold Agent OTP for ${mobile} is ${otpCode}`);
    return;
  }

  const credentials = Buffer.from(`${authKey}:${authToken}`).toString('base64');
  const endpoint = `https://restapi.smscountry.com/v0.1/Accounts/${authKey}/SMSes/`;

  const payload = {
    Text: messageText,
    Number: `91${mobile}`,
    SenderId: senderId,
    Tool: "API",
    TemplateId: templateId,
    DLT_TE_ID: templateId
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log(`[SMSCountry DGA OTP] Send response for ${mobile}:`, result);
  } catch (err) {
    console.error(`[SMSCountry DGA OTP Error] Failed to send SMS to ${mobile}:`, err.message);
  }
}

export default router;
