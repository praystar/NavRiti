// ============================================
// ROUTES (server/routes/studentRoutes.ts)
// ============================================
import { Router } from 'express';
import { 
  submitStage1, 
  submitStage2,
  submitStudentProfileWithCV,
  upload 
} from '../controllers/studentController';

const router = Router();

/**
 * @openapi
 * /student/stage1:
 *   post:
 *     tags:
 *       - Student Profile
 *     summary: Stage 1 - Submit school student data (Classes 6-12)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - level
 *               - schoolData
 *             properties:
 *               name:
 *                 type: string
 *                 example: "NameA"
 *               level:
 *                 type: string
 *                 example: "school"
 *               schoolData:
 *                 type: object
 *                 properties:
 *                   favoritesubjects:
 *                     type: string
 *                     example: "Maths, Computer Science"
 *                   hobbies:
 *                     type: string
 *                     example: "Debate, Coding"
 *                   enjoy:
 *                     type: string
 *                     example: "Problem solving"
 *                   achievements:
 *                     type: string
 *                     example: "School coding competition winner"
 *                   dream:
 *                     type: string
 *                     example: "Software Engineer"
 *     responses:
 *       201:
 *         description: Stage 1 data saved successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/stage1', submitStage1);

/**
 * @openapi
 * /student/stage2:
 *   post:
 *     tags:
 *       - Student Profile
 *     summary: Stage 2 - Submit undergraduate student data (manual input)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - input_data
 *             properties:
 *               name:
 *                 type: string
 *                 example: "NameA"
 *               input_data:
 *                 type: object
 *                 properties:
 *                   degree:
 *                     type: string
 *                     example: "B.tech CSE"
 *                   university:
 *                     type: string
 *                     example: "ABC University"
 *                   current_year:
 *                     type: string
 *                     example: "2-3"
 *                   cgpa:
 *                     type: string
 *                     example: "8.5"
 *                   skills:
 *                     type: string
 *                     example: "Python, Machine Learning"
 *                   experience:
 *                     type: string
 *                     example: "Internship at XYZ"
 *                   projects:
 *                     type: string
 *                     example: "Project A"
 *                   preferred_roles:
 *                     type: string
 *                     example: "Software Engineer"
 *     responses:
 *       201:
 *         description: Stage 2 data saved successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/stage2', submitStage2);

/**
 * @openapi
 * /student/profile-cv:
 *   post:
 *     tags:
 *       - Student Profile
 *     summary: Submit undergraduate profile with CV upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - level
 *               - cv
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Smith"
 *               level:
 *                 type: string
 *                 example: "undergraduate"
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Success
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/profile-cv', upload.single('cv'), submitStudentProfileWithCV);

export default router;