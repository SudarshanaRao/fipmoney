import express from 'express';
import {
  createEmailTemplate,
  getAllEmailTemplates,
  getEmailTemplateById,
  updateEmailTemplate,
  deleteEmailTemplate,
} from '../controllers/emailTemplateController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Email Template Storage
 *   description: Separate Database CRUD endpoints for HTML Email Templates
 */

/**
 * @swagger
 * /api/email-templates:
 *   get:
 *     summary: Get All Stored Email Templates from Database
 *     tags: [Email Template Storage]
 *   post:
 *     summary: Create New Email Template in Database
 *     tags: [Email Template Storage]
 */
router.route('/')
  .get(getAllEmailTemplates)
  .post(createEmailTemplate);

/**
 * @swagger
 * /api/email-templates/{id}:
 *   get:
 *     summary: Get Email Template by ID
 *     tags: [Email Template Storage]
 *   put:
 *     summary: Update Email Template in Database
 *     tags: [Email Template Storage]
 *   delete:
 *     summary: Delete Email Template from Database
 *     tags: [Email Template Storage]
 */
router.route('/:id')
  .get(getEmailTemplateById)
  .put(updateEmailTemplate)
  .delete(deleteEmailTemplate);

export default router;
