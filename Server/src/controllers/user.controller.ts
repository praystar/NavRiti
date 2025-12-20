// src/controllers/user.controller.ts
import { Response, NextFunction } from "express";
import HttpError from "../util/HttpError";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../middleware/auth";

/**
 * GET /user/:id
 * Optional — not used by your router right now
 */
export const getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select("-password -otp -otpExpires");
    if (!user) return res.status(404).json({ message: "User not found!" });

    return res.status(200).json(user.toObject({ getters: true }));
  } catch (err) {
    console.error(err);
    return next(new HttpError("Could not find user.", 500));
  }
};

/**
 * DELETE /user/delete
 * Deletes the user making the request
 */
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    await user.deleteOne();

    return res.status(200).json({ status: "success", message: "User deleted." });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Could not delete user.", 500));
  }
};

/**
 * GET /user/profile
 * Returns authenticated user's profile
 */
export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select("-password -otp -otpExpires");
    if (!user) return res.status(404).json({ message: "User not found!" });

    return res.status(200).json(user.toObject({ getters: true }));
  } catch (err) {
    console.error(err);
    return next(new HttpError("Could not fetch profile.", 500));
  }
};

/**
 * PUT /user/profile
 * Update authenticated user's fields
 */
export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Update allowed fields
    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;

    // Optional: If password is provided, re-hash
    if (req.body.password) {
      const hashed = await bcrypt.hash(req.body.password, 10);
      user.password = hashed;
    }

    const updatedUser = await user.save();

    return res.status(200).json(updatedUser.toObject({ getters: true }));
  } catch (err) {
    console.error(err);
    return next(new HttpError("Could not update profile.", 500));
  }
};
