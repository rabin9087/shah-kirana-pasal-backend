"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3bucketUpload = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const multer_1 = __importDefault(require("multer"));
const s3bucketUpload = () => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const REGION = process.env.REGION;
    const ACCESS_KEY = process.env.ACCESS_KEY;
    const SECRET_KEY = process.env.SECRET_KEY;
    const client = new client_s3_1.S3Client({
        region: REGION, credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY }
    });
    const upload = (0, multer_1.default)({
        storage: (0, multer_s3_1.default)({
            s3: client,
            bucket: BUCKET_NAME,
            metadata: function (req, file, cb) {
                let error = null;
                cb(error, { filename: file.fieldname });
            },
            key: function (req, file, cb) {
                cb(null, Date.now() + "-" + file.originalname);
            }
        })
    });
    return upload;
};
exports.s3bucketUpload = s3bucketUpload;
