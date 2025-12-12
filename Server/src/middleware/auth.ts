// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import BlacklistedToken from '../models/BlacklistedToken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    [k: string]: any;
  };
}

/**
 * Helper: try multiple places for a token so we are resilient to client/UI differences.
 */
function extractToken(req: Request): string | undefined {
  // 1) Standard Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization || req.get('Authorization') as string | undefined;
  if (authHeader && typeof authHeader === 'string') {
    const parts = authHeader.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0];          // token only
    if (parts.length >= 2 && parts[0].toLowerCase() === 'bearer') return parts.slice(1).join(' ');
    // fallback: first non-bearer token-like part
    for (const p of parts) {
      if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/.test(p)) return p;
    }
  }

  // 2) Common alternative headers
  const alt = (req.headers['x-access-token'] || req.headers['x-token'] || req.headers['token']) as string | undefined;
  if (alt) return alt;

  // 3) Query param: ?token=...
  if (req.query && typeof req.query.token === 'string') return req.query.token as string;
  if (req.query && typeof req.query.access_token === 'string') return req.query.access_token as string;

  // 4) Cookies (if you used cookie-parser middleware)
  // @ts-ignore
  if (req.cookies && req.cookies.token) return req.cookies.token;

  return undefined;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Try to extract token from many places
    const token = extractToken(req);

    // Debug: if token missing, log the header keys once to help diagnosis
    if (!token) {
      // Print a compact list of headers to help debugging (don't print values)
      const headerKeys = Object.keys(req.headers).join(', ');
      console.warn('[AUTH DEBUG] Authorization missing. Request headers keys:', headerKeys);
      // Also print common header values sizes (not full values) for further debugging
      console.warn('[AUTH DEBUG] Example header presence:',
        {
          authorization: typeof req.headers.authorization,
          'x-access-token': typeof req.headers['x-access-token'],
          token: typeof req.headers['token']
        });
      return res.status(401).json({ status: 'error', message: 'Unauthorized: token missing' });
    }

    // Check blacklist
    const black = await BlacklistedToken.findOne({ token }).lean();
    if (black) {
      return res.status(401).json({ status: 'error', message: 'Token revoked' });
    }

    // Verify token
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload || !payload.sub) {
      return res.status(401).json({ status: 'error', message: 'Invalid token payload' });
    }

    // Load user (strip sensitive fields)
    const user = await User.findById(payload.sub).select('-password -otp -otpExpires').lean();
    if (!user) return res.status(401).json({ status: 'error', message: 'User not found' });

    req.user = { id: user._id.toString(), email: (user as any).email, ...user };
    return next();
  } catch (err: any) {
    console.error('requireAuth err', err?.message ?? err);
    // If jwt throws TokenExpiredError or JsonWebTokenError, return appropriate status
    if (err && (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};
