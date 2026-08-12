import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

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

const USER_ASSETS_BUCKET = process.env.AWS_USER_ASSETS_BUCKET || process.env.S3_USER_ASSETS_BUCKET || 'fipmoney-test-user-assets';

/**
 * Generate Presigned Upload PUT URL for direct frontend -> private S3 upload
 */
export const generatePresignedUploadUrl = async (userId, contentType = 'image/jpeg') => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const cleanContentType = allowedTypes.includes(contentType) ? contentType : 'image/jpeg';
  const ext = cleanContentType.split('/')[1] || 'webp';

  const objectKey = `users/${userId}/profile/${crypto.randomUUID()}.${ext}`;
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: USER_ASSETS_BUCKET,
    Key: objectKey,
    ContentType: cleanContentType,
  });

  // URL valid for 15 minutes
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });

  return {
    uploadUrl,
    objectKey,
    bucket: USER_ASSETS_BUCKET,
    contentType: cleanContentType,
  };
};

/**
 * Generate Presigned GET View URL for private S3 object
 */
export const generatePresignedViewUrl = async (objectKey) => {
  if (!objectKey) return '';
  if (objectKey.startsWith('http://') || objectKey.startsWith('https://') || objectKey.startsWith('data:')) {
    return objectKey; // Return direct URL or Base64 fallback if stored
  }

  try {
    const client = getS3Client();
    const command = new GetObjectCommand({
      Bucket: USER_ASSETS_BUCKET,
      Key: objectKey,
    });

    // Signed URL valid for 60 minutes
    return await getSignedUrl(client, command, { expiresIn: 3600 });
  } catch (err) {
    console.warn('[PresignedViewUrl] Failed to sign GET URL:', err.message);
    return '';
  }
};

/**
 * Delete old profile image from private S3 bucket
 */
export const deleteObjectFromS3 = async (objectKey) => {
  if (!objectKey || objectKey.startsWith('http') || objectKey.startsWith('data:')) return;
  try {
    const client = getS3Client();
    const command = new DeleteObjectCommand({
      Bucket: USER_ASSETS_BUCKET,
      Key: objectKey,
    });
    await client.send(command);
  } catch (err) {
    console.warn('[DeleteObjectFromS3] Failed to delete object:', err.message);
  }
};

export const uploadProfileImageToS3 = async (fileBuffer, mimeType, userId) => {
  const fileExtension = mimeType ? mimeType.split('/')[1] || 'jpg' : 'jpg';
  const base64Url = `data:${mimeType || 'image/jpeg'};base64,${fileBuffer.toString('base64')}`;

  try {
    const timestamp = Date.now();
    const fileName = `users/${userId}/profile/${timestamp}-${crypto.randomBytes(4).toString('hex')}.${fileExtension}`;

    const client = getS3Client();

    const command = new PutObjectCommand({
      Bucket: USER_ASSETS_BUCKET,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await client.send(command);
    return fileName;
  } catch (err) {
    console.warn('[ProfileImageUpload] AWS S3 upload fallback:', err.message);
    return base64Url;
  }
};
