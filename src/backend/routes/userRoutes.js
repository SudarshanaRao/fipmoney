import express from 'express';
import { checkMobile, checkUsername, checkReferral, sendOtp, verifyOtp, sendEmailOtp, verifyEmailOtp, checkAdminEmail, sendSuperAdminAuthOtp, verifySuperAdminAuthOtp, authUser, getUsers, getUserById, getUserByUuid, getUserCard, getVaultSummary, buyGoldOrSilver, sellGoldOrSilver, updateProfile, completeKyc, getUserByMobile, getDashboardData, getProfileSettings, getReferralsTracking, getReferralSummary, uploadProfileImage, getPresignedUploadUrl, confirmProfileImageUpload, getProfileImageUrl, deleteProfileImage, getPendingDues, getUserAmlScore, getUserAmtScore, getAllAdminUsers, adminUpdateAmlScore, adminUpdateAmtScore, adminToggleUserStatus, getUserSessions, revokeUserSession, checkSessionStatus } from '../controllers/userController.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

/**
 * @swagger
 * /api/users/admin/all-users:
 *   get:
 *     summary: Get All Real Users for Admin Dashboard
 *     description: Fetches real MongoDB user records for the Admin Users table.
 *     tags:
 *       - Admin User Control
 *     responses:
 *       200:
 *         description: List of real user records.
 */
router.get('/admin/all-users', getAllAdminUsers);

/**
 * @swagger
 * /api/users/admin/update-aml-score:
 *   put:
 *     summary: Admin Override User AML Risk Score
 *     description: Updates a user's AML risk score and records audit trail in MongoDB.
 *     tags:
 *       - Admin User Control
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               amlScore: { type: number }
 *               auditNote: { type: string }
 *     responses:
 *       200:
 *         description: AML score updated successfully.
 */
router.put('/admin/update-aml-score', adminUpdateAmlScore);
router.put('/admin/update-amt-score', adminUpdateAmlScore);

/**
 * @swagger
 * /api/users/admin/toggle-status:
 *   put:
 *     summary: Admin Toggle User Account Status
 *     description: Suspends or activates a user account in MongoDB.
 *     tags:
 *       - Admin User Control
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *     responses:
 *       200:
 *         description: User status toggled.
 */
router.put('/admin/toggle-status', adminToggleUserStatus);

/**
 * @swagger
 * /api/users/{userId}/aml-score:
 *   get:
 *     summary: Get AML Risk Score for a Particular User
 *     description: Retrieves the AML risk score and flagged abnormal activity logs for a user.
 *     tags:
 *       - User Management
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: AML score details returned.
 */
router.get('/:userId/aml-score', getUserAmlScore);
router.get('/:userId/amt-score', getUserAmlScore);

/**
 * @swagger
 * /api/users/check-username:
 *   post:
 *     summary: Check Username Availability
 *     description: Checks if a username is available in the dev_users MongoDB table.
 *     tags:
 *       - User Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *     responses:
 *       200:
 *         description: Checked availability status.
 */
router.post('/check-username', checkUsername);

/**
 * @swagger
 * /api/users/check-referral:
 *   post:
 *     summary: Check Referral Code Validity
 *     description: Checks if a referral code exists in the dev_users MongoDB table.
 *     tags:
 *       - User Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referralCode: { type: string }
 *     responses:
 *       200:
 *         description: Checked validity status.
 */
router.post('/check-referral', checkReferral);

/**
 * @swagger
 * /api/users/check-mobile:
 *   post:
 *     summary: Check Mobile Number Existence
 *     description: Checks if a mobile number exists in the dev_users MongoDB table.
 *     tags:
 *       - User Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile: { type: string }
 *     responses:
 *       200:
 *         description: Checked existence status.
 */
router.post('/check-mobile', checkMobile);

/**
 * @swagger
 * /api/users/send-otp:
 *   post:
 *     summary: Send OTP
 *     description: Generates and sends OTP to the mobile number.
 *     tags:
 *       - User Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile: { type: string }
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 */
router.post('/send-otp', sendOtp);

/**
 * @swagger
 * /api/users/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     description: Verifies the OTP sent to the user's mobile number.
 *     tags:
 *       - User Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile: { type: string }
 *               otp: { type: string }
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *       400:
 *         description: Invalid or expired OTP.
 */
router.post('/verify-otp', verifyOtp);
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);

/**
 * @swagger
 * /api/users/auth:
 *   post:
 *     summary: Authenticate or Register User
 *     description: Authenticates existing user by mobile number or creates a new record in the dev_users MongoDB table.
 *     tags:
 *       - User Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       200:
 *         description: Existing user authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       201:
 *         description: New user registered in database.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/auth', authUser);

/**
 * @swagger
 * /api/users/card:
 *   get:
 *     summary: Get user encrypted virtual card
 *     description: Returns the AES-256 encrypted virtual card for the logged-in user.
 *     tags:
 *       - User Management
 *     responses:
 *       200:
 *         description: Encrypted Virtual Card.
 */
