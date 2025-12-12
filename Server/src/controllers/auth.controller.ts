// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import BlacklistedToken from '../models/BlacklistedToken';
import { sendMail } from '../util/mailer';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';
const OTP_TTL_MIN = 10; // minutes

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Register: creates user, stores OTP, sends email.
 * POST /auth/register-otp
 * body: { name?, email, password }
 */
// ----- replace existing registerWithOtp function with this -----
// use this in src/controllers/auth.controller.ts — replace existing function
export const registerWithOtp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'email and password required' });

    const normalizedEmail = email.toLowerCase();
    const otp = genOtp();
    const otpExpires = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);
    const hashed = await bcrypt.hash(password, 10);

    // Try to find existing user
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      if (existing.isVerified) {
        return res.status(409).json({ status: 'error', message: 'Email already registered' });
      }

      // Update existing unverified user atomically
      existing.name = name ?? existing.name;
      existing.password = hashed;
      existing.otp = otp;
      existing.otpExpires = otpExpires;
      await existing.save();

    const { preview } = await sendMail({
    to: normalizedEmail,
    subject: 'Your NaviRiti verification code',
    text: `Your verification code is: ${otp}. It expires in ${OTP_TTL_MIN} minutes.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NaviRiti Verification</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fafafa; margin: 0; padding: 20px;">
        
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <div style="padding: 24px; border-bottom: 1px solid rgba(0,0,0,0.05); text-align: center;">
            <div style="display: inline-flex; align-items: center; justify-content: center;">
              <div style="width: 32px; height: 32px; background-color: #0D9488; border-radius: 8px; margin-right: 10px; display: inline-block; vertical-align: middle;"></div>
              <span style="font-size: 24px; font-weight: bold; color: #000000; vertical-align: middle;">NaviRiti</span>
            </div>
          </div>

          <div style="padding: 40px 30px; text-align: center;">
            <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #000000; font-size: 28px; margin-top: 0; margin-bottom: 16px; line-height: 1.2;">
              Verify Your Request
            </h1>
            
            <p style="color: #929292; font-size: 16px; line-height: 1.5; margin-bottom: 32px;">
              Please use the verification code below to continue navigating your future.
            </p>

            <div style="background-color: #ffffff; border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 24px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="background-color: #CCFBF1; color: #0D9488; font-size: 36px; font-weight: bold; letter-spacing: 6px; padding: 12px 24px; border-radius: 8px; font-family: monospace;">
                ${otp}
              </div>
            </div>

            <p style="color: #929292; font-size: 14px; margin-top: 32px;">
              This code will expire in <strong style="color: #000000;">${OTP_TTL_MIN} minutes</strong>.
            </p>
          </div>

          <div style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid rgba(0,0,0,0.05);">
            <p style="color: #929292; font-size: 12px; margin: 0;">
              If you didn't request this code, you can safely ignore this email.
            </p>
            <p style="color: #929292; font-size: 12px; margin-top: 8px;">
              &copy; ${new Date().getFullYear()} NaviRiti
            </p>
          </div>
          
        </div>
      </body>
      </html>
    `
  });
      return res.status(200).json({
        status: 'success',
        message: 'Existing unverified account updated. OTP resent to email.',
        preview
      });
    }

    // Create new user
    const user = new User({
      name,
      email: normalizedEmail,
      password: hashed,
      isVerified: false,
      otp,
      otpExpires
    });
    await user.save();

