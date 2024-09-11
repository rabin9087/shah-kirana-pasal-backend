import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import multerS3 from 'multer-s3'
import multer from 'multer'
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import { Request, Response, NextFunction } from "express";

    const BUCKET_NAME = process.env.BUCKET_NAME as string
    const REGION = process.env.REGION as string
    const ACCESS_KEY = process.env.ACCESS_KEY as string
const SECRET_KEY = process.env.SECRET_KEY as string
    



const client = new S3Client({
        region: REGION, credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY }
});

const storage = multer.memoryStorage()

export const uploatImageS3 = multer({storage})

 export const upload = multer({
        storage: multerS3({
            s3: client,
            bucket: BUCKET_NAME,
            metadata: function (req, file, cb) {
                let error = null
                cb(error, { filename: file.fieldname })
            },
            key: function (req, file, cb) {
                cb(null, Date.now() + "-" + file.originalname)
            }
        })
 })



    