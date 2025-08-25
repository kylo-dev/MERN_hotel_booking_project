import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/hotel`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("Unknown error occurred");
    }
  }
};

export default connectDB;
