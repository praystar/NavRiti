import { Router } from 'express';
import { submitParentPreferences } from '../controllers/parentController';

const router = Router();

/**
 * @openapi
 * /parent/preferences:
 *   post:
 *     tags:
 *       - Parent Preferences
 *     summary: Submit parental career preference weights and receive AI-based recommendation
 *     description: >
 *       Accepts structured parent preference data, stores it in MongoDB, and returns a static
 *       recommendation response (future-ready for ML model integration).
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - financial_stability_weight
 *               - job_security_weight
 *               - prestige_weight
 *               - location_preference
 *               - migration_willingness
 *               - budget_constraints
 *               - parent_risk_tolerance
 *               - weight_on_parent_layer
 *             properties:
 *               parent_id:
 *                 type: string
 *                 example: "0fb2fd61-3c9c-46b4-87c4-b9d2fb18d111"
 *
 *               financial_stability_weight:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.9
 *
 *               job_security_weight:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.8
 *
 *               prestige_weight:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.5
 *
 *               location_preference:
 *                 type: string
 *                 enum: [local, national, international, conditional]
 *                 example: "national"
 *
 *               migration_willingness:
 *                 type: string
 *                 enum: [yes, no, conditional]
 *                 example: "conditional"
 *
 *               budget_constraints:
 *                 type: object
 *                 properties:
 *                   max_tuition_per_year:
 *                     type: number
 *                     example: 25000
 *
 *               unacceptable_professions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["politics", "defense"]
 *
 *               acceptable_professions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["software engineering", "design", "medicine"]
 *
 *               parent_risk_tolerance:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.3
 *
 *               weight_on_parent_layer:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.5
 *
 *     responses:
 *       201:
 *         description: Preferences saved successfully and recommendation generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *
 *                 message:
 *                   type: string
 *                   example: "Preferences saved and analyzed."
 *
 *                 prediction:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: number
 *                       example: 85
 *                     recommended_path:
 *                       type: string
 *                       example: "Software Engineering"
 *                     match_reason:
 *                       type: string
 *                       example: "High alignment with financial stability and low risk tolerance."
 *                     flags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Matches budget constraints"]
 *
 *                 saved_id:
 *                   type: string
 *                   example: "67ab9222d83a291833650cef"
 *
 *       500:
 *         description: Server error while saving parent preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error processing request"
 *                 error:
 *                   type: string
 */
router.post('/preferences', submitParentPreferences);

export default router;
