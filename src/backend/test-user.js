import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne();
  console.log(user?.mobileNumber);
  process.exit(0);
}
run();
