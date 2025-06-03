import mongoose from "mongoose";


export const connectMongo = async () => {
   try {
  const URI = process.env.MONGO_URI
  if (!URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }
 
    const conn = await mongoose.connect(URI as string)
    console.log("mongo connect success")
     console.log(`MongoDB Connected`);
     
  } catch (error: any) {
    console.error("MongoDB connection error:", error);
   
  }
};