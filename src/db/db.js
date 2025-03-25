import mongoose from "mongoose";
import "colors";

export const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database".bgGreen);
  } catch (error) {
    console.log(error);
  }
};
