import { Router } from 'express';
import { submitBirthInfo } from '../controllers/birthInfoController';

const router = Router();

/**
 * @openapi
 * /birthinfo/submit:
 *   post:
 *     tags:
 *       - Birth Info
 *     summary: Submit birth details and personality traits
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - birthDate
 *               - birthTime
 *               - birthPlace
 *             properties:
 *               birthDate:
 *                 type: string
 *                 example: "2002-08-15"
 *               birthTime:
 *                 type: string
 *                 example: "14:30"
 *               birthPlace:
 *                 type: string
 *                 example: "Mumbai, India"
 *               personality_traits:
 *                 type: object
 *                 properties:
 *                   creative:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 6
 *                   analytical:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 7
 *                   technical:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 6
 *                   leadership:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 5
 *                   communication:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 7
 *                   healing:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 3
 *                   business:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 10
 *                     example: 5
 *     responses:
 *       201:
 *         description: Birth info saved and analyzed
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/submit', submitBirthInfo);

export default router;
