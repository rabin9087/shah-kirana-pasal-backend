import { S3Client } from '@aws-sdk/client-s3'
import multerS3 from 'multer-s3'
import multer from 'multer'

export const s3bucketUpload = () => {

    const BUCKET_NAME = process.env.BUCKET_NAME
    const REGION = process.env.REGION
    const ACCESS_KEY = process.env.ACCESS_KEY
    const SECRET_KEY = process.env.SECRET_KEY

    // s3 bucket upload config
    const client = new S3Client({
        region: REGION, credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY }
    });

    const upload = multer({
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
    return upload
}