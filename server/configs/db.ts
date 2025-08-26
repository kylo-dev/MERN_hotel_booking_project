import mongoose from "mongoose";
import { isError } from "../types/guards.js";

const connectDB = async (): Promise<void> => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/hotel`);
  } catch (error) {
    if (isError(error)) {
      console.log(error.message);
    }
  }
};

export default connectDB;
