import express from 'express';
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

router.delete('/:id', deleteAdmin);

export default router;
