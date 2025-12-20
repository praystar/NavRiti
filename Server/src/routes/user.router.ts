// src/routes/user.router.ts
import express from 'express';
import { Request, Response } from 'express';
import { getUser, deleteUser, getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

/**
 * @openapi
 * /user/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get authenticated user's public profile
 *     description: Returns the public profile for the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized - missing/invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profile', requireAuth, getUserProfile);

/**
 * @openapi
 * /user/profile:
 *   put:
 *     tags:
 *       - User
 *     summary: Update authenticated user's profile
 *     description: Update name, email or password for the authenticated user. Password change requires current password on the controller side (optional).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Vivek Garg"
 *               email:
 *                 type: string
 *                 example: "vivek@example.com"
 *               password:
 *                 type: string
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Bad request (validation failed)
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', requireAuth, updateUserProfile);

/**
 * @openapi
 * /user/delete:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete authenticated user's account
 *     description: Permanently deletes the authenticated user's account. Protected endpoint.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted
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
 *                   example: "User deleted"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/delete', requireAuth, deleteUser);

/**
 * (Optional) If you keep an ID-based GET: /user/:id
 * Provide swagger docs only if you expose this endpoint.
 *
 * Example (commented):
 *
 * @openapi
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by id (admin or internal)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 */

/* If you need a route for /user/:id, uncomment and protect as needed:
router.get('/:id', requireAuth, getUser);
*/

export { router as userRouter };
