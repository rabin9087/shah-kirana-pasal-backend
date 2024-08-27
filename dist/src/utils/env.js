"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVariables = void 0;
const zod_1 = require("zod");
exports.envVariables = zod_1.z.object({
    MONGO_URI: zod_1.z.string(),
    JWT_ACCESS_SECRET: zod_1.z.string(),
    JWT_REFRESH_SECRET: zod_1.z.string(),
    GMAIL_APP_PASSWORD: zod_1.z.string(),
    GMAIL_USER: zod_1.z.string(),
    WEB_DOMAIN: zod_1.z.string(),
    BUCKET_NAME: zod_1.z.string(),
    REGION: zod_1.z.string(),
    ACCESS_KEY: zod_1.z.string(),
    SECRET_KEY: zod_1.z.string(),
    STRIP_SECRET: zod_1.z.string()
});
