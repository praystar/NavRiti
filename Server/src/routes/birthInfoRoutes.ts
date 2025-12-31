import { Router } from 'express';
import { analyzeBirthInfo } from '../controllers/birthInfoController';

const router = Router();

/**
 * @openapi
 * /api/analyze:
 *   post:
 *     tags:
 *       - Birth Analysis
 *     summary: Submit birth details for astrological career analysis
 *     description: |
 *       Submits birth information and personality traits, calls the Kundali API 
 *       for Vedic astrological analysis, saves both input and complete output 
 *       in MongoDB, and returns the full analysis.
 *     
 *       **Workflow:**
 *       1. Validate input format
 *       2. Call Kundali API (https://navriti-the-new-direction-1.onrender.com/kundali)
 *       3. Save input + output to MongoDB
 *       4. Return complete analysis
 *     
 *       **Response includes:**
 *       - Complete Kundali API response (birth chart, planets, houses, career analysis)
 *       - Analysis ID for future reference
 *       - Processing metadata
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - birth_date
 *               - birth_time
 *               - birth_place
 *             properties:
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 pattern: '^\d{4}-\d{2}-\d{2}$'
 *                 example: "2004-08-15"
 *                 description: Birth date in YYYY-MM-DD format
 *               birth_time:
 *                 type: string
 *                 pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                 example: "10:30"
 *                 description: Birth time in 24-hour HH:MM format
 *               birth_place:
 *                 type: string
 *                 example: "Indore, Madhya Pradesh, India"
 *                 description: Full location name for geocoding
 *               personality_traits:
 *                 type: object
 *                 description: Personality ratings on 1-10 scale (optional)
 *                 properties:
 *                   creative:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 7
 *                   analytical:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 8
 *                   technical:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 9
 *                   leadership:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 6
 *                   communication:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 7
 *                   healing:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 4
 *                   business:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 5
 *     responses:
 *       201:
 *         description: Birth analysis completed successfully
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
 *                   example: "Birth information analyzed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     analysis_id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     database_id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     processing_time_ms:
 *                       type: integer
 *                 kundali_analysis:
 *                   type: object
 *                   description: Complete Kundali API response
 *       206:
 *         description: Partial success - data saved but API had issues
 *       400:
 *         description: Validation error in input data
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
 *                   example: "Invalid birth_date format. Must be YYYY-MM-DD"
 *       409:
 *         description: Duplicate analysis request
 *       503:
 *         description: Kundali API service unavailable
 */
router.post('/analyze', analyzeBirthInfo);

export default router;