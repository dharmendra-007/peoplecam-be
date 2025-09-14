// utils/s3.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY,
    secretAccessKey: process.env.MY_AWS_SECRET_KEY,
  },
});

/**
 * Upload file to S3 bucket
 * @param {Express.Multer.File} file
 * @param {string} folder
 * @returns {Promise<string>} File URL
 */
export const uploadFile = async (file, folder) => {
  const fileName = `${folder}/${uuidv4()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.MY_AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  // Construct file URL manually
  return `https://${process.env.MY_AWS_BUCKET_NAME}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/${fileName}`;
};
