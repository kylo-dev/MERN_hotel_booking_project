import mongoose, { Document, Schema } from "mongoose";

enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export interface IBooking extends Document {
  user: string;
  room: string;
  hotel: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  guests: number;
  status: BookingStatus;
  paymentMethod: string;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema<IBooking> = new Schema(
  {
    user: { type: String, ref: "User", required: true },
    room: { type: String, ref: "Room", required: true },
    hotel: { type: String, ref: "Hotel", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guests: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    paymentMethod: { type: String, required: true, default: "Pay At Hotel" },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
