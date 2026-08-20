import express from 'express';
import EmailCampaign from '../models/EmailCampaign.js';
import User from '../models/User.js';
import AgentWaitlist from '../models/AgentWaitlist.js';
import { sendCustomEmail } from '../utils/emailService.js';
import { sendZohoMarketingCampaign, exchangeGrantCodeForTokens } from '../utils/zohoCampaignsService.js';
import {
  checkAdminExists,
  verifyAdminCode,
  adminSignup,
  adminLogin,
  getAllAdmins,
  createAdmin,
  updateAdminRole,
  deleteAdmin,
  getAdminDashboardSummary,
  getAllSipPlans,
  createSipPlan,
  updateSipPlan,
  deleteSipPlan,
  getAdminBbpsTransactions,
  createBbpsTransaction,
  updateBbpsTransactionStatus,
  getGoldHoldingsSummary,
  updateGoldRateBenchmark,
  createVaultAuditEntry,
  triggerTrusteeAudit,
} from '../controllers/adminController.js';

const router = express.Router();

// @desc    Get Zoho OAuth Configuration & Redirect URIs
// @route   GET /api/admin/zoho-oauth/config
router.get('/zoho-oauth/config', (req, res) => {
  const protocol = req.protocol || 'https';
  const host = req.get('host') || 'dev-server.fipmoney.com';
  const redirectUri = `${protocol}://${host}/api/admin/zoho-oauth/callback`;

  res.status(200).json({
    success: true,
    redirectUri,
    devServerRedirectUri: 'https://dev-server.fipmoney.com/api/admin/zoho-oauth/callback',
    localRedirectUri: 'http://localhost:5000/api/admin/zoho-oauth/callback',
    productionRedirectUri: 'https://www.fipmoney.com/api/admin/zoho-oauth/callback',
    clientId: process.env.ZOHO_CAMPAIGNS_CLIENT_ID || '',
    isConfigured: Boolean(process.env.ZOHO_CAMPAIGNS_CLIENT_ID && process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN),
  });
});

// @desc    Save Client ID and Client Secret in memory/env
// @route   POST /api/admin/zoho-oauth/save-keys
router.post('/zoho-oauth/save-keys', (req, res) => {
  const { clientId, clientSecret, dataCenter } = req.body;
  if (!clientId || !clientSecret) {
    return res.status(400).json({ success: false, message: 'Client ID and Client Secret are required.' });
  }

  process.env.ZOHO_CAMPAIGNS_CLIENT_ID = clientId.trim();
  process.env.ZOHO_CAMPAIGNS_CLIENT_SECRET = clientSecret.trim();
  if (dataCenter) process.env.ZOHO_DATA_CENTER = dataCenter.trim();

  res.status(200).json({
    success: true,
    message: 'Zoho API keys saved successfully in server configuration.',
  });
});

