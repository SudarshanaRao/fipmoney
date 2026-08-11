import express from 'express';
import {
  getAdminReferrals,
  getAdminReferralStats,
  updateAdminReferralStatus,
  deleteAdminReferral,
  createAdminReferral
} from '../controllers/referralController.js';

const router = express.Router();

/**
 * @openapi
 * /api/referrals/admin/all:
 *   get:
 *     tags:
 *       - Referral Program
 *     summary: Fetch all referral tracking records for Admin Panel
 *     description: Returns a list of all advocate-referee referrals with details including advocate name, mobile, referee name, referral code used, reward amount, date, status, and AMT risk score.
 *     responses:
 *       200:
 *         description: List of referrals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Referral'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/admin/all', getAdminReferrals);

/**
 * @openapi
 * /api/referrals/admin/stats:
 *   get:
 *     tags:
 *       - Referral Program
 *     summary: Fetch aggregated referral program statistics for Admin Panel
 *     description: Returns total bonus distributed, total active advocates count, overall conversion rate, and count of flagged fraudulent referrals for dashboard metric cards.
 *     responses:
 *       200:
 *         description: Referral statistics calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ReferralAdminStats'
 *       500:
 *         description: Server error calculating statistics
 */
router.get('/admin/stats', getAdminReferralStats);

/**
 * @openapi
 * /api/referrals/admin/update-status:
 *   put:
 *     tags:
 *       - Referral Program
 *     summary: Update referral status or reward amount
 *     description: Update referral status to Credited, Joined, KYC Completed, Gold Purchased, or Flagged Fraud.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: string
 *                 example: "REF-201"
 *                 description: Referral ID or MongoDB _id
 *               status:
 *                 type: string
 *                 example: "Credited"
 *                 enum: ["Joined", "KYC Completed", "Gold Purchased", "Credited", "Flagged Fraud"]
 *               rewardAmount:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid parameters
 *       404:
 *         description: Referral not found
 */
router.put('/admin/update-status', updateAdminReferralStatus);

/**
 * @openapi
 * /api/referrals/admin/create:
 *   post:
 *     tags:
 *       - Referral Program
 *     summary: Manually create a new referral record
 *     description: Admin endpoint to record a new referral entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - referrerMobile
 *               - refereeMobile
 *               - referralCodeUsed
 *             properties:
 *               referrerMobile:
 *                 type: string
 *                 example: "9811234567"
 *               refereeMobile:
 *                 type: string
 *                 example: "9999900000"
 *               referralCodeUsed:
 *                 type: string
 *                 example: "ROHAN100"
 *               rewardAmount:
 *                 type: number
 *                 example: 100
 *               status:
 *                 type: string
 *                 example: "JOINED"
 *     responses:
 *       201:
 *         description: Referral record created successfully
 */
router.post('/admin/create', createAdminReferral);

/**
 * @openapi
 * /api/referrals/admin/{id}:
 *   delete:
 *     tags:
 *       - Referral Program
 *     summary: Delete a referral record
 *     description: Permanently remove a referral record from MongoDB.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "REF-201"
 *         description: The referral ID or MongoDB _id
 *     responses:
 *       200:
 *         description: Referral deleted successfully
 *       404:
 *         description: Referral record not found
 */
router.delete('/admin/:id', deleteAdminReferral);

export default router;
