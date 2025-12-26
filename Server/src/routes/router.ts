// src/routes/router.ts
import express from 'express';
import rateLimit from 'express-rate-limit';

import parentRoutes from './parentRoutes';
import societalRoutes from './societalRoutes';
import authRouter from './auth.router';

import studentRoutes from './studentRoutes';

import birthInfoRoutes from './birthInfoRoutes';


const router = express.Router();

// ----- GLOBAL RATE LIMIT (applies to all /api/* routes) -----
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests from this IP. Please slow down."
  }
});

// ----- STRICT LIMIT FOR EXPENSIVE ENDPOINTS (AI inference etc.) -----
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Rate limit exceeded for AI tool. Try again later."
  }
});

// Apply global limiter to all API routes
router.use(globalLimiter);

// Mount auth router under /api/auth — auth endpoints remain accessible publicly
router.use('/auth', authRouter);

// Mount application routers (these will be protected by global requireAuth in app.ts)
router.use('/parent', aiLimiter, parentRoutes);
router.use('/societal', aiLimiter, societalRoutes);
router.use('/student', studentRoutes);
router.use('/birthinfo', birthInfoRoutes);

export default router;
