"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const router_1 = __importDefault(require("./src/router/router"));
const mongo_connect_1 = require("./src/config/mongo.connect");
dotenv_1.default.config();
(0, mongo_connect_1.connectMongo)();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8080;
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("short"));
app.use(express_1.default.json());
app.get("/", (req, res) => {
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
process.env.ENVIRONMENT === "Development"
    ? app.listen(port, "192.168.20.4", () => {
        console.log(`Server is running on http://192.168.20.5:${port}`);
    })
    : app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