// @desc    Zoho OAuth Callback Endpoint (Authorized Redirect URI)
// @route   GET /api/admin/zoho-oauth/callback
router.get('/zoho-oauth/callback', async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;

  if (error || !code) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Zoho Connection Failed</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #e11d48;">❌ Zoho OAuth Authorization Failed</h2>
          <p style="color: #64748b;">Reason: ${error || 'No authorization code received'}</p>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6d28d9; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Close Window</button>
        </body>
      </html>
    `);
  }

  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host') || 'dev-server.fipmoney.com';
  const redirectUri = `${proto}://${host}${req.path}`;

  try {
    const result = await exchangeGrantCodeForTokens(code, redirectUri);

    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Zoho Connection Successful</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f8fafc;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
            <h2 style="color: #10b981; margin-bottom: 10px;">🎉 Zoho Campaigns Connected!</h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              Fipmoney has successfully generated and saved your permanent <strong>Zoho Campaigns Refresh Token</strong>.
            </p>
            <div style="background: #f1f5f9; padding: 12px; border-radius: 10px; font-family: monospace; font-size: 12px; word-break: break-all; margin: 20px 0; color: #475569;">
              Token: ${result.refreshToken.slice(0, 15)}...${result.refreshToken.slice(-10)}
            </div>
            <button onclick="if(window.opener){window.opener.location.reload();} window.close();" style="padding: 12px 24px; background: #6d28d9; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 14px;">
              Return to Admin Dashboard
            </button>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Zoho OAuth Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8fafc;">
          <div style="max-width: 550px; margin: 0 auto; background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
            <h2 style="color: #e11d48; margin-bottom: 10px;">❌ Token Exchange Error</h2>
            <div style="background: #fff1f2; border: 1px solid #fecdd3; padding: 12px; border-radius: 10px; font-family: monospace; font-size: 13px; color: #9f1239; margin: 15px 0;">
              ${err.message}
            </div>
            <p style="color: #64748b; font-size: 13px;">
              <strong>Note:</strong> Zoho authorization codes can only be used <strong>once</strong>. If you reloaded the page or re-used an old link, please click <em>Authorize</em> again to generate a new code.
            </p>
            <button onclick="window.close()" style="padding: 12px 24px; background: #6d28d9; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;">Close Window</button>
          </div>
        </body>
      </html>
    `);
  }
});

/**
 * @openapi
 * /api/admin/dashboard:
 *   get:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Fetch aggregated summary metrics for Admin Dashboard tab
 *     description: Returns aggregated telemetry data required for the Admin Dashboard tab cards (Active Investments count, Total Investments amount, Gold Accumulated weight, Returns Generated, Avg User AMT Score, Plan Distribution, KYC Breakdown, and Risk Telemetry) without sending raw individual transaction records.
 *     responses:
 *       200:
 *         description: Dashboard telemetry summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admin Dashboard telemetry summary retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/AdminDashboardSummary'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/dashboard', getAdminDashboardSummary);

/**
 * @openapi
 * /api/admin/check-exists:
 *   get:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Check if any admin account exists in database
 *     description: Returns the total count of registered admin accounts and a boolean indicator if at least one admin exists.
 *     responses:
 *       200:
 *         description: Check completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalAdmins:
 *                   type: integer
 *                   example: 2
 *                 exists:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/check-exists', checkAdminExists);

/**
 * @openapi
 * /api/admin/verify-code:
 *   get:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Verify if secret code, email, or mobile belongs to an existing admin
 *     description: Queries database by secret code, email, or mobile number to check admin account presence.
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         example: "2787"
 *         description: 4-digit admin secret PIN code
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         example: "admin@fipmoney.com"
 *         description: Admin email address
 *       - in: query
 *         name: mobile
 *         schema:
 *           type: string
 *         example: "9876543210"
 *         description: Admin 10-digit mobile number
 *     responses:
 *       200:
 *         description: Admin verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 exists:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Missing query parameter
 *       500:
 *         description: Server error
 */
router.get('/verify-code', verifyAdminCode);

/**
 * @openapi
 * /api/admin/signup:
 *   post:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Register a new Admin account
 *     description: Create a primary or additional Admin user account with encrypted password and secret code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - mobile
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Super Admin"
 *               email:
 *                 type: string
 *                 example: "admin@fipmoney.com"
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: "Admin@fipmoney.com"
 *               secretCode:
 *                 type: string
 *                 example: "2787"
 *               role:
 *                 type: string
 *                 example: "Super Admin"
 *                 enum: ["Super Admin", "Finance Manager", "Support Lead", "Compliance Officer"]
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admin account created and registered in database successfully!"
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Missing fields or conflict with existing admin
 *       500:
 *         description: Server Error
 */
router.post('/signup', adminSignup);

/**
 * @openapi
 * /api/admin/login:
 *   post:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Authenticate Admin user login
 *     description: Authenticate an admin user via Secret Code, Email/Mobile, and Password/PIN.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               secretCode:
 *                 type: string
 *                 example: "2787"
 *               emailOrMobile:
 *                 type: string
 *                 example: "admin@fipmoney.com"
 *               password:
 *                 type: string
 *                 example: "Admin@fipmoney.com"
 *     responses:
 *       200:
 *         description: Admin authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admin authenticated successfully!"
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: No admin registered in database
 *       500:
 *         description: Server Error
 */
router.post('/login', adminLogin);

/**
 * @openapi
 * /api/admin/all:
 *   get:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Fetch all registered Admin accounts
 *     description: Returns a list of all active, pending, or suspended admin user accounts for the Admin Panel team management interface.
 *     responses:
 *       200:
 *         description: Admin list fetched successfully
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
 *                     $ref: '#/components/schemas/Admin'
 *       500:
 *         description: Server Error
 */
router.get('/all', getAllAdmins);

/**
 * @openapi
 * /api/admin/create:
 *   post:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Create new admin user from Admin Panel
 *     description: Add a new sub-admin user with assigned role, contact details, and secret code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - mobile
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Finance Manager User"
 *               email:
 *                 type: string
 *                 example: "finance@fipmoney.com"
 *               mobile:
 *                 type: string
 *                 example: "9812345678"
 *               secretCode:
 *                 type: string
 *                 example: "5544"
 *               role:
 *                 type: string
 *                 example: "Finance Manager"
 *                 enum: ["Super Admin", "Finance Manager", "Support Lead", "Compliance Officer"]
 *     responses:
 *       201:
 *         description: Sub-admin created successfully
 *       400:
 *         description: Missing parameters or existing admin conflict
 *       500:
 *         description: Server Error
 */
router.post('/create', createAdmin);

/**
 * @openapi
 * /api/admin/update-role:
 *   put:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Update role or status of an Admin user
 *     description: Modify role designation (e.g. Finance Manager to Super Admin) or account status (Active, Pending Approval, Suspended).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: "66a4f91e92d2b4001e4a3b1a"
 *                 description: Admin MongoDB _id
 *               role:
 *                 type: string
 *                 example: "Super Admin"
 *                 enum: ["Super Admin", "Finance Manager", "Support Lead", "Compliance Officer"]
 *               status:
 *                 type: string
 *                 example: "Active"
 *                 enum: ["Active", "Pending Approval", "Suspended"]
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Missing Admin ID
 *       404:
 *         description: Admin user not found
 *       500:
 *         description: Server Error
 */
router.put('/update-role', updateAdminRole);

/**
 * @openapi
 * /api/admin/{id}:
 *   delete:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Remove an Admin user account
 *     description: Permanently remove an admin account from MongoDB.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "66a4f91e92d2b4001e4a3b1a"
 *         description: Admin MongoDB _id
 *     responses:
 *       200:
 *         description: Admin user removed successfully
 *       500:
 *         description: Server Error
 */
/**
 * @openapi
 * /api/admin/sip-plans:
 *   get:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Get all Gold SIP Plans
 *     description: Retrieve list of all available Gold SIP plans from MongoDB database. Auto-seeds defaults if DB is empty.
 *     responses:
 *       200:
 *         description: List of SIP plans retrieved successfully
 *       500:
 *         description: Server Error
 *   post:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Create a new Gold SIP Plan
 *     description: Add a new Gold SIP plan with custom minimum investment amount, returns rate, category, and description.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - minAmount
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Super Gold SIP"
 *               minAmount:
 *                 type: number
 *                 example: 250
 *               category:
 *                 type: string
 *                 example: "Weekly SIP"
 *               description:
 *                 type: string
 *                 example: "High yield weekly gold investment plan"
 *               returnsRate:
 *                 type: string
 *                 example: "9.5%"
 *               status:
 *                 type: string
 *                 example: "Active"
 *     responses:
 *       201:
 *         description: SIP plan created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server Error
 */
router.get('/sip-plans', getAllSipPlans);
router.post('/sip-plans', createSipPlan);

/**
 * @openapi
 * /api/admin/sip-plans/{id}:
 *   put:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Update an existing Gold SIP Plan
 *     description: Update details of an existing Gold SIP plan by ID or planId.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "SIP-101"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               minAmount:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               returnsRate:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: SIP plan updated successfully
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Server Error
 *   delete:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Delete a Gold SIP Plan
 *     description: Remove a Gold SIP plan permanently from MongoDB.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "SIP-101"
 *     responses:
 *       200:
 *         description: SIP plan deleted successfully
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Server Error
 */
router.put('/sip-plans/:id', updateSipPlan);
router.delete('/sip-plans/:id', deleteSipPlan);

/**
 * @openapi
 * /api/admin/bbps-transactions:
 *   get:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Fetch all BBPS bill payment & recharge transactions
 *     description: Retrieve list of recent BBPS bill payments and mobile recharges with summary telemetry (total volume, gold cashback, success rate).
 *     responses:
 *       200:
 *         description: BBPS transactions list and summary metrics retrieved successfully
 *       500:
 *         description: Server Error
 *   post:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Simulate/Create a BBPS bill payment or recharge transaction
 *     description: Add a new BBPS transaction record for testing or admin manual entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - billerName
 *               - accountNumber
 *               - amount
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "Rohan Verma"
 *               userPhone:
 *                 type: string
 *                 example: "+91 98765 43210"
 *               billerName:
 *                 type: string
 *                 example: "BSES Rajdhani Power Delhi"
 *               category:
 *                 type: string
 *                 example: "Electricity"
 *               accountNumber:
 *                 type: string
 *                 example: "1002938475"
 *               amount:
 *                 type: number
 *                 example: 2450
 *               paymentGateway:
 *                 type: string
 *                 example: "Setu BBPS NPCI"
 *               status:
 *                 type: string
 *                 example: "Success"
 *     responses:
 *       201:
 *         description: BBPS transaction created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server Error
 */
router.get('/bbps-transactions', getAdminBbpsTransactions);
router.post('/bbps-transactions', createBbpsTransaction);

/**
 * @openapi
 * /api/admin/bbps-transactions/{id}/status:
 *   put:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Update status of a BBPS transaction
 *     description: Update status of a BBPS bill/recharge transaction (Success, Pending, Failed, Refunded).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "BBPS-2026-9812"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Refunded"
 *     responses:
 *       200:
 *         description: BBPS transaction status updated successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server Error
 */
router.put('/bbps-transactions/:id/status', updateBbpsTransactionStatus);

/**
 * @openapi
 * /api/admin/gold-holdings:
 *   get:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Fetch Gold Holdings & Physical Vault Treasury Telemetry
 *     description: Retrieve total physical vault gold reserves (kg), live 24K benchmark rate, custodian distributions (Brinks, Vistra, MMTC), form factor breakdowns, and physical audit journal entries.
 *     responses:
 *       200:
 *         description: Gold holdings telemetry and vault audit journal retrieved successfully
 *       500:
 *         description: Server Error
 */
router.get('/gold-holdings', getGoldHoldingsSummary);

/**
 * @openapi
 * /api/admin/gold-holdings/rate:
 *   put:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Override/Update Live 24K Gold Rate Benchmark (₹/gram)
 *     description: Update live 24K gold rate benchmark per gram dynamically across the platform.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rate
 *             properties:
 *               rate:
 *                 type: number
 *                 example: 7850.50
 *     responses:
 *       200:
 *         description: Benchmark gold rate updated successfully
 *       400:
 *         description: Invalid rate provided
 *       500:
 *         description: Server Error
 */
router.put('/gold-holdings/rate', updateGoldRateBenchmark);

/**
 * @openapi
 * /api/admin/gold-holdings/audit:
 *   post:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Create/Log a Vault Storage or Physical Movement Entry
 *     description: Log physical bullion deposits, transfers, mint dispatches, or audit logs into the physical vault inventory stream.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vaultLocation
 *               - custodian
 *               - movementType
 *               - weightKg
 *             properties:
 *               vaultLocation:
 *                 type: string
 *                 example: "Mumbai Brink's Vault"
 *               custodian:
 *                 type: string
 *                 example: "Brink's India"
 *               movementType:
 *                 type: string
 *                 example: "Bullion Deposit"
 *               weightKg:
 *                 type: number
 *                 example: 10.5
 *               purityCert:
 *                 type: string
 *                 example: "BIS Hallmarked #MMTC-9912"
 *               auditStatus:
 *                 type: string
 *                 example: "Verified & Insured"
 *     responses:
 *       201:
 *         description: Vault audit entry logged successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server Error
 */
router.post('/gold-holdings/audit', createVaultAuditEntry);

/**
 * @openapi
 * /api/admin/gold-holdings/trigger-audit:
 *   post:
 *     tags:
 *       - Admin Dashboard & Security
 *     summary: Trigger Instant Trustee Physical Audit Scan
 *     description: Execute an instant physical audit scan by SEBI Vistra Trustee across all physical vault locations.
 *     responses:
 *       200:
 *         description: Instant trustee audit scan executed successfully
 *       500:
 *         description: Server Error
 */
router.post('/gold-holdings/trigger-audit', triggerTrusteeAudit);

// ==========================================
// EMAIL MARKETING & CAMPAIGNS API ROUTES
// ==========================================

// @desc    Get all Email Marketing Campaigns
// @route   GET /api/admin/email-campaigns
router.get('/email-campaigns', async (req, res) => {
  try {
    const campaigns = await EmailCampaign.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create or update Email Campaign draft
// @route   POST /api/admin/email-campaigns
router.post('/email-campaigns', async (req, res) => {
  try {
    const { campaignId, title, subject, category, fromEmail, htmlContent, targetAudience, targetEmails } = req.body;

    if (!title || !subject || !htmlContent) {
      return res.status(400).json({
        success: false,
        message: 'Title, Subject, and HTML Content are required.',
      });
    }

    const cId = campaignId || 'CMP' + Date.now();

    let campaign = await EmailCampaign.findOne({ campaignId: cId });
    if (campaign) {
      campaign.title = title;
      campaign.subject = subject;
      campaign.category = category || 'Marketing';
      campaign.fromEmail = fromEmail || 'info@fipmoney.com';
      campaign.htmlContent = htmlContent;
      campaign.targetAudience = targetAudience || 'ALL_USERS';
      if (Array.isArray(targetEmails)) campaign.targetEmails = targetEmails;
      await campaign.save();
    } else {
      campaign = await EmailCampaign.create({
        campaignId: cId,
        title,
        subject,
        category: category || 'Marketing',
        fromEmail: fromEmail || 'info@fipmoney.com',
        htmlContent,
        targetAudience: targetAudience || 'ALL_USERS',
        targetEmails: Array.isArray(targetEmails) ? targetEmails : [],
        status: 'DRAFT',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Campaign saved successfully',
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Send Email Campaign to target audience
// @route   POST /api/admin/email-campaigns/send
router.post('/email-campaigns/send', async (req, res) => {
  try {
    const { campaignId } = req.body;

    let campaign = await EmailCampaign.findOne({ campaignId });
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Resolve target audience recipients
    let recipients = [];
    const audience = campaign.targetAudience || 'ALL_USERS';

    if (audience === 'ALL_USERS') {
      const users = await User.find({ email: { $exists: true, $ne: '' } });
      recipients = users.map(u => ({
        toEmail: u.email,
        userName: u.fullName || u.username || 'Valued User',
        mobileNumber: u.mobileNumber || '',
        referralCode: u.referralCode || 'FIP2026',
      }));
    } else if (audience === 'KYC_VERIFIED') {
      const users = await User.find({ isKycCompleted: true, email: { $exists: true, $ne: '' } });
      recipients = users.map(u => ({
        toEmail: u.email,
        userName: u.fullName || u.username || 'Valued User',
        mobileNumber: u.mobileNumber || '',
        referralCode: u.referralCode || 'FIP2026',
      }));
    } else if (audience === 'DGA_AGENTS') {
      const agents = await AgentWaitlist.find({ email: { $exists: true, $ne: '' } });
      recipients = agents.map(a => ({
        toEmail: a.email,
        userName: a.username || 'DGA Partner',
        mobileNumber: a.mobile || '',
        referralCode: 'DGA2026',
      }));
    } else if (audience === 'SPECIFIC_USERS') {
      const rawList = campaign.targetEmails || [];
      recipients = rawList.filter(e => e && e.includes('@')).map(e => ({
        toEmail: e.trim(),
        userName: 'Valued User',
        mobileNumber: '',
        referralCode: 'FIP2026',
      }));
    }

    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid recipient email addresses found for the selected target audience.',
      });
    }

    // Mark as SENDING
    campaign.status = 'SENDING';
    campaign.stats.totalRecipients = recipients.length;
    await campaign.save();

    // 1. Try sending via Zoho Campaigns REST API first if OAuth credentials configured
    const zohoRes = await sendZohoMarketingCampaign({
      campaignName: campaign.title,
      subject: campaign.subject,
      fromEmail: campaign.fromEmail || 'info@fipmoney.com',
      fromName: 'Fipmoney Marketing',
      htmlContent: campaign.htmlContent,
      recipients,
    });

    if (zohoRes.isZohoCampaignsConfigured && zohoRes.success) {
      campaign.status = 'SENT';
      campaign.sentAt = new Date();
      campaign.zohoCampaignId = zohoRes.campaignKey || '';
      campaign.stats.sentCount = recipients.length;
      campaign.stats.failedCount = 0;
      await campaign.save();

      return res.status(200).json({
        success: true,
        message: `Campaign '${campaign.title}' successfully triggered via Zoho Campaigns API!`,
        data: campaign,
      });
    }

    // 2. Fallback / Direct broadcast sending
    let sentCount = 0;
    let failedCount = 0;

    for (const r of recipients) {
      try {
        const sendRes = await sendCustomEmail(
          r.toEmail,
          campaign.subject,
          campaign.htmlContent,
          campaign.fromEmail,
          campaign.category,
          {
            userName: r.userName,
            mobileNumber: r.mobileNumber,
            referralCode: r.referralCode,
          }
        );
        if (sendRes.success) sentCount++;
        else failedCount++;
      } catch (err) {
        failedCount++;
      }
    }

    campaign.status = 'SENT';
    campaign.sentAt = new Date();
    campaign.stats.sentCount = sentCount;
    campaign.stats.failedCount = failedCount;
    await campaign.save();

    res.status(200).json({
      success: true,
      message: `Email Campaign executed! Sent: ${sentCount}, Failed: ${failedCount}. Total: ${recipients.length}`,
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Send Test Email for Campaign
// @route   POST /api/admin/email-campaigns/test
router.post('/email-campaigns/test', async (req, res) => {
  try {
    const { testEmail, subject, htmlContent, fromEmail, category } = req.body;

    if (!testEmail || !subject || !htmlContent) {
      return res.status(400).json({ success: false, message: 'testEmail, subject, and htmlContent are required.' });
    }

    // 1. Try sending test email via Zoho Campaigns REST API first if configured
    const zohoRes = await sendZohoMarketingCampaign({
      campaignName: `[TEST] ${subject}`,
      subject: `[TEST] ${subject}`,
      fromEmail: fromEmail || 'info@fipmoney.com',
      fromName: 'Fipmoney Marketing Test',
      htmlContent,
      recipients: [{ toEmail: testEmail, userName: 'Test Admin User', mobileNumber: '9999999999', referralCode: 'FIPTEST' }],
    });

    if (zohoRes.isZohoCampaignsConfigured && zohoRes.success) {
      console.log(`[Zoho Campaigns Service] Test email sent to ${testEmail} via Zoho Campaigns API!`);
      return res.status(200).json({
        success: true,
        message: `Test email sent to ${testEmail} via Zoho Campaigns API!`,
        data: zohoRes.data,
      });
    }

    // 2. Fallback to sending via transactional email service
    const result = await sendCustomEmail(
      testEmail,
      `[TEST] ${subject}`,
      htmlContent,
      fromEmail || 'info@fipmoney.com',
      category || 'Marketing',
      {
        userName: 'Test Admin User',
        mobileNumber: '9999999999',
        referralCode: 'FIPTEST',
      }
    );

    res.status(200).json({
      success: result.success,
      message: `[Fallback Transactional Service] ${result.message}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get Zoho OAuth Configuration & Redirect URIs
router.delete('/:id', deleteAdmin);

export default router;
