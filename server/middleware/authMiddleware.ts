import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";

interface AuthRequest extends Request {
  auth?: {
    userId?: string;
  };
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.auth || {};
  if (!userId) {
    res.json({ success: false, message: "not authenticated" });
  } else {
    const user = await User.findById(userId);
    req.user = user;
    next();
  }
};
