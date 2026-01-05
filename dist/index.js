"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const router_1 = __importDefault(require("./src/router/router"));
const mongo_connect_1 = require("./src/config/mongo.connect");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const redis_1 = require("./src/utils/redis");
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100,
});
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8080;
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("short"));
app.use(express_1.default.json());
app.use(limiter);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
    }
});
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("message", (data) => {
        console.log("Message:", data);
        io.emit("message", data);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
app.get("/", (req, res) => {
    res.cookie("test", "test", { httpOnly: true, });
    res.json({
        status: "success",
        message: "Welcome to Content Management System API",
    });
});
app.use("/api/v1", router_1.default);
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message || "Internal server Error";
    console.log(`${status}: ${message}`);
    res.status(status).json({
        status: "error",
        message,
    });
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongo_connect_1.connectMongo)();
    yield (0, redis_1.connectRedis)();
    server.listen(port, () => {
        if (process.env.ENVIRONMENT === "Development") {
            console.log(`Server running at http://192.168.20.4:${port}`);
        }
        else {
            console.log(`Server running at http://localhost:${port}`);
        }
    });
});
startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
