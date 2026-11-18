import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const UserSchema = new mongoose.Schema({}, { strict: false });

const dummyUserData = {
  userId: 'usr_demo_googleplay_001',
  userCode: 'FIPDEMO01',
  mobileNumber: '9999999999',
  email: 'googleplay.tester@fipmoney.com',
  username: 'demouser',
  fullName: 'Google Play Tester',
  firstName: 'Google',
  lastName: 'Tester',
  countryCode: '+91',
  nationality: 'Indian',
  status: 'ACTIVE',
  userType: 'CUSTOMER',
  accountLevel: 'LEVEL_2',
  isMobileVerified: true,
  isEmailVerified: true,
  isPasswordSet: true,
  isPinSet: true,
  tpin: crypto.createHash('sha256').update('1234').digest('hex'),
  isKycCompleted: true,
  isPanVerified: true,
  isAadhaarVerified: true,
  isBankVerified: true,
  isAddressVerified: true,
  cashBalance: 25000,
  goldHoldingsGrams: 0.5000,
  silverHoldingsGrams: 25.0000,
  bankAccount: {
    bankName: 'HDFC Bank',
    accountNumber: '999912345678',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Google Play Tester',
    isVerified: true
  },
  defaultUPIId: 'demouser@fipmoney',
  updatedAt: new Date(),
  createdAt: new Date()
};

async function seedDatabase(uri, dbName) {
  try {
    console.log(`\n--- Connecting to ${dbName} ---`);
    const conn = await mongoose.createConnection(uri).asPromise();
    const User = conn.model('User', UserSchema, 'users');

    const existing = await User.findOne({ mobileNumber: '9999999999' });
    if (existing) {
      await User.updateOne({ mobileNumber: '9999999999' }, { $set: dummyUserData });
      console.log(`[${dbName}] Updated existing dummy user: 9999999999`);
    } else {
      await User.create(dummyUserData);
      console.log(`[${dbName}] Created new dummy user: 9999999999`);
    }

    const verified = await User.findOne({ mobileNumber: '9999999999' }, 'mobileNumber fullName email cashBalance goldHoldingsGrams');
    console.log(`[${dbName}] Verified dummy user:`, verified);
    await conn.close();
  } catch (err) {
    console.error(`[${dbName}] Error:`, err.message);
  }
}

async function run() {
  if (process.env.MONGO_URI_DEV) {
    await seedDatabase(process.env.MONGO_URI_DEV, 'fipmoney-dev');
  }
  if (process.env.MONGO_URI_PROD) {
    await seedDatabase(process.env.MONGO_URI_PROD, 'fipmoney-prod');
  }
  console.log('\nSeed process finished.');
  process.exit(0);
}

run();

