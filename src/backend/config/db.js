import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const FALLBACK_MONGO_URI = 'mongodb+srv://fipmoneyofficial_db_user:VluteSMvxSAjcuit@fipmoney.vgyqf0n.mongodb.net/fipmoney-dev?retryWrites=true&w=majority&appName=Fipmoney';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || FALLBACK_MONGO_URI;
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Active Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
  }
};

export default connectDB;
