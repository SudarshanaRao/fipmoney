import express from 'express';
import {
  getEmailTemplates,
  getEmailTemplateById,
  saveEmailTemplate,
  deleteEmailTemplate,
  sendEmailToUser,
  sendBulkEmailToUsers,
  sendWelcomeEmail,
  getEmailLogs,
  sendEmailToUsers,
} from '../controllers/emailController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Email & Communication System
 *   description: Manage HTML Email Templates, Send Welcome/Notification Emails & View Logs
 */

/**
 * @swagger
 * /api/emails/templates:
 *   get:
 *     summary: Get All HTML Email Templates
 *     description: Retrieves all stored HTML email templates for the Admin Panel.
 *     tags:
 *       - Email & Communication System
 *     responses:
 *       200:
 *         description: List of HTML email templates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: number, example: 3 }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       templateId: { type: string, example: "WELCOME_SIGNUP" }
 *                       name: { type: string, example: "Welcome & Signup Onboarding Email" }
 *                       subject: { type: string, example: "Welcome to FipMoney!" }
 *                       htmlContent: { type: string, example: "<html>...</html>" }
 *                       category: { type: string, example: "Onboarding" }
 *                       variables: { type: array, items: { type: string }, example: ["userName", "referralCode"] }
 */
router.get('/templates', getEmailTemplates);

/**
 * @swagger
 * /api/emails/templates/{templateId}:
 *   get:
 *     summary: Get Specific HTML Email Template by ID
 *     description: Retrieves a single HTML email template by its unique template ID.
 *     tags:
 *       - Email & Communication System
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *         example: WELCOME_SIGNUP
 *     responses:
 *       200:
 *         description: HTML email template details.
 *       404:
 *         description: Template not found.
 */
router.get('/templates/:templateId', getEmailTemplateById);

/**
 * @swagger
 * /api/emails/templates:
 *   post:
 *     summary: Create or Update HTML Email Template
 *     description: Saves a new HTML email template or updates an existing template from Admin Panel.
 *     tags:
 *       - Email & Communication System
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - templateId
 *               - name
 *               - subject
 *               - htmlContent
 *             properties:
 *               templateId: { type: string, example: "WELCOME_SIGNUP" }
 *               name: { type: string, example: "Welcome & Signup Onboarding Email" }
 *               subject: { type: string, example: "Welcome to FipMoney - Your 24K Gold Vault is Active!" }
 *               htmlContent: { type: string, example: "<html><body><h1>Welcome {{userName}}</h1></body></html>" }
 *               category: { type: string, example: "Onboarding" }
 *               variables: { type: array, items: { type: string }, example: ["userName", "mobileNumber", "referralCode"] }
 *               isActive: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Email template saved successfully.
 */
router.post('/templates', saveEmailTemplate);

/**
 * @swagger
 * /api/emails/templates/{templateId}:
 *   delete:
 *     summary: Delete HTML Email Template
 *     description: Removes an HTML email template from the database.
 *     tags:
 *       - Email & Communication System
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email template deleted.
 */
router.delete('/templates/:templateId', deleteEmailTemplate);

/**
 * @swagger
 * /api/emails/send:
 *   post:
 *     summary: Send Templated HTML Email to User
 *     description: Renders the specified HTML template with variables and sends the email via SMTP/Mock.
 *     tags:
 *       - Email & Communication System
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toEmail
 *               - templateId
 *             properties:
 *               toEmail: { type: string, example: "user@example.com" }
 *               templateId: { type: string, example: "WELCOME_SIGNUP" }
 *               variables:
 *                 type: object
 *                 example:
 *                   userName: "Rohan Verma"
 *                   mobileNumber: "9876543210"
 *                   referralCode: "ROHAN100"
 *     responses:
 *       200:
 *         description: Email sent successfully or queued in mock mode.
 */
router.post('/send', sendEmailToUser);

/**
 * @swagger
 * /api/emails/send-bulk:
 *   post:
 *     summary: Send Templated Email to Multiple Selected Users
 *     description: Sends an HTML email template to multiple selected users with custom variable payload.
 *     tags:
 *       - Email & Communication System
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipients
 *               - templateId
 *             properties:
 *               templateId: { type: string, example: "WELCOME_SIGNUP" }
 *               recipients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     toEmail: { type: string, example: "user1@example.com" }
 *                     userName: { type: string, example: "User One" }
 *                     mobileNumber: { type: string, example: "9876543210" }
 *     responses:
 *       200:
 *         description: Bulk email processing result summary.
 */
router.post('/send-bulk', sendBulkEmailToUsers);

/**
 * @swagger
 * /api/emails/send-welcome:
 *   post:
 *     summary: Send Signup Welcome Email
 *     description: Helper endpoint to trigger welcome email to new user after signup.
 *     tags:
 *       - Email & Communication System
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber: { type: string, example: "9876543210" }
 *               email: { type: string, example: "rohan@gmail.com" }
 *               userName: { type: string, example: "Rohan Verma" }
 *     responses:
 *       200:
 *         description: Welcome email sent successfully.
 */
router.post('/send-welcome', sendWelcomeEmail);

/**
 * @swagger
 * /api/emails/logs:
 *   get:
 *     summary: Get Email Delivery Logs
 *     description: Fetches recent email delivery audit logs for Admin Panel monitoring.
 *     tags:
 *       - Email & Communication System
 *     responses:
 *       200:
 *         description: List of email delivery logs.
 */
router.get('/logs', getEmailLogs);
router.post('/send-to-users', sendEmailToUsers);
router.post('/send-email-to-users', sendEmailToUsers);

export default router;
