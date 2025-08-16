import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    const URI = process.env.MONGO_URI;
    if (!URI) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    // Recommended connection options for performance & stability
    const mongoOptions: mongoose.ConnectOptions = {
      maxPoolSize: 20, // allow more concurrent connections
      serverSelectionTimeoutMS: 5000, // fail fast if DB server is unavailable
      socketTimeoutMS: 45000, // close idle sockets
      autoIndex: false, // disable auto-indexing in production for faster startup
    };

    await mongoose.connect(URI, mongoOptions);
    console.log("✅ MongoDB connected successfully");

    // Optional: Log connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // exit app if DB is unavailable
  }
};