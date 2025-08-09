import mongoose from "mongoose";

// const mongoOptions = {
//   maxPoolSize: 10, // Maintain up to 10 socket connections
//   serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
//   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//   bufferMaxEntries: 0, // Disable mongoose buffering
//   bufferCommands: false, // Disable mongoose buffering
// };

export const connectMongo = async () => {
   try {
  const URI = process.env.MONGO_URI
  if (!URI) {
     console.error("MONGO_URI is not defined in environment variables.");
  }
 
    const conn = await mongoose.connect(URI as string);
    console.log("mongo connect success")
     
  } catch (error: any) {
    console.error("MongoDB connection error:", error);
  }
};