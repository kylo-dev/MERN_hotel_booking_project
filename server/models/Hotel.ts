import mongoose, { Document, Schema } from "mongoose";

export interface IHotel extends Document {
  name: string;
  address: string;
  contact: string;
  owner: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

const hotelSchema: Schema<IHotel> = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    owner: { type: String, required: true, ref: "User" },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

const Hotel = mongoose.model<IHotel>("Hotel", hotelSchema);

export default Hotel;