const { preview } = await sendMail({
      to: normalizedEmail,
      subject: 'Your NaviRiti verification code',
      text: `Your verification code is: ${otp}. It expires in ${OTP_TTL_MIN} minutes.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>NaviRiti Verification</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 20px;">
          
          <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.1); overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            
            <div style="padding: 24px; text-align: center; border-bottom: 1px solid rgba(0,0,0,0.05);">
               <span style="color: #000000; font-weight: bold; font-size: 24px;">
                 <span style="color: #0D9488;">✦</span> NaviRiti
               </span>
            </div>

            <div style="padding: 40px 30px; text-align: center;">
              <h1 style="color: #000000; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; margin-top: 0; margin-bottom: 12px;">
                Verify Your Request
              </h1>
              
              <p style="color: #929292; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                Please use the verification code below to continue navigating your future.
              </p>
              
              <div style="background-color: #CCFBF1; color: #0D9488; font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 20px; border-radius: 12px; display: inline-block; font-family: monospace; border: 1px solid rgba(13, 148, 136, 0.2);">
                ${otp}
              </div>
              
              <p style="color: #929292; font-size: 14px; margin-top: 32px;">
                This code expires in <strong style="color: #000000;">${OTP_TTL_MIN} minutes</strong>.
              </p>
            </div>

            <div style="background-color: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #929292; border-top: 1px solid rgba(0,0,0,0.05);">
              <p style="margin: 0;">If you didn't request this code, you can safely ignore this email.</p>
              <p style="margin: 8px 0 0 0;">&copy; NaviRiti</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    return res.status(201).json({
      status: 'success',
      message: 'User registered. OTP sent to email.',
      preview
    });
  } catch (err: any) {
    // If duplicate key error appears despite checks, handle gracefully
    if (err.code === 11000) {
      return res.status(409).json({ status: 'error', message: 'Email already registered (duplicate key)' });
    }
    console.error('registerWithOtp err', err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};



/**
 * Register without OTP (for Swagger/testing).
 * POST /auth/register-no-otp
 * body: { name?, email, password }
 */
export const registerNoOtp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'email and password required' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ status: 'error', message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashed,
      isVerified: true
    });
    await user.save();

    return res.status(201).json({ status: 'success', message: 'User created (no OTP)', user_id: user._id });
  } catch (err) {
    console.error('registerNoOtp err', err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

/**
 * Verify OTP
 * POST /auth/verify-otp
 * body: { email, otp }
 */
// src/controllers/auth.controller.ts — replace verifyOtp
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ status: 'error', message: 'email and otp required' });

    const normalizedEmail = email.toLowerCase();
    const now = new Date();

    // Atomic update: find doc matching email + otp + unexpired, then mark verified and clear otp fields
    const updated = await User.findOneAndUpdate(
      {
        email: normalizedEmail,
        otp: otp,
        otpExpires: { $gt: now }
      },
      {
        $set: { isVerified: true },
        $unset: { otp: "", otpExpires: "" }
      },
      { new: true } // return the updated document
    ).select('-password -__v');

    if (!updated) {
      // Could be: user not found, wrong OTP, or expired
      // Provide a generic message for security, or be explicit for dev
      return res.status(400).json({ status: 'error', message: 'Invalid or expired OTP' });
    }

    // success
    return res.status(200).json({ status: 'success', message: 'User verified', userId: updated._id });
  } catch (err) {
    console.error('verifyOtp err', err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};


/**
 * Login
 * POST /auth/login
 * body: { email, password }
 * returns: { token, expiresIn }
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    if (!user.isVerified) return res.status(403).json({ status: 'error', message: 'Email not verified' });

    const token = signToken({ sub: user._id.toString(), email: user.email });
    return res.status(200).json({ status: 'success', token, expiresIn: JWT_EXPIRES_IN });
  } catch (err) {
    console.error('login err', err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
/**
 * POST /auth/request-password-reset
 * body: { email }
 * Sends OTP to email for password reset. Creates OTP for user (if exists) or fail with 404.
 */
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'error', message: 'email required' });

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // For privacy you might want to always return 200 (don't reveal existence).
      // Here we return 404 so clients can handle flows in test/dev.
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Generate OTP and save (reuse OTP fields)
    const otp = genOtp();
    const otpExpires = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

  const { preview } = await sendMail({
      to: user.email,
      subject: 'NaviRiti password reset code',
      text: `Your password reset code is ${otp}. It expires in ${OTP_TTL_MIN} minutes.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 20px;">
          
          <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.1); overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            
            <div style="padding: 24px; text-align: center; border-bottom: 1px solid rgba(0,0,0,0.05);">
               <span style="color: #000000; font-weight: bold; font-size: 24px;">
                 <span style="color: #0D9488;">✦</span> NaviRiti
               </span>
            </div>

            <div style="padding: 40px 30px; text-align: center;">
              <h1 style="color: #000000; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; margin-top: 0; margin-bottom: 12px;">
                Reset Your Password
              </h1>
              
              <p style="color: #929292; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                We received a request to reset your password. Enter the code below to proceed.
              </p>
              
              <div style="background-color: #CCFBF1; color: #0D9488; font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 20px; border-radius: 12px; display: inline-block; font-family: monospace; border: 1px solid rgba(13, 148, 136, 0.2);">
                ${otp}
              </div>
              
              <p style="color: #929292; font-size: 14px; margin-top: 32px;">
                This code expires in <strong style="color: #000000;">${OTP_TTL_MIN} minutes</strong>.
              </p>
            </div>

            <div style="background-color: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #929292; border-top: 1px solid rgba(0,0,0,0.05);">
              <p style="margin: 0;">If you didn't ask to reset your password, you can ignore this email.</p>
              <p style="margin: 8px 0 0 0;">&copy; NaviRiti</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    return res.status(200).json({ status: 'success', message: 'Password reset OTP sent', preview });
  } catch (err) {
    console.error('requestPasswordReset err', err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

/**
 * POST /auth/reset-password
 * body: { email, otp, newPassword }
 * Verify OTP and set new password
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ status: 'error', message: 'email, otp and newPassword required' });

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    if (!user.otp || !user.otpExpires) return res.status(400).json({ status: 'error', message: 'No OTP present. Request a new code.' });
    if (user.otp !== otp) return res.status(400).json({ status: 'error', message: 'Invalid OTP' });
    if (user.otpExpires < new Date()) return res.status(400).json({ status: 'error', message: 'OTP expired' });

    // All good — set new password and clear OTP
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.otp = undefined;
    user.otpExpires = undefined;
    // Optionally mark user as verified when they reset password:
    if (!user.isVerified) user.isVerified = true;
    await user.save();

    return res.status(200).json({ status: 'success', message: 'Password updated' });
  } catch (err) {
    console.error('resetPassword err', err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

/**
 * Logout: blacklist token until expiry
 * POST /auth/logout  (Authorization: Bearer <token>)
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(400).json({ status: 'error', message: 'Authorization header required' });
    const token = auth.split(' ')[1];
    if (!token) return res.status(400).json({ status: 'error', message: 'Bearer token required' });

    const decoded: any = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ status: 'error', message: 'Invalid token' });
    }
    const expiresAt = new Date(decoded.exp * 1000);

    const black = new BlacklistedToken({ token, expiresAt });
    await black.save();

    return res.status(200).json({ status: 'success', message: 'Logged out' });
  } catch (err) {
    console.error('logout err', err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

/**
 * GET /auth/me  (protected)
 * returns authenticated user's public info
 */
export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    const userPublic = {
      id: req.user.id,
      email: req.user.email,
      name: (req.user as any).name,
      isVerified: (req.user as any).isVerified,
      createdAt: (req.user as any).createdAt,
      updatedAt: (req.user as any).updatedAt
    };
    return res.status(200).json({ status: 'success', user: userPublic });
  } catch (err) {
    console.error('me err', err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
