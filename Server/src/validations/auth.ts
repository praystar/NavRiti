// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import BlacklistedToken from '../models/BlacklistedToken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
export function requireBodyKeys(...keys: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ status: 'error', message: 'Bad request: payload required.' });
    }
    const missing = keys.filter(k => !(k in req.body));
    if (missing.length) {
      return res.status(400).json({ status: 'error', message: `Missing fields: ${missing.join(', ')}` });
    }
    next();
  };
}
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    [k: string]: any;
  };
}

/**
 * Extract token from ANYWHERE possible
 */
function extractToken(req: Request): string | undefined {
  // 1) Authorization header - check both cases
  const authLower = req.headers.authorization as string | undefined;
  const authUpper = req.headers.Authorization as string | undefined;
  const authHeader = authLower || authUpper;
  
  if (authHeader && typeof authHeader === 'string') {
    const trimmed = authHeader.trim();
    
    // Handle "Bearer <token>"
    if (trimmed.toLowerCase().startsWith('bearer ')) {
      const token = trimmed.slice(7).trim();
      if (token) return token;
    }
    
    // Handle just "<token>" (no Bearer prefix)
    if (trimmed && !trimmed.includes(' ')) {
      return trimmed;
    }
    
    // Handle multiple parts - find JWT-like string
    const parts = trimmed.split(' ').filter(Boolean);
    for (const part of parts) {
      // JWT format: xxx.yyy.zzz
      if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(part)) {
        return part;
      }
    }
  }

  // 2) Common alternative headers
  const altHeaders = [
    'x-access-token',
    'x-token', 
    'token',
    'x-auth-token',
    'auth-token'
  ];
  
  for (const header of altHeaders) {
    const value = req.headers[header] as string | undefined;
    if (value && typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }
  }

  // 3) Query params
  if (req.query) {
    const queryToken = req.query.token || req.query.access_token || req.query.jwt;
    if (queryToken && typeof queryToken === 'string') {
      const trimmed = queryToken.trim();
      if (trimmed) return trimmed;
    }
  }

  // 4) Body (for POST/PUT)
  if (req.body && typeof req.body === 'object') {
    const bodyToken = req.body.token || req.body.access_token || req.body.jwt;
    if (bodyToken && typeof bodyToken === 'string') {
      const trimmed = bodyToken.trim();
      if (trimmed) return trimmed;
    }
  }

  // 5) Cookies (if cookie-parser is used)
  // @ts-ignore
  if (req.cookies) {
    // @ts-ignore
    const cookieToken = req.cookies.token || req.cookies.jwt || req.cookies.access_token;
    if (cookieToken && typeof cookieToken === 'string') {
      const trimmed = cookieToken.trim();
      if (trimmed) return trimmed;
    }
  }

  return undefined;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);

    if (!token) {
      // Enhanced debugging
      console.warn('[AUTH] Token missing. Available headers:', 
        Object.keys(req.headers)
          .filter(k => k.toLowerCase().includes('auth') || k.toLowerCase().includes('token'))
          .map(k => `${k}: ${typeof req.headers[k]}`)
          .join(', ') || 'none'
      );
      
      return res.status(401).json({ 
        status: 'error', 
        message: 'Unauthorized: token missing',
        hint: 'Add token via Authorization header as "Bearer <token>" or query param ?token=<token>'
      });
    }

    console.log('[AUTH] Token found:', token.substring(0, 20) + '...');

    // Check blacklist
    const black = await BlacklistedToken.findOne({ token }).lean();
    if (black) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Token revoked' 
      });
    }

    // Verify token
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload || !payload.sub) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Invalid token payload' 
      });
    }

    // Load user
    const user = await User.findById(payload.sub).select('-password -otp -otpExpires').lean();
    if (!user) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'User not found' 
      });
    }

    req.user = { id: user._id.toString(), email: (user as any).email, ...user };
    console.log('[AUTH] User authenticated:', req.user.email);
    return next();
    
  } catch (err: any) {
    console.error('[AUTH ERROR]', err?.message ?? err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Token expired' 
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Invalid token format' 
      });
    }
    
    return res.status(401).json({ 
      status: 'error', 
      message: 'Authentication failed' 
    });
  }
};