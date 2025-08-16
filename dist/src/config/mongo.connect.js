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
exports.connectMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectMongo = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const URI = process.env.MONGO_URI;
        if (!URI) {
            throw new Error("MONGO_URI is not defined in environment variables.");
        }
        const mongoOptions = {
            maxPoolSize: 20,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            autoIndex: false,
        };
        yield mongoose_1.default.connect(URI, mongoOptions);
        console.log("✅ MongoDB connected successfully");
        mongoose_1.default.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
        });
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
});
exports.connectMongo = connectMongo;
