// src/config/redisClient.ts
import { createClient } from "redis";

const redisClient = createClient({
  // url: "redis://localhost:6379", 
  // url: process.env.REDIS_DB_URI, 
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT  || 6379, 10),
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err))
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis DB Connect succesfully!")
  } catch (err) {
    console.error("❌ Redis connection error:", err);
  }
};

export { redisClient, connectRedis };