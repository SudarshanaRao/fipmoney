import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'fipmoney-test-frontend';
const REGION = process.env.AWS_REGION || 'ap-south-2';
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  console.error('❌ Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY in environment variables.');
  process.exit(1);
}

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const DIST_DIR = path.join(__dirname, 'dist');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function uploadToS3() {
  console.log(`\n🚀 Starting deployment to S3 Bucket: ${BUCKET_NAME} (${REGION})...\n`);

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ Dist folder not found at ${DIST_DIR}. Please run "npm run build" first.`);
    process.exit(1);
  }

  const allFiles = getAllFiles(DIST_DIR);
  console.log(`📦 Found ${allFiles.length} files in dist/ to upload.\n`);

  let successCount = 0;
  let failCount = 0;

  for (const filePath of allFiles) {
    const relativePath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    const fileStream = fs.createReadStream(filePath);

    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: relativePath,
        Body: fileStream,
        ContentType: contentType,
      });

      await s3Client.send(command);
      console.log(`✅ Uploaded: ${relativePath} (${contentType})`);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed to upload ${relativePath}:`, err.message);
      failCount++;
    }
  }

  console.log(`\n🎉 Deployment Complete!`);
  console.log(`✅ Successfully uploaded: ${successCount} files`);
  if (failCount > 0) {
    console.log(`⚠️ Failed uploads: ${failCount} files`);
  }
}

uploadToS3();
