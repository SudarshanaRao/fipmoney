import express from 'express';
import KycRequest from '../models/KycRequest.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    User initiates & submits KYC Verification Request
// @route   POST /api/kyc/submit
// @access  Public / User
router.post('/submit', async (req, res) => {
  try {
    const { userId, userName, phone, email, documentType, aadhaarNo, panNo } = req.body;

    if (!phone && !email && !userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user contact info (phone or email)',
      });
    }

    const effectiveUserId = userId || `USR-${phone || Date.now()}`;
    const effectiveName = userName || 'Valued User';
    const effectivePhone = phone || '';
    const effectiveEmail = email || '';

    // Check if there is an existing KYC request for this user
    let existingKyc = await KycRequest.findOne({
      $or: [
        { userId: effectiveUserId },
        ...(effectivePhone ? [{ phone: effectivePhone }] : []),
        ...(effectiveEmail ? [{ email: effectiveEmail }] : []),
      ],
    });

    if (existingKyc) {
      // Update existing request status to Pending for re-verification
      existingKyc.userName = effectiveName;
      existingKyc.documentType = documentType || existingKyc.documentType || 'Aadhaar + PAN';
      existingKyc.aadhaarNo = aadhaarNo || existingKyc.aadhaarNo;
      existingKyc.panNo = panNo || existingKyc.panNo;
      existingKyc.status = 'Pending';
      existingKyc.rejectionReason = '';
      await existingKyc.save();

      return res.status(200).json({
        success: true,
        message: 'KYC Verification Request submitted successfully! Under review by admin.',
        data: existingKyc,
      });
    }

    // Create new KYC request
    const newKyc = await KycRequest.create({
      userId: effectiveUserId,
      userName: effectiveName,
      phone: effectivePhone,
      email: effectiveEmail,
      documentType: documentType || 'Aadhaar + PAN',
      aadhaarNo: aadhaarNo || 'XXXX-XXXX-9012',
      panNo: panNo || 'ABCDE1234F',
      matchScore: '98%',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'KYC Verification Request initiated and submitted successfully!',
      data: newKyc,
    });
  } catch (error) {
    console.error('[KYC Submit API Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting KYC request',
      error: error.message,
    });
  }
});

// @desc    Get user's current KYC status
// @route   GET /api/kyc/status
// @access  Public / User
router.get('/status', async (req, res) => {
  try {
    const { phone, email, userId } = req.query;

    if (!phone && !email && !userId) {
      return res.status(400).json({ success: false, message: 'Please provide phone, email, or userId' });
    }

    const query = [];
    if (userId) query.push({ userId });
    if (phone) query.push({ phone });
    if (email) query.push({ email });

    const kyc = await KycRequest.findOne({ $or: query });

    if (!kyc) {
      return res.status(200).json({
        success: true,
        status: 'Not Submitted',
        isKycCompleted: false,
      });
    }

    res.status(200).json({
      success: true,
      status: kyc.status,
      isKycCompleted: kyc.status === 'Verified',
      data: kyc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all KYC verification requests for Admin Dashboard
// @route   GET /api/kyc/admin/all
// @access  Admin
router.get('/admin/all', async (req, res) => {
  try {
    const list = await KycRequest.find({}).sort({ createdAt: -1 });

    const formattedList = list.map(item => ({
      _id: item._id,
      id: item._id,
      userId: item.userId,
      userName: item.userName,
      phone: item.phone,
      email: item.email,
      documentType: item.documentType,
      aadhaarNo: item.aadhaarNo,
      panNo: item.panNo,
      matchScore: item.matchScore || '98%',
      submittedDate: item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Today',
      status: item.status || 'Pending',
      rejectionReason: item.rejectionReason || '',
      verifiedAt: item.verifiedAt,
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

// @desc    Admin Single-Action Verify KYC Request
// @route   PUT /api/kyc/admin/verify
// @access  Admin
router.put('/admin/verify', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Please provide request id' });
    }

    const kyc = await KycRequest.findByIdAndUpdate(
      id,
      { status: 'Verified', verifiedAt: new Date(), rejectionReason: '' },
      { new: true }
    );

    if (!kyc) {
      return res.status(404).json({ success: false, message: 'KYC Request not found' });
    }

    // Optionally update user model if user exists
    if (kyc.phone) {
      await User.findOneAndUpdate(
        { phone: kyc.phone.replace(/\D/g, '').slice(-10) },
        { isKycCompleted: true, kycLevel: 'FULL' }
      ).catch(() => {});
    }

    res.status(200).json({
      success: true,
      message: `KYC verification approved successfully for ${kyc.userName}! Status updated to Completed Successfully.`,
      data: kyc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Admin Single-Action Reject KYC Request
// @route   PUT /api/kyc/admin/reject
// @access  Admin
router.put('/admin/reject', async (req, res) => {
  try {
    const { id, reason } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Please provide request id' });
    }

    const kyc = await KycRequest.findByIdAndUpdate(
      id,
      { status: 'Rejected', rejectionReason: reason || 'Document verification failed.' },
      { new: true }
    );

    if (!kyc) {
      return res.status(404).json({ success: false, message: 'KYC Request not found' });
    }

    res.status(200).json({
      success: true,
      message: `KYC request for ${kyc.userName} rejected.`,
      data: kyc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Admin Single-Action Bulk Update KYC Requests
// @route   PUT /api/kyc/admin/bulk-update
// @access  Admin
router.put('/admin/bulk-update', async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!ids || !Array.isArray(ids) || !status) {
      return res.status(400).json({ success: false, message: 'Please provide ids array and status' });
    }

    const updateObj = { status };
    if (status === 'Verified') updateObj.verifiedAt = new Date();

    await KycRequest.updateMany(
      { _id: { $in: ids } },
      { $set: updateObj }
    );

    res.status(200).json({
      success: true,
      message: `Successfully updated ${ids.length} KYC verification requests to '${status}'!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
