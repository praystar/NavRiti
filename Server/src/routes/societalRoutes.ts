// src/routes/societalRoutes.ts
import { Router } from 'express';
import { analyzeSocietal } from '../controllers/societalController';

const router = Router();

/**
 * @openapi
 * /societal/analyze:
 *   post:
 *     tags:
 *       - Societal Analysis
 *     summary: Analyze societal factors and return a static evaluation result
 *     description: >
 *       This endpoint accepts any JSON payload representing societal indicators 
 *       (peer pressure, family influence, role-model influence, or any survey results).
 *       It stores both the input and the static generated analysis inside MongoDB.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Any arbitrary JSON survey or societal data payload
 *             example:
 *               survey_id: "survey_9e13aa"
 *               responses:
 *                 A:
 *                   "0": 4
 *                   "1": 3
 *                   "2": 5
 *                 B:
 *                   "0": 2
 *                   "1": 4
 *                   "2": 5
 *               meta:
 *                 submittedBy: "user_123"
 *                 timestamp: "2025-01-12T10:33:21Z"
 *
 *     responses:
 *       201:
 *         description: Analysis saved and returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Analysis completed (static result). Saved to DB.
 *                 analysis:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: number
 *                       example: 72
 *                     summary:
 *                       type: string
 *                       example: Moderate societal alignment — some positive indicators.
 *                     recommended_actions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - Investigate flagged regions
 *                         - Increase public-awareness campaigns
 *                         - Monitor trends weekly
 *                     flags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - budget_mismatch
 *                         - regional_variability
 *                 saved_id:
 *                   type: string
 *                   example: 67ab9222d83a291833650cef
 *
 *       500:
 *         description: Server error processing request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.post('/analyze', analyzeSocietal);

export default router;
