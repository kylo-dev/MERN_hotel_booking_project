import { Request, Response } from "express";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

interface AuthRequest extends Request {
  user?: any;
  body: any;
}

export const registerHotel = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user?._id;

    if (!owner) {
      res.json({ success: false, message: "User not found" });
      return;
    }

    const hotel = await Hotel.findOne({ owner });
    if (hotel) {
      res.json({ success: false, message: "Hotel Already Registered" });
      return;
    }

    await Hotel.create({ name, address, contact, city, owner });
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({ success: true, message: "Hotel Registered Successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ success: false, message: error.message });
    }
  }
};
