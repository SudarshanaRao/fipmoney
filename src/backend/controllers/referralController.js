import Referral from '../models/Referral.js';
import User from '../models/User.js';
import KycRequest from '../models/KycRequest.js';
import VaultTransaction from '../models/VaultTransaction.js';

/**
 * Helper to compute AML (Anti-Money Laundering) Risk Score (0-100)
 */
const calculateAmlScore = (status, isKycCompleted, hasGoldPurchase) => {
  if (status === 'FLAGGED_FRAUD' || status === 'Flagged Fraud') return 34;
  if (status === 'REWARD_CREDITED' || status === 'Credited') return 98;
  if (hasGoldPurchase) return 92;
  if (isKycCompleted) return 88;
  return 85; // Default for Joined
};

// @desc    Get all referral records with enriched user & progression details for Admin Panel
// @route   GET /api/referrals/admin/all
// @access  Public / Admin
export const getAdminReferrals = async (req, res) => {
  try {
    // Fetch all referrals sorted by creation time
    let rawReferrals = await Referral.find({}).sort({ createdAt: 1 });

    // Migrate any records missing sequential refId (REF-201, REF-202, ...)
    let needsSave = false;
    for (let i = 0; i < rawReferrals.length; i++) {
      const expectedRefId = `REF-${200 + i + 1}`;
      if (!rawReferrals[i].refId) {
        rawReferrals[i].refId = expectedRefId;
        await Referral.updateOne({ _id: rawReferrals[i]._id }, { $set: { refId: expectedRefId } });
      }
    }

    // Fetch again as lean objects in reverse order (newest first for UI display)
    rawReferrals = await Referral.find({}).sort({ createdAt: -1 }).lean();

    // Map through referrals and enrich with referrer, referee, KYC, and Gold purchase status
    const enrichedReferrals = await Promise.all(
      rawReferrals.map(async (ref, index) => {
        const cleanRefMobile = ref.referrerMobile ? String(ref.referrerMobile).trim() : '';
        const cleanRefereeMobile = ref.refereeMobile ? String(ref.refereeMobile).trim() : '';

        // Find advocate/referrer details
        let referrerUser = await User.findOne({
          $or: [
            { mobileNumber: cleanRefMobile },
            { mobile: cleanRefMobile },
            { referralCode: ref.referralCodeUsed }
          ]
        }).lean();

        // Find new user/referee details
        let refereeUser = await User.findOne({
          $or: [
            { mobileNumber: cleanRefereeMobile },
            { mobile: cleanRefereeMobile }
          ]
        }).lean();

        const referrerName = referrerUser
          ? (referrerUser.fullName || referrerUser.username || `User (${cleanRefMobile})`)
          : `Advocate (${cleanRefMobile || 'N/A'})`;

        const refereeName = refereeUser
          ? (refereeUser.fullName || refereeUser.username || `User (${cleanRefereeMobile})`)
          : `Member (${cleanRefereeMobile || 'N/A'})`;

        // Check KYC Verification status for referee
        const kycRecord = await KycRequest.findOne({
          $or: [
            { phone: cleanRefereeMobile },
            { email: refereeUser?.email },
            { userId: refereeUser?.userId }
          ],
          status: 'Verified'
        }).lean();

        const isKycCompleted = Boolean(kycRecord || refereeUser?.isVerified || refereeUser?.kycStatus === 'Verified');

        // Check Digital Gold Purchase >= ₹250 for referee
        const goldTx = await VaultTransaction.findOne({
          mobileNumber: cleanRefereeMobile,
          type: 'BUY',
          metal: 'GOLD',
          amount: { $gte: 250 },
          status: { $in: ['COMPLETED', 'SUCCESS'] }
        }).lean();

        const hasGoldPurchase = Boolean(goldTx);

        // Calculate progression & status
        let formattedStatus = 'Joined';
        let stepLabel = 'Step 1/3 (KYC Pending)';
        let eligibleForCredit = false;

        if (ref.status === 'REWARD_CREDITED' || ref.status === 'Credited') {
          formattedStatus = 'Credited';
          stepLabel = 'Reward Credited';
          eligibleForCredit = false;
        } else if (ref.status === 'FLAGGED_FRAUD' || ref.status === 'Flagged Fraud') {
          formattedStatus = 'Flagged Fraud';
          stepLabel = 'Flagged Fraud';
          eligibleForCredit = false;
        } else if (isKycCompleted && hasGoldPurchase) {
          formattedStatus = 'Gold Purchased';
          stepLabel = 'Step 3/3 (Eligible for Reward)';
          eligibleForCredit = true; // Enables Credit Button!
        } else if (isKycCompleted) {
          formattedStatus = 'KYC Completed';
          stepLabel = 'Step 2/3 (Gold Purchase Pending)';
          eligibleForCredit = false;
        } else {
          formattedStatus = 'Joined';
          stepLabel = 'Step 1/3 (KYC Pending)';
          eligibleForCredit = false;
        }

        let amlScore = 45;
        if (ref.status === 'FLAGGED_FRAUD' || ref.status === 'Flagged Fraud') {
          amlScore = 34;
        } else if (refereeUser && refereeUser.amlScore !== undefined) {
          amlScore = refereeUser.amlScore;
        } else if (refereeUser && refereeUser.amtScore !== undefined) {
          amlScore = refereeUser.amtScore;
        } else if (referrerUser && referrerUser.amlScore !== undefined) {
          amlScore = referrerUser.amlScore;
        } else if (referrerUser && referrerUser.amtScore !== undefined) {
          amlScore = referrerUser.amtScore;
        }

        return {
          id: ref.refId || `REF-${200 + index + 1}`,
          refId: ref.refId || `REF-${200 + index + 1}`,
          _id: ref._id,
          referrer: referrerName,
          referrerMobile: cleanRefMobile,
          referee: refereeName,
          refereeMobile: cleanRefereeMobile,
          code: ref.referralCodeUsed || 'N/A',
          reward: ref.rewardAmount ? `₹${ref.rewardAmount} Gold` : '₹100 Gold',
          rewardAmount: ref.rewardAmount || 100,
          date: ref.createdAt ? new Date(ref.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          createdAt: ref.createdAt,
          status: formattedStatus,
          stepLabel: stepLabel,
          isKycCompleted: isKycCompleted,
          hasGoldPurchase: hasGoldPurchase,
          eligibleForCredit: eligibleForCredit,
          amlScore: amlScore,
          amtScore: amlScore // Fallback for backwards compatibility
        };
      })
    );

    // If MongoDB collection is empty, check dev_users with referredBy
    if (enrichedReferrals.length === 0) {
      const usersWithReferrals = await User.find({ referredBy: { $exists: true, $ne: '' } }).lean();
      
      const fallbackList = await Promise.all(
        usersWithReferrals.map(async (u, idx) => {
          const referrer = await User.findOne({ referralCode: u.referredBy }).lean();
          const cleanUserMobile = u.mobileNumber || u.mobile || '';

          const kycRecord = await KycRequest.findOne({ phone: cleanUserMobile, status: 'Verified' }).lean();
          const isKycCompleted = Boolean(kycRecord || u.isVerified || u.kycStatus === 'Verified');

          const goldTx = await VaultTransaction.findOne({
            mobileNumber: cleanUserMobile,
            type: 'BUY',
            metal: 'GOLD',
            amount: { $gte: 250 },
            status: { $in: ['COMPLETED', 'SUCCESS'] }
          }).lean();

          const hasGoldPurchase = Boolean(goldTx);
          const eligibleForCredit = isKycCompleted && hasGoldPurchase;

          let status = 'Joined';
          let stepLabel = 'Step 1/3 (KYC Pending)';
          if (isKycCompleted && hasGoldPurchase) {
            status = 'Gold Purchased';
            stepLabel = 'Step 3/3 (Eligible for Reward)';
          } else if (isKycCompleted) {
            status = 'KYC Completed';
            stepLabel = 'Step 2/3 (Gold Purchase Pending)';
          }

          return {
            id: `REF-${200 + idx + 1}`,
            refId: `REF-${200 + idx + 1}`,
            _id: u._id,
            referrer: referrer ? (referrer.fullName || referrer.username) : 'Direct Advocate',
            referrerMobile: referrer ? (referrer.mobileNumber || referrer.mobile) : 'N/A',
            referee: u.fullName || u.username || `User ${cleanUserMobile}`,
            refereeMobile: cleanUserMobile,
            code: u.referredBy,
            reward: '₹100 Gold',
            rewardAmount: 100,
            date: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            createdAt: u.createdAt,
            status: status,
            stepLabel: stepLabel,
            isKycCompleted: isKycCompleted,
            hasGoldPurchase: hasGoldPurchase,
            eligibleForCredit: eligibleForCredit,
            amlScore: u.amlScore !== undefined ? u.amlScore : (u.amtScore !== undefined ? u.amtScore : (referrer?.amlScore || 45)),
            amtScore: u.amlScore !== undefined ? u.amlScore : (u.amtScore !== undefined ? u.amtScore : (referrer?.amlScore || 45))
          };
        })
      );

      return res.status(200).json({
        success: true,
        count: fallbackList.length,
        data: fallbackList
      });
    }

    return res.status(200).json({
      success: true,
      count: enrichedReferrals.length,
      data: enrichedReferrals
    });
  } catch (error) {
    console.error('[referralController] Error fetching admin referrals:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin referrals',
      error: error.message
    });
  }
};

