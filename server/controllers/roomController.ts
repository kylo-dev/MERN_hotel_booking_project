import { Request, Response } from "express";
import Hotel, { IHotel } from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";
import { CombinedRequest, AuthRequest, isError } from "../types/guards.js";

export const createRoom = async (
  req: CombinedRequest,
  res: Response
): Promise<void> => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const hotel = await Hotel.findOne({ owner: req.auth?.userId });

    if (!hotel) {
      res.json({ success: false, message: "No Hotel found" });
      return;
    }

    if (!req.files || req.files.length === 0) {
      res.json({ success: false, message: "No images uploaded" });
      return;
    }

    // upload images to Cloudinary
    const uploadImages = req.files.map(async (file: any) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    const images = await Promise.all(uploadImages);
    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });
    res.json({ success: true, message: "Room created successfully" });
  } catch (error) {
    if (isError(error)) {
      res.json({ success: false, message: error.message });
    }
  }
};

export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image",
        },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, rooms });
  } catch (error) {
    if (isError(error)) {
      res.json({ success: false, message: error.message });
    }
  }
};

export const getOwnerRooms = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const hotelData: IHotel | null = await Hotel.findOne({
      owner: req.auth?.userId,
    });
    if (!hotelData) {
      res.json({ success: false, message: "No Hotel found" });
      return;
    }

    const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate(
      "hotel"
    );
    res.json({ success: true, rooms });
  } catch (error) {
    if (isError(error)) {
      res.json({ success: false, message: error.message });
    }
  }
};

export const toggleRoomAvailability = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);

    if (!roomData) {
      res.json({ success: false, message: "Room not found" });
      return;
    }

    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({ success: true, message: "Room availability Updated" });
  } catch (error) {
    if (isError(error)) {
      res.json({ success: false, message: error.message });
    }
  }
};
