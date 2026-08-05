import 'dotenv/config';
import { uploadProfileImageToS3 } from './src/backend/utils/s3Uploader.js';

async function test() {
  try {
    const buffer = Buffer.from('hello world', 'utf-8');
    const url = await uploadProfileImageToS3(buffer, 'image/jpeg', 'test-user-id');
    console.log('Success:', url);
  } catch (err) {
    console.error('Upload Error:', err);
  }
}

test();
