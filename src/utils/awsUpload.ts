import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const BUCKET_NAME = process.env.BUCKET_NAME as string;
const REGION = process.env.REGION as string;
const ACCESS_KEY = process.env.ACCESS_KEY as string;
const SECRET_KEY = process.env.SECRET_KEY as string;

// Initialize S3 Client
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});


// Multer S3 Storage Configuration
export const upload = multer({
  storage: multerS3({
    s3: s3Client,
      bucket: BUCKET_NAME,
     metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
      }
    // Set correct content type
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
       cb(new Error("Only image uploads are allowed!"));
    return;
    }
    cb(null, true); 
  },
});

const storage = multer.memoryStorage()

export const uploatImageS3 = multer({storage})