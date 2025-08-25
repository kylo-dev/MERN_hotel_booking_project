import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { AuthRequest, isError } from "../types/guards.js";

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.auth || {};
    if (!userId) {
      res.json({ success: false, message: "not authenticated" });
      return;
    } else {
      const user = await User.findById(userId);
      req.user = user;
      next();
    }
  } catch (error) {
    if (isError(error)) {
      res.json({ success: false, message: error.message });
    } else {
      res.json({ success: false, message: "Authentication failed" });
    }
  }
};
