import express, {
  Request,
  Response,
  Application,
  NextFunction,
} from "express";
import { WebSocketServer } from 'ws';
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { CustomError } from "./types";
import router from "./src/router/router"
import { connectMongo } from "./src/config/mongo.connect";
import helmet from 'helmet'
//For env File
// dotenv.config();

connectMongo();
const app: Application = express();
const port =  Number(process.env.PORT) || 8080;
app.use(cors());
app.use(morgan("short"));
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
    },
  })
);

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

process.env.ENVIRONMENT === "Development"  
  ? app.listen(port, () => {
      console.log(`Server is running on http://192.168.20.4:${port}`);
    })
  : app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

// process.env.ENVIRONMENT === "Development"
//   ? app.listen(port, "192.168.20.4", () => {
//       console.log(`Server is running on http://192.168.20.4:${port}`);
//     })
//   : app.listen(port, () => {
//       console.log(`Server is running on http://localhost:${port}`);
//     });