router.get('/card', getUserCard);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Fetch All Registered Users
 *     description: Retrieves list of all user records stored in the dev_users MongoDB table.
 *     tags:
 *       - User Management
 *     responses:
 *       200:
 *         description: List of registered users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: number, example: 5 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', getUsers);


/**
 * @swagger
 * /api/users/vault/summary:
 *   get:
 *     summary: Fetch Vault & Portfolio Summary
 *     description: Retrieves gold holdings, silver holdings, gold vault value, silver vault value, cash balance, portfolio value, and recent vault transactions from MongoDB for a given user mobile number.
 *     tags:
 *       - Digital Vault & Portfolio Management
 *     parameters:
 *       - in: query
 *         name: mobile
 *         required: true
 *         schema:
 *           type: string
 *         example: "7013302191"
 *         description: User registered 10-digit mobile number
 *     responses:
 *       200:
 *         description: Vault summary retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/vault/summary', getVaultSummary);

/**
 * @swagger
 * /api/users/vault/buy:
 *   post:
 *     summary: Buy Gold or Silver
 *     description: Records a gold/silver purchase in MongoDB, updates the user's gold/silver vault holdings, and returns updated vault and portfolio values. Non-KYC users are permitted.
 *     tags:
 *       - Digital Vault & Portfolio Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileNumber
 *               - metal
 *               - amount
 *               - grams
 *             properties:
 *               mobileNumber: { type: string, example: "7013302191" }
 *               metal: { type: string, enum: ["GOLD", "SILVER"], example: "GOLD" }
 *               amount: { type: number, example: 1000 }
 *               grams: { type: number, example: 0.1557 }
 *               lockedPrice: { type: number, example: 6420.50, description: "Locked rate for 5-minute price lock window" }
 *               paymentMethod: { type: string, example: "UPI" }
 *     responses:
 *       200:
 *         description: Gold/Silver purchase successful and saved in database.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/vault/buy', buyGoldOrSilver);

/**
 * @swagger
 * /api/users/vault/sell:
 *   post:
 *     summary: Sell Gold or Silver
 *     description: Sells digital gold or silver from the user's vault in MongoDB and credits the cash value to their portfolio balance. Non-KYC users are permitted.
 *     tags:
 *       - Digital Vault & Portfolio Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileNumber
 *               - metal
 *               - amount
 *               - grams
 *             properties:
 *               mobileNumber: { type: string, example: "7013302191" }
 *               metal: { type: string, enum: ["GOLD", "SILVER"], example: "GOLD" }
 *               amount: { type: number, example: 1000 }
 *               grams: { type: number, example: 0.1557 }
 *               ratePerGram: { type: number, example: 6420.50 }
 *     responses:
 *       200:
 *         description: Gold/Silver sale completed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/vault/sell', sellGoldOrSilver);

/**
 * @swagger
 * /api/users/profile-settings:
 *   get:
 *     summary: Get profile settings data
 *     description: Retrieves the specific user data needed for the profile settings page.
 *     tags:
 *       - User Management
 *     responses:
 *       200:
 *         description: Profile settings data retrieved successfully.
 */
router.get('/profile-settings', getProfileSettings);

/**
 * @swagger
 * /api/users/update-profile:
 *   post:
 *     summary: Update Profile Details & Enforce 60-Day Username Lock
 *     description: Updates profile details in MongoDB. Validates username (only alphanumeric + underscore, no spaces) and enforces 60-day edit lock policy.
 *     tags:
 *       - User Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileNumber
 *             properties:
 *               mobileNumber: { type: string, example: "7013302191" }
 *               username: { type: string, example: "john_doe99", description: "Unique username (alphanumeric & underscore only)" }
 *               fullName: { type: string, example: "John Doe" }
 *               email: { type: string, example: "john@example.com" }
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid username format or 60-day lock active.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/update-profile', updateProfile);

/**
 * @swagger
 * /api/users/complete-kyc:
 *   post:
 *     summary: Complete KYC for User
 *     description: Updates the user's KYC status to true and level to FULL in MongoDB.
 *     tags:
 *       - User Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileNumber
 *             properties:
 *               mobileNumber: { type: string, example: "7013302191" }
 *     responses:
 *       200:
 *         description: KYC completed successfully.
 */
