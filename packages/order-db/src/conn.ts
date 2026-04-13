import mongoose from "mongoose";

let isConnected = false;

export const connectOrderDB = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL environment variable is not defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.error("Error connecting to order database:", error);
  }
};
