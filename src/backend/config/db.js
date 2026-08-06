import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const FALLBACK_MONGO_URI_DEV = 'mongodb+srv://fipmoneyofficial_db_user:VluteSMvxSAjcuit@fipmoney.vgyqf0n.mongodb.net/fipmoney-dev?retryWrites=true&w=majority&appName=Fipmoney';

const connectDB = async () => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    let mongoUri = isProd 
      ? (process.env.MONGO_URI_PROD || process.env.MONGO_URI || FALLBACK_MONGO_URI_DEV) 
      : (process.env.MONGO_URI_DEV || process.env.MONGO_URI || FALLBACK_MONGO_URI_DEV);
      
    // Force the correct database name based on environment
    if (isProd && mongoUri.includes('fipmoney-dev')) {
      mongoUri = mongoUri.replace('fipmoney-dev', 'fipmoney-prod');
    } else if (!isProd && mongoUri.includes('fipmoney-prod')) {
      mongoUri = mongoUri.replace('fipmoney-prod', 'fipmoney-dev');
    }
      
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Active Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
  }
};

export default connectDB;
