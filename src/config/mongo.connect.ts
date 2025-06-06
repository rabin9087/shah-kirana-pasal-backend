import mongoose from "mongoose";


export const connectMongo = async () => {
   try {
  const URI = process.env.MONGO_URI
  if (!URI) {
     console.error("MONGO_URI is not defined in environment variables.");
  }
 
    const conn = await mongoose.connect(URI as string)
    console.log("mongo connect success")
     
  } catch (error: any) {
    console.error("MongoDB connection error:", error);
  }
};