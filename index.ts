import express, {

  Request,
  Response,
  Application,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { CustomError } from "./types";
import router from "./src/router/router"
import { connectMongo } from "./src/config/mongo.connect";
//For env File
dotenv.config();



connectMongo();
const app: Application = express();
const port =  Number(process.env.PORT) || 8080;
app.use(cors());
app.use(morgan("short"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
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
app.listen(port, '192.168.20.5', () => {
  console.log(`Server is running at http://192.168.20.5:${port}`);
});
