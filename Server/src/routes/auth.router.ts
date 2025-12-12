// src/routes/auth.router.ts
import { Router, Response } from 'express';
import {
  registerWithOtp,
  registerNoOtp,
  verifyOtp,
  login,
  logout,
  me,
  requestPasswordReset,
  resetPassword
} from '../controllers/auth.controller';
import { requireBodyKeys } from '../validations/auth';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints (register/login/logout/verify)
 */

/**
 * @openapi
 * /auth/register-no-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user (no-OTP — test only)
 *     description: |
 *       **START HERE for testing!**
 *       
 *       Create a verified user immediately without email verification.
 *       Perfect for Swagger UI testing.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Test User"
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   example: "User created (no OTP)"
 *                 user_id:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */
router.post('/register-no-otp', requireBodyKeys('email', 'password'), registerNoOtp);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login and receive JWT
 *     description: |
 *       Authenticate with email and password. Returns a JWT token.
 *       
 *       **After login, copy the token and use one of these methods:**
 *       
 *       **Method 1 (Easiest for Swagger):**
 *       - Add `?token=YOUR_TOKEN` to any protected endpoint URL
 *       - Example: `/auth/me?token=eyJhbGc...`
 *       
 *       **Method 2:**
 *       - Use `/auth/test-token` to verify it works
 *       
 *       **Method 3:**
 *       - Click "Authorize" 🔓 and paste the token (may not work in all browsers)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 token:
 *                   type: string
 *                   description: JWT token - Copy this!
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 expiresIn:
 *                   type: string
 *                   example: "7d"
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 *       500:
 *         description: Server error
 */
router.post('/login', requireBodyKeys('email', 'password'), login);

/**
 * @openapi
 * /auth/test-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Test if your token works
 *     description: |
 *       **Use this to verify your token is valid!**
 *       
 *       Paste your token from `/auth/login` into the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Paste your JWT token here
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Token is valid
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
 *                   example: "Token is valid! ✓"
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
 *         description: Token missing
 *       401:
 *         description: Token invalid or expired
 */
router.post('/test-token', requireAuth, (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    status: 'success',
    message: 'Token is valid! ✓',
    user: {
      id: req.user?.id,
      email: req.user?.email,
      name: (req.user as any)?.name
    }
  });
});

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user profile
 *     description: |
 *       Returns the currently authenticated user's profile.
 *       
 *       **🔧 Swagger UI Workaround:**
 *       Since the Authorize button may not work, manually add your token to the URL:
 *       
 *       1. Copy your token from `/auth/login`
 *       2. In the "Request URL" field above, add: `?token=YOUR_TOKEN_HERE`
 *       3. Click Execute
 *       
 *       Example: `/auth/me?token=eyJhbGciOiJIUzI1NiIsInR5...`
 *       
 *       **For production apps:** Use the Authorization header as normal.
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: false
 *         description: JWT token (Swagger UI workaround - paste your token here!)
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
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
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Server error
 */
router.get('/me', requireAuth, me);

/**
 * @openapi
 * /auth/register-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user (OTP flow)
 *     description: |
 *       Register a user and send an OTP to email.
 *       Use `/auth/verify-otp` to complete verification.
 *       
 *       **Note:** For Swagger testing, use `/auth/register-no-otp` instead.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Vivek Garg"
 *               email:
 *                 type: string
 *                 example: "vivek@example.com"
 *               password:
 *                 type: string
 *                 example: "secretPass123"
 *     responses:
 *       201:
 *         description: Registered and OTP sent
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
 *                   example: "User registered. OTP sent to email."
 *                 preview:
 *                   type: string
 *                   description: Email preview URL (dev only)
 *       400:
 *         description: Missing fields
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */
router.post('/register-otp', requireBodyKeys('email', 'password'), registerWithOtp);

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify OTP for registered user
 *     description: Complete the OTP flow by posting the OTP received on email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: "vivek@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Verified successfully
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
 *                   example: "User verified"
 *                 userId:
 *                   type: string
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/verify-otp', requireBodyKeys('email', 'otp'), verifyOtp);

/**
 * @openapi
 * /auth/request-password-reset:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request password reset OTP
 *     description: |
 *       Send a password reset OTP to the user's email.
 *       The OTP expires in 10 minutes.
 *       
 *       **Flow:**
 *       1. Call this endpoint with your email
 *       2. Check your email for the OTP
 *       3. Use `/auth/reset-password` with the OTP to set a new password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "vivek@example.com"
 *     responses:
 *       200:
 *         description: Password reset OTP sent successfully
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
 *                   example: "Password reset OTP sent"
 *                 preview:
 *                   type: string
 *                   description: Email preview URL (dev only)
 *       400:
 *         description: Missing email
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/request-password-reset', requireBodyKeys('email'), requestPasswordReset);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password using OTP
 *     description: |
 *       Reset your password using the OTP sent via `/auth/request-password-reset`.
 *       
 *       **Steps:**
 *       1. First call `/auth/request-password-reset` with your email
 *       2. Check your email for the 6-digit OTP
 *       3. Call this endpoint with your email, the OTP, and your new password
 *       
 *       **Note:** The OTP expires in 10 minutes. If it expires, request a new one.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "vivek@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *                 description: 6-digit OTP from email
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "newSecurePass123"
 *                 description: Your new password
 *     responses:
 *       200:
 *         description: Password updated successfully
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
 *                   example: "Password updated"
 *       400:
 *         description: Missing fields, invalid OTP, or OTP expired
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
 *                   example: "Invalid OTP"
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/reset-password', requireBodyKeys('email', 'otp', 'newPassword'), resetPassword);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout (revoke token)
 *     description: |
 *       Blacklist the token so it can no longer be used.
 *       
 *       **Swagger workaround:** Add `?token=YOUR_TOKEN` to the URL
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: false
 *         description: JWT token (Swagger UI workaround)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
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
 *                   example: "Logged out"
 *       400:
 *         description: Missing token
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/logout', requireAuth, logout);

export default router;