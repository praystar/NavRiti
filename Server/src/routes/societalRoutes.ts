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
 *       Accepts any JSON payload representing societal indicators (peer pressure, family influence,
 *       role-model influence, or survey results). Stores both the raw input and a static analysis
 *       result inside MongoDB for later review.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Arbitrary JSON payload representing survey responses or societal signals
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
 *               required:
 *                 - status
 *                 - message
 *                 - analysis
 *                 - saved_id
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Analysis completed (static result). Saved to DB."
 *                 analysis:
 *                   type: object
 *                   required:
 *                     - score
 *                     - summary
 *                   properties:
 *                     score:
 *                       type: number
 *                       example: 72
 *                     summary:
 *                       type: string
 *                       example: "Moderate societal alignment — there are both positive indicators and some risk factors."
 *                     recommended_actions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "Investigate flagged regions"
 *                         - "Increase public-awareness campaigns"
 *                         - "Monitor trends weekly"
 *                     flags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "budget_mismatch"
 *                         - "regional_variability"
 *                 saved_id:
 *                   type: string
 *                   example: "67ab9222d83a291833650cef"
 *
 *       400:
 *         description: Bad request (e.g., empty body)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Bad request: payload required."
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
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: string
 */
router.post('/analyze', analyzeSocietal);

export default router;
