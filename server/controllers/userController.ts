import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: any;
  body: any;
}

// GET: /api/user
export const getUserData = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const role = req.user?.role;
    const recentSearchedCities = req.user?.recentSearchedCities;
    res.json({ success: true, role, recentSearchedCities });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ success: false, message: error.message });
    }
  }
};

export const storeRecentSearchedCities = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { recentSearchedCities } = req.body;
    const user = req.user;

    if (!user) {
      res.json({ success: false, message: "User not found" });
      return;
    }

    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCities);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCities);
    }
    await user.save();
    res.json({ success: true, message: "City added" });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ success: false, message: error.message });
    }
  }
};