// @desc    Get aggregated referral statistics for Admin Dashboard Cards
// @route   GET /api/referrals/admin/stats
// @access  Public / Admin
export const getAdminReferralStats = async (req, res) => {
  try {
    const totalReferralsCount = await Referral.countDocuments();
    const creditedReferrals = await Referral.find({ status: { $in: ['REWARD_CREDITED', 'Credited'] } }).lean();
    
    // Total bonus distributed
    const totalRewardSum = creditedReferrals.reduce((sum, item) => sum + (item.rewardAmount || 100), 0);
    
    // Distinct advocates
    const distinctReferrers = await Referral.distinct('referrerMobile');
    
    // Flagged fraud count
    const flaggedFraudCount = await Referral.countDocuments({ status: { $in: ['FLAGGED_FRAUD', 'Flagged Fraud'] } });

    // Conversion rate
    const convertedCount = creditedReferrals.length;
    const conversionRate = totalReferralsCount > 0 
      ? ((convertedCount / totalReferralsCount) * 100).toFixed(1) + '%'
      : '0.0%';

    // Format bonus distributed text (e.g., ₹4.85 Lakhs or ₹1,200)
    let formattedBonusStr = `₹${totalRewardSum.toLocaleString('en-IN')}`;
    if (totalRewardSum >= 100000) {
      formattedBonusStr = `₹${(totalRewardSum / 100000).toFixed(2)} Lakhs`;
    }

    return res.status(200).json({
      success: true,
      data: {
        totalBonusDistributed: formattedBonusStr,
        totalBonusNumeric: totalRewardSum,
        totalActiveAdvocates: `${distinctReferrers.length} Users`,
        activeAdvocatesCount: distinctReferrers.length,
        conversionRate: conversionRate,
        totalReferrals: totalReferralsCount,
        flaggedFraudCount: flaggedFraudCount
      }
    });
  } catch (error) {
    console.error('[referralController] Error fetching admin referral stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate referral statistics',
      error: error.message
    });
  }
};

