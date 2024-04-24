import express, {
  Express,
  Request,
  Response,
  Application,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { CustomError } from "./types";
import userRouter from "./src/router/user.router";
import { connectMongo } from "./src/config/mongo.connect";
//For env File
dotenv.config();
connectMongo()
const app: Application = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(morgan("short"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Welcome to Content Management System API",
  });
});

app.use("/api/v1/user", userRouter);
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
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
