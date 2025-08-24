import mongoose from "mongoose";

const userShema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, enum: ["user", "hotelOwner"], default: "user" }, // ENUM
    recentSearchedCities: [{ type: String, required: true }], // Array
  },
  { timestamps: true }
);

const User = mongoose.model("User", userShema);

export default User;
