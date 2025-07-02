import express, {
  Request,
  Response,
  Application,
  NextFunction,
} from "express";
// import { WebSocketServer } from 'ws';
import cors from "cors";
import morgan from "morgan";
import { CustomError } from "./types";
import router from "./src/router/router"
import { connectMongo } from "./src/config/mongo.connect";
import rateLimit from "express-rate-limit";
import { connectRedis } from "./src/utils/redis";
import dotenv from "dotenv";

dotenv.config();

//For env File
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
});


const app: Application = express();
const port =  Number(process.env.PORT) || 8080;
app.use(cors());
app.use(morgan("short"));
app.use(express.json());
app.use(limiter);
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
//     },
//   })
// );

app.get("/", (req: Request, res: Response) => {
  res.cookie("test","thisistest",{httpOnly:true,})
  res.json({
    status: "success",
    message: "Welcome to Content Management System API",
  });
});

app.use("/api/v1", router);
app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const status = error.statusCode || 500;
    const message = error.message || "Internal server Error";
    console.log(`${status}: ${message}`);
    res.status(status).json({
      status: "error",
      message,
    });
  }
);

const startServer = async () => { 
  await connectMongo();
  await connectRedis();
process.env.ENVIRONMENT === "Development"  
  ? app.listen(port, () => {
    console.log(`Server is running on http://192.168.20.4:${port}`);
    })
  : app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});