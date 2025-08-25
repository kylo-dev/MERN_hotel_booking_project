import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { isAuthRequest, isError } from "../types/guards.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 타입 가드를 사용하여 AuthRequest로 변환
    if (!isAuthRequest(req)) {
      res.json({ success: false, message: "Invalid request type" });
      return;
    }

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
