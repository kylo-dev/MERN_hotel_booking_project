import mongoose, { Document, Schema } from "mongoose";

enum UserRole {
  USER = "user",
  HOTEL_OWNER = "hotelOwner",
}

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  image: string;
  role: UserRole;
  recentSearchedCities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    recentSearchedCities: [{ type: String, required: true }],
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
