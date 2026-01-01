// src/routes/parentRoutes.ts
import { Router } from 'express';
import { 
  submitParentPreferences, 
  getParentPreference, 
  retryParentAnalysis 
} from '../controllers/parentController';

const router = Router();

/**
 * @openapi
 * /parent/preferences:
 *   post:
 *     tags:
 *       - Parent Preferences
 *     summary: Submit parental career preference weights and receive ML-based recommendation
 *     description: >
 *       Accepts structured parent preference data, validates required fields, calls FastAPI ML service,
 *       stores results in MongoDB, and returns career recommendations with explanations.
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
 *               financial_stability_weight:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.9
 *               job_security_weight:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.8
 *               prestige_weight:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.5
 *               location_preference:
 *                 type: string
 *                 enum: [local, national, international, conditional]
 *                 example: "national"
 *               migration_willingness:
 *                 type: string
 *                 enum: [yes, no, conditional]
 *                 example: "conditional"
 *               budget_constraints:
 *                 type: object
 *                 required:
 *                   - max_tuition_per_year
 *                 properties:
 *                   max_tuition_per_year:
 *                     type: number
 *                     example: 25000
 *               unacceptable_professions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["politics", "defense"]
 *               acceptable_professions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["software engineering", "design", "medicine"]
 *               parent_risk_tolerance:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.3
 *               weight_on_parent_layer:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.5
 *
 *     responses:
 *       201:
 *         description: Preferences saved and ML analysis completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Preferences saved and analyzed successfully."
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
 *                       example: "This career aligns strongly with parental priorities..."
 *                     flags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     top_5_careers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           career_id:
 *                             type: string
 *                           parent_score:
 *                             type: number
 *                 saved_id:
 *                   type: string
 *
 *       202:
 *         description: Preferences saved but ML analysis failed (data saved for retry)
 *
 *       400:
 *         description: Validation error
 *
 *       500:
 *         description: Server error
 */
router.post('/preferences', submitParentPreferences);

/**
 * @openapi
 * /parent/preferences/{id}:
 *   get:
 *     tags:
 *       - Parent Preferences
 *     summary: Retrieve a saved parent preference by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Preference found
 *       404:
 *         description: Preference not found
 *       500:
 *         description: Server error
 */
router.get('/preferences/:id', getParentPreference);

/**
 * @openapi
 * /parent/preferences/{id}/retry:
 *   post:
 *     tags:
 *       - Parent Preferences
 *     summary: Retry FastAPI analysis for a saved preference
 *     description: >
 *       Useful when initial analysis failed. Calls FastAPI again with saved data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analysis retried successfully
 *       404:
 *         description: Preference not found
 *       500:
 *         description: FastAPI still failing or server error
 */
router.post('/preferences/:id/retry', retryParentAnalysis);

export default router;