// @desc    Update status of a referral entry
// @route   PUT /api/referrals/admin/update-status
// @access  Public / Admin
export const updateAdminReferralStatus = async (req, res) => {
  try {
    const { id, status, rewardAmount } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide referral id and new status'
      });
    }

    // Try finding by _id first, or refId / id / referralCodeUsed
    let referral = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      referral = await Referral.findById(id);
    }
    if (!referral) {
      referral = await Referral.findOne({ $or: [{ refId: id }, { id: id }, { referralCodeUsed: id }] });
    }

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: `Referral record with ID ${id} not found`
      });
    }

    referral.status = status;
    if (rewardAmount !== undefined) {
      referral.rewardAmount = rewardAmount;
    } else if (status === 'Credited' || status === 'REWARD_CREDITED') {
      if (!referral.rewardAmount) referral.rewardAmount = 100;
    }

    await referral.save();

    return res.status(200).json({
      success: true,
      message: `Referral status updated to '${status}'`,
      data: referral
    });
  } catch (error) {
    console.error('[referralController] Error updating referral status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update referral status',
      error: error.message
    });
  }
};

// @desc    Delete a referral record
// @route   DELETE /api/referrals/admin/:id
// @access  Public / Admin
export const deleteAdminReferral = async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Referral.findByIdAndDelete(id);
    } else {
      deleted = await Referral.findOneAndDelete({ $or: [{ refId: id }, { id: id }, { referralCodeUsed: id }] });
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Referral entry not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Referral record successfully deleted'
    });
  } catch (error) {
    console.error('[referralController] Error deleting referral:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete referral record',
      error: error.message
    });
  }
};

// @desc    Create a new referral record manually by Admin
// @route   POST /api/referrals/admin/create
// @access  Public / Admin
export const createAdminReferral = async (req, res) => {
  try {
    const { referrerMobile, refereeMobile, referralCodeUsed, rewardAmount, status } = req.body;

    if (!referrerMobile || !refereeMobile || !referralCodeUsed) {
      return res.status(400).json({
        success: false,
        message: 'Please provide referrerMobile, refereeMobile, and referralCodeUsed'
      });
    }

    const count = await Referral.countDocuments();
    const nextRefId = `REF-${200 + count + 1}`;

    const newReferral = await Referral.create({
      refId: nextRefId,
      referrerMobile: String(referrerMobile).trim(),
      refereeMobile: String(refereeMobile).trim(),
      referralCodeUsed: String(referralCodeUsed).trim().toUpperCase(),
      rewardAmount: rewardAmount || 100,
      status: status || 'JOINED'
    });

    return res.status(201).json({
      success: true,
      message: 'Referral record created successfully',
      data: newReferral
    });
  } catch (error) {
    console.error('[referralController] Error creating admin referral:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create referral record',
      error: error.message
    });
  }
};
