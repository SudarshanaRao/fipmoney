import express from 'express';
import { getHealthStatus } from '../controllers/healthController.js';

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: System & Database Health Check
 *     description: Returns the current operational status of the FipMoney backend service and MongoDB Atlas connection details.
 *     tags:
 *       - System Health
 *     responses:
 *       200:
 *         description: System operational status and MongoDB connection information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheckResponse'
 *       500:
 *         description: Server error or database disconnected.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getHealthStatus);

export default router;
