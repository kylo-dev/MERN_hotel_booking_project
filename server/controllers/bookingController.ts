import { Request, Response } from "express";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { isAuthRequest, isError } from "../types/guards.js";

interface AvailabilityRequest {
  checkInDate: string;
  checkOutDate: string;
  room: string;
}

const checkAvailability = async ({
  checkInDate,
  checkOutDate,
  room,
}: AvailabilityRequest): Promise<boolean | undefined> => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    if (isError(error)) {
      console.log(error.message);
    }
  }
};

export const checkAvailabilityAPI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    if (isError(error)) {
      res.json({ success: false, message: error.message });
    }
  }
};

export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 타입 가드를 사용하여 AuthRequest로 변환
    if (!isAuthRequest(req)) {
      res.json({ success: false, message: "Invalid request type" });
      return;
    }

    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user?._id;

    if (!user) {
      res.json({ success: false, message: "User not found" });
      return;
    }

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      res.json({ success: false, message: "Room is not available" });
      return;
    }

    // Get totalPrice from Room
    const roomData = await Room.findById(room).populate("hotel");

    if (!roomData) {
      res.json({ success: false, message: "Room not found" });
      return;
    }

    // Calculate totalPrice based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const totalPrice = roomData.pricePerNight * nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: (roomData.hotel as any)._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    if (isError(error)) {
      console.log(error.message);
    }
    res.json({ success: false, message: "Failed to create booking" });
  }
};

export const getUserBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 타입 가드를 사용하여 AuthRequest로 변환
    if (!isAuthRequest(req)) {
      res.json({ success: false, message: "Invalid request type" });
      return;
    }

    const user = req.user?._id;
    if (!user) {
      res.json({ success: false, message: "User not found" });
      return;
    }

    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

export const getHotelBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 타입 가드를 사용하여 AuthRequest로 변환
    if (!isAuthRequest(req)) {
      res.json({ success: false, message: "Invalid request type" });
      return;
    }

    const hotel = await Hotel.findOne({ owner: req.auth?.userId });
    if (!hotel) {
      res.json({ success: false, message: "No Hotel found" });
      return;
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (acc: number, booking: any) => acc + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};
