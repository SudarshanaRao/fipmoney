import mongoose from 'mongoose';
import User from './models/User.js';
import VaultTransaction from './models/VaultTransaction.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function seedDummyReferral() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // 1. Find User FIP0001
    let fip0001 = await User.findOne({ userCode: 'FIP0001' });
    if (!fip0001) {
      console.log('User FIP0001 not found. Attempting by case insensitive search...');
      fip0001 = await User.findOne({ userCode: { $regex: /^FIP0001$/i } });
      if (!fip0001) {
          console.error('Cannot find user FIP0001 in the database.');
          process.exit(1);
      }
    }

    // Ensure FIP0001 has a referral code
    if (!fip0001.referralCode) {
      fip0001.referralCode = 'FIP' + crypto.randomBytes(3).toString('hex').toUpperCase();
      await fip0001.save();
      console.log('Generated referral code for FIP0001:', fip0001.referralCode);
    } else {
      console.log('FIP0001 referral code is:', fip0001.referralCode);
    }

    // 2. Create Dummy User
    const dummyMobile = '9999900000';
    const dummyUser = await User.findOneAndUpdate(
      { mobileNumber: dummyMobile },
      {
        userId: crypto.randomUUID(),
        userCode: 'FIP9999',
        mobileNumber: dummyMobile,
        username: 'Sudarshan dummy friend',
        firstName: 'Sudarshan',
        lastName: 'Dummy',
        referredBy: fip0001.referralCode,
        status: 'ACTIVE',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('Dummy user created/updated:', dummyUser.mobileNumber);

    // 3. Create Dummy Vault Transaction (Purchase > 250)
    await VaultTransaction.findOneAndUpdate(
      { mobileNumber: dummyMobile, type: 'BUY', metal: 'GOLD' },
      {
        txId: 'FIP' + Math.floor(100000 + Math.random() * 900000),
        mobileNumber: dummyMobile,
        type: 'BUY',
        metal: 'GOLD',
        amount: 500,
        grams: 0.07,
        ratePerGram: 7000,
        status: 'SUCCESS'
      },
      { upsert: true, new: true }
    );
    console.log('Dummy VaultTransaction (₹500 Gold Buy) created for Dummy User');

    console.log('Successfully seeded dummy referral for FIP0001!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedDummyReferral();
