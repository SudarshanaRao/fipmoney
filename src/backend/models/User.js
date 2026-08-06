import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: () => crypto.randomUUID(),
    },
    userCode: {
      type: String,
      unique: true,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      default: '',
      trim: true,
    },
    usernameLastUpdated: {
      type: Date,
      default: null,
    },
    fullName: {
      type: String,
      default: '',
    },
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: '',
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    countryCode: {
      type: String,
      default: '+91',
    },
    nationality: {
      type: String,
      default: '',
    },
    occupation: {
      type: String,
      default: '',
    },
    annualIncome: {
      type: Number,
      default: 0,
    },
    maritalStatus: {
      type: String,
      default: '',
    },
    motherName: {
      type: String,
      default: '',
    },
    fatherName: {
      type: String,
      default: '',
    },
    referralCode: {
      type: String,
      default: '',
    },
    referredBy: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'ACTIVE',
    },
    userType: {
      type: String,
      default: 'CUSTOMER',
    },
    accountLevel: {
      type: String,
      default: 'LEVEL_1',
    },
    isMobileVerified: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPasswordSet: {
      type: Boolean,
      default: true,
    },
    tpin: {
      type: String,
      default: '',
    },
    isPinSet: {
      type: Boolean,
      default: false,
    },
    isBiometricEnabled: {
      type: Boolean,
      default: false,
    },
    isFaceIdEnabled: {
      type: Boolean,
      default: false,
    },
    isFingerPrintEnabled: {
      type: Boolean,
      default: false,
    },
    isKycCompleted: {
      type: Boolean,
      default: true,
    },
    isPanVerified: {
      type: Boolean,
      default: false,
    },
    isAadhaarVerified: {
      type: Boolean,
      default: false,
    },
    isBankVerified: {
      type: Boolean,
      default: false,
    },
    isAddressVerified: {
      type: Boolean,
      default: false,
    },
    goldHoldingsGrams: {
      type: Number,
      default: 0,
    },
    silverHoldingsGrams: {
      type: Number,
      default: 0,
    },
    cashBalance: {
      type: Number,
      default: 0,
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    primaryBankAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    defaultUPIId: {
      type: String,
      default: '',
    },
    defaultPaymentMethod: {
      type: String,
      default: '',
    },
    deviceId: {
      type: String,
      default: '',
    },
    deviceName: {
      type: String,
      default: '',
    },
    deviceOS: {
      type: String,
      default: '',
    },
    deviceModel: {
      type: String,
      default: '',
    },
    appVersion: {
      type: String,
      default: '1.0.0',
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    loginCount: {
      type: Number,
      default: 1,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    isAccountLocked: {
      type: Boolean,
      default: false,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    notificationPreferences: {
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
    },
    language: {
      type: String,
      default: 'en',
    },
    theme: {
      type: String,
      default: 'LIGHT',
    },
    riskCategory: {
      type: String,
      default: 'LOW',
    },
    kycLevel: {
      type: String,
      default: 'FULL',
    },
    consents: {
      termsAccepted: { type: Boolean, default: true },
      privacyAccepted: { type: Boolean, default: true },
      marketingConsent: { type: Boolean, default: false },
      accountAggregatorConsent: { type: Boolean, default: false },
    },
    vid: {
      type: String,
      default: '',
    },
    createdBy: {
      type: String,
      default: 'SYSTEM',
    },
    updatedBy: {
      type: String,
      default: 'SYSTEM',
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

const User = mongoose.model('User', userSchema);

export default User;
