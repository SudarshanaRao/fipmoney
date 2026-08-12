import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

// Initialize S3 Client
// If credentials and region aren't provided explicitly, the SDK automatically pulls from process.env (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION).
// We'll use the user specified region 'ap-south-2' or let env take over if not specified here.
let s3Client;

const getS3Client = () => {
  if (!s3Client) {
    const region = process.env.AWS_REGION || 'ap-south-2';
    s3Client = new S3Client({
      region: region,
    });
  }
  return s3Client;
};

export const uploadProfileImageToS3 = async (fileBuffer, mimeType, userId) => {
  const fileExtension = mimeType ? mimeType.split('/')[1] || 'jpg' : 'jpg';
  const base64Url = `data:${mimeType || 'image/jpeg'};base64,${fileBuffer.toString('base64')}`;

  try {
    const bucketName = process.env.AWS_S3_BUCKET || 'www.fipmoney.com';
    const folder = 'fipmoney-profile-images';
    const timestamp = Date.now();
    const fileName = `${folder}/${userId}-${timestamp}-${crypto.randomBytes(4).toString('hex')}.${fileExtension}`;

    const client = getS3Client();
    const region = process.env.AWS_REGION || 'ap-south-2';

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await client.send(command);
    return `https://s3.${region}.amazonaws.com/${bucketName}/${fileName}`;
  } catch (err) {
    console.warn('[ProfileImageUpload] AWS S3 upload failed or not configured. Using high-reliability image data URL fallback:', err.message);
    return base64Url;
  }
};
