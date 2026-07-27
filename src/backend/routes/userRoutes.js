import express from 'express';
import { authUser, getUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

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

export default router;
