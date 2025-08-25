import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
  hotel: string;
  roomType: string;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema: Schema<IRoom> = new Schema(
  {
    hotel: { type: String, ref: "Hotel", required: true },
    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

const Room = mongoose.model<IRoom>("Room", roomSchema);

export default Room;
