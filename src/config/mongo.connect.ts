import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectMongo = async () => {
   try {
  const URI = process.env.MONGO_URI
  if (!URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }
 
    const conn = await mongoose.connect(URI as string)
    console.log("mongo connect success")
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message);
    throw new Error(error.message);
  }
};