router.post('/complete-kyc', completeKyc);

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search User Details by Mobile Number
 *     description: Retrieves a single user record by mobile number.
 *     tags:
 *       - User Management
 *     parameters:
 *       - in: query
 *         name: mobile
 *         required: true
 *         schema:
 *           type: string
 *         description: User's mobile number
 *     responses:
 *       200:
 *         description: User record found.
 *       404:
 *         description: User not found.
 */
router.get('/search', getUserByMobile);
router.get('/uuid/:userId', getUserByUuid);

/**
 * @swagger
 * /api/users/dashboard:
 *   get:
 *     summary: Fetch Dashboard Data
 *     description: Retrieves unified dashboard data including vault estimates, KYC status, encrypted premium card details, and recent top 3 transactions.
 *     tags:
 *       - User Management
 *     parameters:
 *       - in: query
 *         name: mobile
 *         required: false
 *         schema:
 *           type: string
 *         description: User's mobile number
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: User's UUID
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully.
 *       400:
 *         description: Missing mobile number or userId.
 *       404:
 *         description: User not found.
 */
router.get('/dashboard', getDashboardData);

/**
 * @swagger
 * /api/users/referrals:
 *   get:
 *     summary: Get Referral Tracking
 *     description: Returns stats about referred users.
 *     tags:
 *       - Profile & Dashboard
 *     parameters:
 *       - in: query
 *         name: mobile
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Referral tracking data.
 */
router.get('/referrals', getReferralsTracking);

/**
 * @swagger
 * /api/users/referrals/summary:
 *   get:
 *     summary: Get Referral Summary
 *     description: Returns aggregated earnings and referrals data.
 *     tags:
 *       - Profile & Dashboard
 *     parameters:
 *       - in: query
 *         name: mobile
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Referral summary data.
 */
router.get('/referrals/summary', getReferralSummary);

/**
 * @swagger
 * /api/users/profile/image/upload-url:
 *   post:
 *     summary: Generate Presigned S3 Upload URL
 *     description: Returns a temporary S3 PUT presigned URL for direct frontend image upload.
 *     tags:
 *       - Profile & Dashboard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile: { type: string }
 *               fileName: { type: string }
 *               contentType: { type: string }
 *     responses:
 *       200:
 *         description: Presigned upload URL generated.
 */
router.post('/profile/image/upload-url', getPresignedUploadUrl);
router.post('/profile-image/upload-url', getPresignedUploadUrl);

/**
 * @swagger
 * /api/users/profile/image/confirm:
 *   post:
 *     summary: Confirm Direct S3 Image Upload
 *     description: Updates MongoDB user profileImageKey after successful S3 upload.
 *     tags:
 *       - Profile & Dashboard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile: { type: string }
 *               objectKey: { type: string }
 *     responses:
 *       200:
 *         description: Profile image confirmed in database.
 */
router.post('/profile/image/confirm', confirmProfileImageUpload);
router.post('/profile-image/confirm', confirmProfileImageUpload);

/**
 * @swagger
 * /api/users/profile/image:
 *   get:
 *     summary: Get Temporary Signed View URL for Profile Photo
 *     description: Generates a temporary S3 GET signed URL for private user avatar viewing.
 *     tags:
 *       - Profile & Dashboard
 *     parameters:
 *       - in: query
 *         name: mobile
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Temporary view URL generated.
 *   delete:
 *     summary: Delete User Profile Photo
 *     description: Removes object from S3 and resets MongoDB profile keys.
 *     tags:
 *       - Profile & Dashboard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile: { type: string }
 *     responses:
 *       200:
 *         description: Profile image deleted.
 */
router.get('/profile/image', getProfileImageUrl);
router.get('/profile-image', getProfileImageUrl);
router.delete('/profile/image', deleteProfileImage);
router.delete('/profile-image', deleteProfileImage);
router.post('/profile/image/delete', deleteProfileImage);

router.post('/profile-image', upload.single('image'), uploadProfileImage);

/**
 * @swagger
 * /api/users/pending-dues:
 *   get:
 *     summary: Get Pending Dues
 *     description: Returns pending due bills for a user.
 *     tags:
 *       - Profile & Dashboard
 *     parameters:
 *       - in: query
 *         name: mobile
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pending dues list.
 */
router.get('/pending-dues', getPendingDues);

router.get('/sessions', getUserSessions);
router.post('/sessions/revoke', revokeUserSession);
router.get('/session-status', checkSessionStatus);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Fetch User Details by ID
 *     description: Retrieves a single user record by MongoDB ObjectId.
 *     tags:
 *       - User Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the target user
 *     responses:
 *       200:
 *         description: User record found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getUserById);

router.post('/check-admin-email', checkAdminEmail);
router.post('/send-superadmin-otp', sendSuperAdminAuthOtp);
router.post('/verify-superadmin-otp', verifySuperAdminAuthOtp);

export default router;
