import mongoose from "mongoose";

export const connectMongo = async () => {
  const URI = process.env.MONGO_URI as string;
  console.log(URI)
  try {
    const conn = await mongoose.connect(URI);
  } catch (e: Error | any) {
    throw new Error(e.message);
  }
};
