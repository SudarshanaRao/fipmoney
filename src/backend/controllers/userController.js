import crypto from 'crypto';
import User from '../models/User.js';
import VirtualCard from '../models/VirtualCard.js';
import VaultTransaction from '../models/VaultTransaction.js';
import Otp from '../models/Otp.js';
import Referral from '../models/Referral.js';
import { generateUniqueCardDetails } from '../utils/cardGenerator.js';
import { uploadProfileImageToS3, generatePresignedUploadUrl, generatePresignedViewUrl, deleteObjectFromS3 } from '../utils/s3Uploader.js';
import { initializeUserAml, updateKycAmlScore, evaluateTransactionAml } from '../utils/amlEvaluator.js';
import { sendTemplatedEmail } from '../utils/emailService.js';

async function sendSmsOtp(mobile, otpCode) {
  const authKey = process.env.SMSCOUNTRY_AUTH_KEY;
  const authToken = process.env.SMSCOUNTRY_AUTH_TOKEN;
  const senderId = process.env.SMSCOUNTRY_SENDER_ID || "FIPMNY";
  
  // If credentials are missing, log mock OTP
  if (!authKey || !authToken) {
    console.log(`[SMS Mock Fallback - No Credentials] OTP for ${mobile} is ${otpCode}`);
    return;
  }

  const credentials = Buffer.from(`${authKey}:${authToken}`).toString('base64');
  const endpoint = `https://restapi.smscountry.com/v0.1/Accounts/${authKey}/SMSes/`;
  
  const messageText = `Dear User, Your Fipmoney verification code is ${otpCode} . Valid for 10 minutes. Never share this OTP with anyone. - Finpages Tech`;

  const payload = {
    Text: messageText,
    Number: `91${mobile}`,
    SenderId: senderId,
    Tool: "API",
    TemplateId: "1277178522852542862",
    DLT_TE_ID: "1277178522852542862" // Some endpoints use this key for DLT
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log(`[SMSCountry] Send response:`, result);
  } catch (err) {
    console.error(`[SMSCountry Error] Failed to send SMS:`, err.message);
  }
}

// 256-bit SSL/TLS Encryption helper for password
const AES_SECRET_KEY = process.env.AES_SECRET_KEY || 'fipmoney_256bit_ssl_encryption_key_32b'; // 32 bytes = 256 bits

export function encryptPassword256(plainPassword) {
  if (!plainPassword) return '';
  try {
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(AES_SECRET_KEY.padEnd(32).slice(0, 32));
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(plainPassword, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `enc256:${iv.toString('hex')}:${encrypted}`;
  } catch (err) {
    // 256-bit SHA-256 fallback
    return 'sha256:' + crypto.createHash('sha256').update(plainPassword).digest('hex');
  }
}

export function encryptData256(plainText) {
  if (!plainText) return '';
  try {
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(AES_SECRET_KEY.padEnd(32).slice(0, 32));
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(String(plainText), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `enc256:${iv.toString('hex')}:${encrypted}`;
  } catch (err) {
    console.error('Encryption error:', err);
    return '';
  }
}

export function decryptData256(encryptedText) {
  if (!encryptedText || !encryptedText.startsWith('enc256:')) return encryptedText;
  try {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[1], 'hex');
    const encryptedData = parts[2];
    const key = Buffer.from(AES_SECRET_KEY.padEnd(32).slice(0, 32));
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err);
    return '';
  }
}

export function hashData256(plainText) {
  if (!plainText) return '';
  return crypto.createHash('sha256').update(String(plainText)).digest('hex');
}

// @desc    Check if username is taken
// @route   POST /api/users/check-username
export const checkUsername = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }
    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    return res.status(200).json({ success: true, available: !user });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if referral code is valid
// @route   POST /api/users/check-referral
export const checkReferral = async (req, res, next) => {
  try {
    const { referralCode } = req.body;
    if (!referralCode || referralCode.length < 5) {
      return res.status(400).json({ success: false, message: 'Invalid referral code' });
    }
    
    const cleanCode = String(referralCode).trim();
    const user = await User.findOne({ 
      $or: [
        { referralCode: new RegExp(`^${cleanCode}$`, 'i') },
        { userCode: new RegExp(`^${cleanCode}$`, 'i') },
        { username: new RegExp(`^${cleanCode}$`, 'i') }
      ]
    });
    
    if (user) {
      return res.status(200).json({ success: true, valid: true, referrerName: user.username || user.fullName || 'User' });
    } else {
      return res.status(200).json({ success: true, valid: false });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Check if mobile number exists in database
// @route   POST /api/users/check-mobile
export const checkMobile = async (req, res, next) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      res.status(400);
      throw new Error('Mobile number is required');
    }

    const cleanMobile = String(mobile).trim();
    const user = await User.findOne({ mobileNumber: cleanMobile });

    if (user) {
      return res.status(200).json({
        success: true,
        exists: true,
        message: 'User exists in database'
      });
    } else {
      return res.status(200).json({
        success: true,
        exists: false,
        message: 'New user - mobile number not registered yet',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Generate and send OTP
// @route   POST /api/users/send-otp
export const sendOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      res.status(400);
      throw new Error('Mobile number is required');
    }

    const cleanMobile = String(mobile).trim();
    
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.findOneAndUpdate(
      { mobileNumber: cleanMobile },
      { otp: generatedOtp, createdAt: new Date() },
      { upsert: true, new: true }
    );
    
    sendSmsOtp(cleanMobile, generatedOtp).catch(err => console.error('[SMS error]', err));
    
    return res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
export const verifyOtp = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      res.status(400);
      throw new Error('Mobile number and OTP are required');
    }

    const cleanMobile = String(mobile).trim();

    const otpRecord = await Otp.findOne({ mobileNumber: cleanMobile });
    if (!otpRecord) {
      res.status(400);
      throw new Error('OTP expired or not found. Please request a new one.');
    }

    if (otpRecord.otp !== String(otp).trim()) {
      res.status(400);
      throw new Error('Invalid OTP code.');
    }

    // Delete OTP after successful verification so it can't be reused
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate and send Email OTP for Email Change verification
// @route   POST /api/users/send-email-otp
export const sendEmailOtp = async (req, res, next) => {
  try {
    const { email, userName } = req.body;
    if (!email || !email.includes('@')) {
      res.status(400);
      throw new Error('Valid email address is required');
    }

    const cleanEmail = email.trim().toLowerCase();
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      { email: cleanEmail, otp: generatedOtp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send email using Fipmoney OTP Verification email template via Zoho ZeptoMail
    const senderEmail = req.body.fromEmail || 'support@fipmoney.com';
    const mailResult = await sendTemplatedEmail({
      toEmail: cleanEmail,
      templateId: 'FIPMONEY_OTP_VERIFICATION',
      fromEmail: senderEmail,
      variables: {
        userName: userName || 'Valued User',
        verificationCode: generatedOtp,
        otp: generatedOtp,
        expiryMinutes: 5,
        currentYear: new Date().getFullYear(),
        supportEmail: 'support@fipmoney.com',
        mobileNumber: req.body.mobileNumber || '',
        referralCode: 'FIP2026',
      },
    });

    console.log(`[Email OTP] Verification code ${generatedOtp} sent to ${cleanEmail}`);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Email OTP
// @route   POST /api/users/verify-email-otp
export const verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400);
      throw new Error('Email address and OTP code are required');
    }

    const cleanEmail = email.trim().toLowerCase();
    const otpRecord = await Otp.findOne({ email: cleanEmail });

    if (!otpRecord) {
      res.status(400);
      throw new Error('OTP expired or not found. Please request a new verification code.');
    }

    if (otpRecord.otp !== String(otp).trim()) {
      res.status(400);
      throw new Error('Invalid OTP code. Please check and try again.');
    }

    // Delete OTP after successful verification so it can't be reused
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({ success: true, message: 'Email OTP verified successfully' });
  } catch (error) {
    next(error);
  }
};

const sanitizeMobile = (val) => {
  if (!val) return '';
  const str = String(val).trim();
  if (str.startsWith('enc256:')) return '';
  const digits = str.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : str;
};

const maskMobile = (mobile) => {
  if (!mobile) return '';
  const str = String(mobile).trim();
  if (str.length < 10) return str;
  return `${str.slice(0, 2)}******${str.slice(-2)}`;
};

const getAuthMinimalUser = (userDoc) => {
  const obj = userDoc.toObject ? userDoc.toObject() : userDoc;
  const rawMobile = obj.mobileNumber || '';
  return {
    userId: obj.userId,
    userCode: obj.userCode,
    mobileNumber: rawMobile,
    maskedMobile: maskMobile(rawMobile),
    email: obj.email || '',
    username: obj.username || '',
    fullName: obj.fullName || obj.username || obj.firstName || '',
    status: obj.status || 'ACTIVE',
    isKycCompleted: Boolean(obj.isKycCompleted),
    referralCode: obj.referralCode || ''
  };
};

const getSafeUser = (userDoc) => {
  const obj = userDoc.toObject ? userDoc.toObject() : userDoc;
  const rawMobile = obj.mobileNumber || '';
  return {
    userId: obj.userId,
    userCode: obj.userCode,
    username: obj.username,
    firstName: obj.firstName,
    lastName: obj.lastName,
    fullName: obj.fullName || obj.username || obj.firstName || '',
    mobileNumber: rawMobile,
    maskedMobile: maskMobile(rawMobile),
    email: obj.email,
    profileImage: obj.profileImage,
    isKycCompleted: obj.isKycCompleted,
    kycLevel: obj.kycLevel,
    status: obj.status,
    isMobileVerified: obj.isMobileVerified,
    isEmailVerified: obj.isEmailVerified,
    referralCode: obj.referralCode,
    amlScore: obj.amlScore !== undefined ? obj.amlScore : (obj.amtScore !== undefined ? obj.amtScore : (obj.isKycCompleted ? 85 : 45)),
    amlStatus: obj.amlStatus || obj.amtStatus || (obj.isKycCompleted ? 'Low Risk' : 'Moderate Risk'),
    amlFlaggedReasons: obj.amlFlaggedReasons || obj.amtFlaggedReasons || []
  };
};

const generateUniqueReferralCode = async (User) => {
  let isUnique = false;
  let code = '';
  while (!isUnique) {
    code = crypto.randomBytes(3).toString('hex').toUpperCase(); // Random 6 character string
    const existing = await User.findOne({ referralCode: code });
    if (!existing) {
      isUnique = true;
    }
  }
  return code;
};

// @desc    Register or Login User
// @route   POST /api/users/auth
export const authUser = async (req, res, next) => {
  try {
    const { mobile, username, fullName, tpin, email, dateOfBirth, referredBy } = req.body;

    if (!mobile) {
      res.status(400);
      throw new Error('Mobile number is required');
    }

    const cleanMobile = String(mobile).trim();
    let user = await User.findOne({ mobileNumber: cleanMobile });

    if (user) {
      // User exists -> Update last login info and increment loginCount
      user.lastLoginAt = new Date();
      user.lastActiveAt = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      if (dateOfBirth) {
        user.dateOfBirth = dateOfBirth;
      }

      // Generate a random unique referral code if missing
      if (!user.referralCode || user.referralCode.startsWith('FIP0')) {
        user.referralCode = await generateUniqueReferralCode(User);
      }

      // Retroactively generate virtual card if missing
      if (!user.vid) {
        const cardDetails = await generateUniqueCardDetails();
        const nameOnCard = user.fullName || "Fipmoney User";
        
        const generatedVid = crypto.randomUUID();
        await VirtualCard.create({
          vid: generatedVid,
          userId: user.userId,
          cardNumber: encryptData256(cardDetails.cardNumber),
          cardHash: cardDetails.cardHash,
          detailsHash: cardDetails.detailsHash,
          expiry: encryptData256(cardDetails.expiry),
          nameOnCard: encryptData256(nameOnCard),
          cvv: encryptData256(cardDetails.cvv),
          balance: 0,
          isGenerated: true
        });

        user.vid = generatedVid;
      }

      await user.save();

      res.cookie('fm_userid', user.userId, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false });

      return res.status(200).json({
        success: true,
        message: 'User authenticated successfully',
        data: getAuthMinimalUser(user),
      });
    } else {
      // Auto-generate userCode starting from #FIP0001 series based on DB count
      const count = await User.countDocuments();
      const nextIndex = count + 1;
      const generatedUserCode = `FIP${String(nextIndex).padStart(4, '0')}`;
      const generatedUserId = crypto.randomUUID();

      const finalName = username || fullName || '';
      const nameParts = finalName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // No password generated as we are removing passwords
      const cardDetails = await generateUniqueCardDetails();
      const nameOnCard = finalName || "Fipmoney User";

      const generatedVid = crypto.randomUUID();

      let finalReferredBy = '';
      let referrerMobile = '';
      if (referredBy) {
        const cleanRefCode = String(referredBy).trim();
        const referrer = await User.findOne({
          $or: [
            { referralCode: new RegExp(`^${cleanRefCode}$`, 'i') },
            { userCode: new RegExp(`^${cleanRefCode}$`, 'i') },
            { username: new RegExp(`^${cleanRefCode}$`, 'i') }
          ]
        });
        if (referrer) {
          finalReferredBy = referrer.referralCode;
          referrerMobile = referrer.mobileNumber;
        }
      }

      await VirtualCard.create({
        vid: generatedVid,
        userId: generatedUserId,
        cardNumber: encryptData256(cardDetails.cardNumber),
        cardHash: cardDetails.cardHash,
        detailsHash: cardDetails.detailsHash,
        expiry: encryptData256(cardDetails.expiry),
        nameOnCard: encryptData256(nameOnCard),
        cvv: encryptData256(cardDetails.cvv),
        balance: 0,
        isGenerated: true
      });

      const initialAml = initializeUserAml(false);

      user = await User.create({
        userId: generatedUserId,
        userCode: generatedUserCode,
        vid: generatedVid,
        mobileNumber: cleanMobile,
        email: email || '',
        username: finalName,
        fullName: '',
        firstName,
        lastName,
        profileImage: '',
        gender: '',
        dateOfBirth: dateOfBirth || null,
        countryCode: '+91',
        nationality: '',
        occupation: '',
        annualIncome: 0,
        maritalStatus: '',
        motherName: '',
        fatherName: '',
        referralCode: await generateUniqueReferralCode(User),
        referredBy: finalReferredBy,
        status: 'ACTIVE',
        userType: 'CUSTOMER',
        accountLevel: 'LEVEL_1',
        isMobileVerified: true,
        isEmailVerified: false,
        amlScore: initialAml.amlScore,
        amlStatus: initialAml.amlStatus,
        amlFlaggedReasons: initialAml.amlFlaggedReasons,
        amtScore: initialAml.amlScore,
        amtStatus: initialAml.amlStatus,
        amtFlaggedReasons: initialAml.amlFlaggedReasons,
        isPasswordSet: true,
        tpin: tpin ? hashData256(tpin) : '',
        isPinSet: !!tpin,
        isBiometricEnabled: false,
        isFaceIdEnabled: false,
        isFingerPrintEnabled: false,
        isKycCompleted: false,
        isPanVerified: false,
        isAadhaarVerified: false,
        isBankVerified: false,
        isAddressVerified: false,
        walletId: null,
        primaryBankAccountId: null,
        defaultUPIId: '',
        defaultPaymentMethod: '',
        deviceId: '',
        deviceName: '',
        deviceOS: '',
        deviceModel: '',
        appVersion: '1.0.0',
        lastLoginAt: new Date(),
        lastActiveAt: new Date(),
        loginCount: 1,
        failedLoginAttempts: 0,
        isAccountLocked: false,
        lockUntil: null,
        notificationPreferences: {
          push: true,
          sms: true,
          email: true,
          whatsapp: false,
        },
        language: 'en',
        theme: 'LIGHT',
        riskCategory: 'LOW',
        kycLevel: 'FULL',
        consents: {
          termsAccepted: true,
          privacyAccepted: true,
          marketingConsent: false,
          accountAggregatorConsent: false,
        },
        virtualCard: {
          cardNumber: encryptData256(cardDetails.cardNumber),
          expiry: encryptData256(cardDetails.expiry),
          nameOnCard: encryptData256(nameOnCard),
          cvv: encryptData256(cardDetails.cvv),
          balance: 0,
          isGenerated: true
        },
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      });

      if (finalReferredBy && referrerMobile) {
        await Referral.create({
          referrerMobile: referrerMobile,
          refereeMobile: cleanMobile,
          referralCodeUsed: finalReferredBy,
          status: 'JOINED'
        });
      }

      // Trigger Signup Welcome Email
      sendTemplatedEmail({
        toEmail: user.email || `${cleanMobile}@fipmoney.com`,
        templateId: 'WELCOME_SIGNUP',
        variables: {
          userName: user.fullName || user.username || 'Valued Member',
          mobileNumber: cleanMobile,
          referralCode: user.referralCode,
        },
      }).catch((err) => console.error('[Signup Email Dispatch Error]', err));

      res.cookie('fm_userid', user.userId, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false });

      return res.status(201).json({
        success: true,
        message: 'New user created successfully with 256-bit encrypted password, userCode and UUID userId',
        data: getAuthMinimalUser(user),
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users in database
// @route   GET /api/users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's encrypted virtual card
// @route   GET /api/users/card
export const getUserCard = async (req, res, next) => {
  try {
    const userId = req.cookies.fm_userid || req.query.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const virtualCard = await VirtualCard.findOne({ userId });
    if (!virtualCard || !virtualCard.isGenerated) {
      return res.status(404).json({ success: false, message: 'Virtual card not found' });
    }
    
    const payload = JSON.stringify(virtualCard);
    const encryptedBlob = encryptData256(payload);

    return res.status(200).json({ success: true, encryptedData: encryptedBlob });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vault and portfolio summary by mobile number
// @route   GET /api/users/vault/summary
export const getVaultSummary = async (req, res, next) => {
  try {
    const mobile = req.query.mobile || req.params.mobile;
    if (!mobile) {
      res.status(400);
      throw new Error('Mobile number is required');
    }

    const cleanMobile = String(mobile).trim();
    let user = await User.findOne({ mobileNumber: cleanMobile });

    if (!user) {
      user = {
        goldHoldingsGrams: 0,
        silverHoldingsGrams: 0,
        cashBalance: 0,
      };
    }

    const goldPrice = 6420.50;
    const silverPrice = 84.20;

    const goldGrams = user.goldHoldingsGrams || 0;
    const silverGrams = user.silverHoldingsGrams || 0;
    const cashBalance = user.cashBalance || 0;

    const goldVaultValue = Number((goldGrams * goldPrice).toFixed(2));
    const silverVaultValue = Number((silverGrams * silverPrice).toFixed(2));
    const portfolioValue = Number((goldVaultValue + silverVaultValue + cashBalance).toFixed(2));

    const transactions = await VaultTransaction.find({ mobileNumber: cleanMobile }).sort({ createdAt: -1 }).limit(10);

    return res.status(200).json({
      success: true,
      message: 'Vault and portfolio summary retrieved successfully',
      data: {
        mobileNumber: cleanMobile,
        goldHoldingsGrams: goldGrams,
        silverHoldingsGrams: silverGrams,
        cashBalance: cashBalance,
        rates: {
          goldPerGram: goldPrice,
          silverPerGram: silverPrice,
        },
        values: {
          goldVaultValue,
          silverVaultValue,
          cashBalance,
          portfolioValue,
        },
        recentTransactions: transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Buy Gold or Silver (Persist in MongoDB)
// @route   POST /api/users/vault/buy
export const buyGoldOrSilver = async (req, res, next) => {
  try {
    const { mobileNumber, metal, amount, grams, lockedPrice, paymentMethod } = req.body;

    if (!mobileNumber || !metal || !amount || !grams) {
      res.status(400);
      throw new Error('mobileNumber, metal, amount, and grams are required');
    }

    const cleanMobile = String(mobileNumber).trim();
    const metalUpper = String(metal).toUpperCase();

    if (!['GOLD', 'SILVER'].includes(metalUpper)) {
      res.status(400);
      throw new Error('Metal must be GOLD or SILVER');
    }

    let user = await User.findOne({ mobileNumber: cleanMobile });
    if (!user) {
      // Auto-create user if not existing
      const count = await User.countDocuments();
      user = await User.create({
        userCode: `FIP${String(count + 1).padStart(4, '0')}`,
        mobileNumber: cleanMobile,
        fullName: 'FipMoney Customer',
      });
    }

    const ratePerGram = lockedPrice || (metalUpper === 'GOLD' ? 6420.50 : 84.20);
    const numGrams = Number(grams);
    const numAmount = Number(amount);

    if (metalUpper === 'GOLD') {
      user.goldHoldingsGrams = Number(((user.goldHoldingsGrams || 0) + numGrams).toFixed(4));
    } else {
      user.silverHoldingsGrams = Number(((user.silverHoldingsGrams || 0) + numGrams).toFixed(4));
    }

    const amlResult = evaluateTransactionAml(user, 'BUY', numAmount, numGrams);
    user.amlScore = amlResult.amlScore;
    user.amlStatus = amlResult.amlStatus;
    user.amlFlaggedReasons = amlResult.amlFlaggedReasons;
    user.amtScore = amlResult.amlScore;
    user.amtStatus = amlResult.amlStatus;
    user.amtFlaggedReasons = amlResult.amlFlaggedReasons;
    user.lastTxnTimestamp = amlResult.lastTxnTimestamp;
    user.lastTxnType = amlResult.lastTxnType;
    user.recentTxnTimes = amlResult.recentTxnTimes;

    await user.save();

    const txId = 'FIP' + Math.floor(100000 + Math.random() * 900000);
    const transaction = await VaultTransaction.create({
      txId,
      mobileNumber: cleanMobile,
      type: 'BUY',
      metal: metalUpper,
      amount: numAmount,
      grams: numGrams,
      ratePerGram,
      status: 'COMPLETED',
      paymentMethod: paymentMethod || 'UPI',
      source: `${metalUpper === 'GOLD' ? 'Gold' : 'Silver'} Vault`,
    });

    const goldPrice = 6420.50;
    const silverPrice = 84.20;

    // --- Referral Bonus Logic ---
    if (numAmount >= 250 && user.referredBy) {
      const existingBonus = await VaultTransaction.findOne({
        mobileNumber: cleanMobile,
        type: 'REFERRAL_BONUS'
      });

      if (!existingBonus) {
        const referrer = await User.findOne({ referralCode: user.referredBy });
        if (referrer) {
          const bonusAmount = 50;
          const bonusGrams = Number((bonusAmount / goldPrice).toFixed(4));
          
          // Credit Referee
          user.goldHoldingsGrams = Number(((user.goldHoldingsGrams || 0) + bonusGrams).toFixed(4));
          await VaultTransaction.create({
            txId: 'FIP' + Math.floor(100000 + Math.random() * 900000),
            mobileNumber: cleanMobile,
            type: 'REFERRAL_BONUS',
            metal: 'GOLD',
            amount: bonusAmount,
            grams: bonusGrams,
            ratePerGram: goldPrice,
            status: 'COMPLETED',
            source: 'Referral Reward',
          });

          // Credit Referrer
          referrer.goldHoldingsGrams = Number(((referrer.goldHoldingsGrams || 0) + bonusGrams).toFixed(4));
          await referrer.save();
          await VaultTransaction.create({
            txId: 'FIP' + Math.floor(100000 + Math.random() * 900000),
            mobileNumber: referrer.mobileNumber,
            type: 'REFERRAL_BONUS',
            metal: 'GOLD',
            amount: bonusAmount,
            grams: bonusGrams,
            ratePerGram: goldPrice,
            status: 'COMPLETED',
            source: 'Referral Reward',
          });
          
          await Referral.findOneAndUpdate(
            { refereeMobile: cleanMobile },
            { status: 'REWARD_CREDITED', rewardAmount: bonusAmount * 2 }
          );
        }
      }
    }
    
    // Save user again in case referral bonus was added
    await user.save();

    const goldVaultValue = Number(((user.goldHoldingsGrams || 0) * goldPrice).toFixed(2));
    const silverVaultValue = Number(((user.silverHoldingsGrams || 0) * silverPrice).toFixed(2));
    const portfolioValue = Number((goldVaultValue + silverVaultValue + (user.cashBalance || 0)).toFixed(2));

    return res.status(200).json({
      success: true,
      message: `Successfully purchased ${numGrams}g of ${metalUpper}! Saved in MongoDB database.`,
      data: {
        transaction,
        updatedBalances: {
          goldHoldingsGrams: user.goldHoldingsGrams,
          silverHoldingsGrams: user.silverHoldingsGrams,
          goldVaultValue,
          silverVaultValue,
          portfolioValue,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sell Gold or Silver (Persist in MongoDB)
// @route   POST /api/users/vault/sell
export const sellGoldOrSilver = async (req, res, next) => {
  try {
    const { mobileNumber, metal, amount, grams, ratePerGram } = req.body;

    if (!mobileNumber || !metal || !amount || !grams) {
      res.status(400);
      throw new Error('mobileNumber, metal, amount, and grams are required');
    }

    const cleanMobile = String(mobileNumber).trim();
    const metalUpper = String(metal).toUpperCase();

    let user = await User.findOne({ mobileNumber: cleanMobile });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const numGrams = Number(grams);
    const numAmount = Number(amount);

    if (metalUpper === 'GOLD') {
      if ((user.goldHoldingsGrams || 0) < numGrams) {
        res.status(400);
        throw new Error(`Insufficient gold holdings. Available: ${user.goldHoldingsGrams || 0}g`);
      }
      user.goldHoldingsGrams = Number(((user.goldHoldingsGrams || 0) - numGrams).toFixed(4));
    } else {
      if ((user.silverHoldingsGrams || 0) < numGrams) {
        res.status(400);
        throw new Error(`Insufficient silver holdings. Available: ${user.silverHoldingsGrams || 0}g`);
      }
      user.silverHoldingsGrams = Number(((user.silverHoldingsGrams || 0) - numGrams).toFixed(4));
    }

    user.cashBalance = Number(((user.cashBalance || 0) + numAmount).toFixed(2));

    const amlResult = evaluateTransactionAml(user, 'SELL', numAmount, numGrams);
    user.amlScore = amlResult.amlScore;
    user.amlStatus = amlResult.amlStatus;
    user.amlFlaggedReasons = amlResult.amlFlaggedReasons;
    user.amtScore = amlResult.amlScore;
    user.amtStatus = amlResult.amlStatus;
    user.amtFlaggedReasons = amlResult.amlFlaggedReasons;
    user.lastTxnTimestamp = amlResult.lastTxnTimestamp;
    user.lastTxnType = amlResult.lastTxnType;
    user.recentTxnTimes = amlResult.recentTxnTimes;

    await user.save();

    const txId = 'FIP' + Math.floor(100000 + Math.random() * 900000);
    const transaction = await VaultTransaction.create({
      txId,
      mobileNumber: cleanMobile,
      type: 'SELL',
      metal: metalUpper,
      amount: numAmount,
      grams: numGrams,
      ratePerGram: ratePerGram || (metalUpper === 'GOLD' ? 6420.50 : 84.20),
      status: 'COMPLETED',
      paymentMethod: 'Bank Transfer',
      source: `${metalUpper === 'GOLD' ? 'Gold' : 'Silver'} Vault`,
    });

    const goldPrice = 6420.50;
    const silverPrice = 84.20;
    const goldVaultValue = Number(((user.goldHoldingsGrams || 0) * goldPrice).toFixed(2));
    const silverVaultValue = Number(((user.silverHoldingsGrams || 0) * silverPrice).toFixed(2));
    const portfolioValue = Number((goldVaultValue + silverVaultValue + user.cashBalance).toFixed(2));

    return res.status(200).json({
      success: true,
      message: `Successfully sold ${numGrams}g of ${metalUpper}. Funds credited to your account.`,
      data: {
        transaction,
        updatedBalances: {
          goldHoldingsGrams: user.goldHoldingsGrams,
          silverHoldingsGrams: user.silverHoldingsGrams,
          cashBalance: user.cashBalance,
          goldVaultValue,
          silverVaultValue,
          portfolioValue,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & enforce 60-day username lock policy
// @route   POST /api/users/update-profile
export const updateProfile = async (req, res, next) => {
  try {
    const { mobileNumber, username, fullName, email, bio, occupation, annualIncome } = req.body;

    if (!mobileNumber) {
      res.status(400);
      throw new Error('mobileNumber is required');
    }

    const cleanMobile = String(mobileNumber).trim();
    let user = await User.findOne({ mobileNumber: cleanMobile });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Validate username if provided and changed
    if (username !== undefined && username !== user.username) {
      const cleanUsername = String(username).trim();

      // 1. Check space or special characters except underscore (_)
      const isValidFormat = /^[a-zA-Z0-9_]+$/.test(cleanUsername);
      if (!isValidFormat) {
        res.status(400);
        throw new Error('Username can only contain letters, numbers, and underscores (_). No spaces or special characters allowed.');
      }

      // 2. Check 60-day lock policy
      if (user.usernameLastUpdated) {
        const lastUpdatedDate = new Date(user.usernameLastUpdated);
        const daysPassed = (Date.now() - lastUpdatedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysPassed < 60) {
          const daysRemaining = Math.ceil(60 - daysPassed);
          res.status(400);
          throw new Error(`Username is locked and cannot be changed for another ${daysRemaining} days (60-day policy).`);
        }
      }

      // 3. Check uniqueness across MongoDB
      const existingUser = await User.findOne({ username: cleanUsername, _id: { $ne: user._id } });
      if (existingUser) {
        res.status(400);
        throw new Error('This username is already taken by another user. Please choose a different username.');
      }

      user.username = cleanUsername;
      user.usernameLastUpdated = new Date();
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (occupation !== undefined) user.occupation = occupation;
    if (annualIncome !== undefined) user.annualIncome = annualIncome;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const completeKyc = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) {
      res.status(400);
      throw new Error('mobileNumber is required');
    }

    const user = await User.findOne({ mobileNumber: String(mobileNumber) });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.isKycCompleted = true;
    user.kycLevel = 'FULL';

    const amtResult = updateKycAmtScore(user, true);
    user.amtScore = amtResult.amtScore;
    user.amtStatus = amtResult.amtStatus;
    user.amtFlaggedReasons = amtResult.amtFlaggedReasons;

    await user.save();

    await Referral.findOneAndUpdate(
      { refereeMobile: user.mobileNumber, status: 'JOINED' },
      { status: 'KYC_COMPLETED' }
    );

    return res.status(200).json({
      success: true,
      message: 'KYC completed successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByMobile = async (req, res, next) => {
  try {
    const mobile = req.query.mobile;
    if (!mobile) {
      res.status(400);
      throw new Error('mobile query parameter is required');
    }

    const user = await User.findOne({ mobileNumber: mobile });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    return res.status(200).json({
      success: true,
      data: [getSafeUser(user)],
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByUuid = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.query.userId;
    if (!userId) {
      res.status(400);
      throw new Error('userId parameter is required');
    }

    const user = await User.findOne({ userId });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    return res.status(200).json({
      success: true,
      data: getSafeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard data (vault values, KYC, encrypted card, recent txns)
// @route   GET /api/users/dashboard
export const getDashboardData = async (req, res, next) => {
  try {
    const mobile = req.query.mobile || req.params.mobile;
    const userId = (req.cookies && req.cookies.fm_userid) || req.query.userId;

    if (!mobile && !userId) {
      res.status(400);
      throw new Error('mobile number or userId is required');
    }

    let user;
    if (mobile) {
      user = await User.findOne({ mobileNumber: String(mobile).trim() });
    } else if (userId) {
      user = await User.findOne({ userId });
    }

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // 1. Vault Values
    const goldPrice = 6420.50; // Mock current price
    const silverPrice = 84.20; // Mock current price

    const goldGrams = user.goldHoldingsGrams || 0;
    const silverGrams = user.silverHoldingsGrams || 0;
    const cashBalance = user.cashBalance || 0;

    const goldVaultValue = Number((goldGrams * goldPrice).toFixed(2));
    const silverVaultValue = Number((silverGrams * silverPrice).toFixed(2));
    const estimatedVaultValue = Number((goldVaultValue + silverVaultValue + cashBalance).toFixed(2));

    // 2. KYC Status
    const kycStatus = {
      isKycCompleted: user.isKycCompleted,
      kycLevel: user.kycLevel,
    };

    // 3. Encrypted Premium Card Details
    let encryptedCardDetails = null;
    if (user.userId) {
      let virtualCard = await VirtualCard.findOne({ userId: user.userId });
      
      // Retroactively generate if missing
      if (!virtualCard || !user.vid) {
        const cardDetails = await generateUniqueCardDetails();
        const nameOnCard = user.fullName || "Fipmoney User";
        
        const generatedVid = crypto.randomUUID();
        virtualCard = await VirtualCard.create({
          vid: generatedVid,
          userId: user.userId,
          cardNumber: encryptData256(cardDetails.cardNumber),
          cardHash: cardDetails.cardHash,
          detailsHash: cardDetails.detailsHash,
          expiry: encryptData256(cardDetails.expiry),
          nameOnCard: encryptData256(nameOnCard),
          cvv: encryptData256(cardDetails.cvv),
          balance: 0,
          isGenerated: true
        });
        
        user.vid = generatedVid;
        await user.save();
      }

      if (virtualCard && virtualCard.isGenerated) {
        const safeVirtualCard = {
          cardNumber: virtualCard.cardNumber,
          expiry: virtualCard.expiry,
          nameOnCard: virtualCard.nameOnCard,
          cvv: virtualCard.cvv,
          balance: virtualCard.balance
        };
        const payload = JSON.stringify(safeVirtualCard);
        encryptedCardDetails = encryptData256(payload);
      }
    }

    // 4. Recent Top 3 Transactions
    const recentTransactionsRaw = await VaultTransaction.find({ mobileNumber: user.mobileNumber })
      .sort({ createdAt: -1 })
      .limit(3);
    
    const recentTransactions = recentTransactionsRaw.map(tx => ({
      id: tx._id,
      type: tx.type,
      metalType: tx.metalType,
      metalAmount: tx.metalAmount,
      amount: tx.amount,
      status: tx.status,
      description: tx.description,
      createdAt: tx.createdAt
    }));

    return res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        vault: {
          goldHoldingsGrams: goldGrams,
          silverHoldingsGrams: silverGrams,
          goldVaultValue,
          silverVaultValue,
          cashBalance,
          estimatedVaultValue,
        },
        kycStatus,
        premiumCardEncrypted: encryptedCardDetails,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get user profile settings data
// @route   GET /api/users/profile-settings
export const getProfileSettings = async (req, res, next) => {
  try {
    const mobile = req.query.mobile || req.params.mobile;
    const userId = (req.cookies && req.cookies.fm_userid) || req.query.userId;
    
    if (!mobile && !userId) {
      res.status(400);
      throw new Error('mobile number or userId is required');
    }

    let user;
    if (mobile) {
      user = await User.findOne({ mobileNumber: String(mobile).trim() });
    } else if (userId) {
      user = await User.findOne({ userId });
    }

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Return only profile-specific data needed for Settings page
    const profileData = {
      userId: user.userId,
      userCode: user.userCode,
      mobileNumber: user.mobileNumber,
      email: user.email,
      username: user.username,
      fullName: user.fullName || user.username || user.firstName || '',
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      occupation: user.occupation,
      annualIncome: user.annualIncome,
      maritalStatus: user.maritalStatus,
      motherName: user.motherName,
      fatherName: user.fatherName,
      countryCode: user.countryCode,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      referralCode: user.referralCode,
      isKycCompleted: user.isKycCompleted,
      kycLevel: user.kycLevel,
      isMobileVerified: user.isMobileVerified,
      isEmailVerified: user.isEmailVerified,
      status: user.status
    };

    return res.status(200).json({
      success: true,
      message: 'Profile settings retrieved successfully',
      data: profileData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Referrals Tracking
// @route   GET /api/users/referrals
export const getReferralsTracking = async (req, res, next) => {
  try {
    const { mobile } = req.query;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'mobile is required' });
    }

    const cleanMobile = String(mobile).trim();
    const user = await User.findOne({ mobileNumber: cleanMobile });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const referrals = await Referral.find({ referrerMobile: user.mobileNumber });

    const trackingData = await Promise.all(referrals.map(async (ref) => {
      const referee = await User.findOne({ mobileNumber: ref.refereeMobile });
      return {
        id: referee ? referee.userId : ref._id,
        name: referee ? (referee.firstName ? `${referee.firstName} ${referee.lastName || ''}`.trim() : (referee.username || 'User')) : 'User',
        mobileMasked: ref.refereeMobile.replace(/.(?=.{4})/g, '*'),
        signupDate: ref.createdAt,
        isKycCompleted: ref.status === 'KYC_COMPLETED' || ref.status === 'GOLD_PURCHASED' || ref.status === 'REWARD_CREDITED',
        hasPurchasedGold: ref.status === 'GOLD_PURCHASED' || ref.status === 'REWARD_CREDITED',
        rewardCredited: ref.status === 'REWARD_CREDITED',
        profileImage: referee ? referee.profileImage : null
      };
    }));

    trackingData.sort((a, b) => new Date(b.signupDate) - new Date(a.signupDate));

    return res.status(200).json({
      success: true,
      message: 'Referrals tracking fetched successfully',
      data: trackingData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate S3 Presigned Upload URL for Direct Frontend -> Private S3 Upload
// @route   POST /api/users/profile/image/upload-url
export const getPresignedUploadUrl = async (req, res, next) => {
  try {
    const { mobile, fileName, contentType } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    const rawInput = String(mobile || '').trim();
    const cleanMobile = sanitizeMobile(rawInput);
    const user = await User.findOne({
      $or: [
        ...(cleanMobile ? [{ mobileNumber: cleanMobile }] : []),
        { mobileNumber: rawInput },
        { email: rawInput },
        { userCode: rawInput },
        { userId: rawInput }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const presignedData = await generatePresignedUploadUrl(user.userId, contentType || 'image/jpeg');

    return res.status(200).json({
      success: true,
      message: 'Presigned upload URL generated successfully',
      data: presignedData,
      uploadUrl: presignedData.uploadUrl,
      objectKey: presignedData.objectKey
    });
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    res.status(500).json({ success: false, message: 'Failed to generate presigned upload URL', error: error.message });
  }
};

// @desc    Confirm S3 Profile Image Upload and Update User Object Key in MongoDB
// @route   POST /api/users/profile/image/confirm
export const confirmProfileImageUpload = async (req, res, next) => {
  try {
    const { mobile, objectKey } = req.body;
    if (!mobile || !objectKey) {
      return res.status(400).json({ success: false, message: 'Mobile number and objectKey are required' });
    }

    const rawInput = String(mobile || '').trim();
    const cleanMobile = sanitizeMobile(rawInput);
    const user = await User.findOne({
      $or: [
        ...(cleanMobile ? [{ mobileNumber: cleanMobile }] : []),
        { mobileNumber: rawInput },
        { email: rawInput },
        { userCode: rawInput },
        { userId: rawInput }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete old profile image from private S3 if present
    if (user.profileImageKey && user.profileImageKey !== objectKey) {
      await deleteObjectFromS3(user.profileImageKey);
    }

    // Generate signed GET URL for immediate viewing
    const viewUrl = await generatePresignedViewUrl(objectKey);

    // Save objectKey & viewUrl in MongoDB
    user.profileImageKey = objectKey;
    user.profileImage = viewUrl;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile image updated successfully in database',
      profileImageKey: objectKey,
      imageUrl: viewUrl,
      data: getSafeUser(user)
    });
  } catch (error) {
    console.error('Error confirming profile image upload:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm profile image upload', error: error.message });
  }
};

// @desc    Get Temporary Signed View URL for Private Profile Image
// @route   GET /api/users/profile/image
export const getProfileImageUrl = async (req, res, next) => {
  try {
    const mobile = req.query.mobile || req.query.userId;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number or userId is required' });
    }

    const rawInput = String(mobile || '').trim();
    const cleanMobile = sanitizeMobile(rawInput);
    const user = await User.findOne({
      $or: [
        ...(cleanMobile ? [{ mobileNumber: cleanMobile }] : []),
        { mobileNumber: rawInput },
        { userId: rawInput },
        { userCode: rawInput }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const targetKey = user.profileImageKey || user.profileImage;
    const viewUrl = await generatePresignedViewUrl(targetKey);

    return res.status(200).json({
      success: true,
      profileImageKey: user.profileImageKey || '',
      imageUrl: viewUrl || user.profileImage || ''
    });
  } catch (error) {
    console.error('Error fetching profile image URL:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile image URL', error: error.message });
  }
};

// @desc    Delete Profile Image from S3 and MongoDB
// @route   DELETE /api/users/profile/image
export const deleteProfileImage = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    const cleanMobile = String(mobile).trim();
    const user = await User.findOne({ mobileNumber: cleanMobile });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.profileImageKey) {
      await deleteObjectFromS3(user.profileImageKey);
    }

    user.profileImageKey = '';
    user.profileImage = '';
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile photo removed successfully'
    });
  } catch (error) {
    console.error('Error deleting profile image:', error);
    res.status(500).json({ success: false, message: 'Failed to delete profile image', error: error.message });
  }
};

// @desc    Upload Profile Image (Legacy direct endpoint fallback)
// @route   POST /api/users/profile-image
export const uploadProfileImage = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const cleanMobile = String(mobile).trim();
    const user = await User.findOne({
      $or: [
        { mobileNumber: cleanMobile },
        { email: cleanMobile },
        { userCode: cleanMobile },
        { userId: cleanMobile }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Upload to S3
    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const objectKey = await uploadProfileImageToS3(fileBuffer, mimeType, user.userId);
    const viewUrl = await generatePresignedViewUrl(objectKey);

    // Update MongoDB
    user.profileImageKey = objectKey;
    user.profileImage = viewUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      profileImageKey: objectKey,
      imageUrl: viewUrl
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload profile image', error: error.message, stack: error.stack });
  }
};

// @desc    Get Pending Dues
// @route   GET /api/users/pending-dues
export const getPendingDues = async (req, res, next) => {
  try {
    const dues = [];
    res.status(200).json({
      success: true,
      data: dues
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Referral Summary Data
// @route   GET /api/users/referrals/summary
export const getReferralSummary = async (req, res, next) => {
  try {
    const { mobile } = req.query;
    if (!mobile) {
      res.status(400);
      throw new Error('Mobile number is required');
    }

    const cleanMobile = String(mobile).trim();
    const user = await User.findOne({ mobileNumber: cleanMobile });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const referrals = await Referral.find({ referrerMobile: user.mobileNumber });
    
    let successfulReferrals = 0;
    
    for (const ref of referrals) {
      if (ref.status === 'REWARD_CREDITED' || ref.status === 'GOLD_PURCHASED') {
        successfulReferrals++;
      }
    }

    const pendingReferrals = referrals.length - successfulReferrals;
    
    const totalEarnings = successfulReferrals * 50;
    const pendingEarnings = pendingReferrals * 50;

    const availableBalance = totalEarnings; 

    return res.status(200).json({
      success: true,
      message: 'Referral summary fetched successfully',
      data: {
        totalEarnings,
        pendingEarnings,
        successfulReferrals,
        availableBalance
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get AML Score and Risk details for a particular user
// @route   GET /api/users/:userId/aml-score
export const getUserAmlScore = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400);
      throw new Error('userId or mobile number parameter is required');
    }

    const cleanIdentifier = String(userId).trim();
    const user = await User.findOne({
      $or: [
        { userId: cleanIdentifier },
        { mobileNumber: cleanIdentifier },
        { userCode: cleanIdentifier }
      ]
    });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const amlScore = user.amlScore !== undefined ? user.amlScore : (user.amtScore !== undefined ? user.amtScore : (user.isKycCompleted ? 85 : 45));
    const amlStatus = user.amlStatus || user.amtStatus || (amlScore >= 80 ? 'Low Risk' : amlScore >= 50 ? 'Moderate Risk' : 'High Risk');

    const rawMobile = user.mobileNumber || '';

    return res.status(200).json({
      success: true,
      message: 'AML Score and Risk details retrieved successfully',
      data: {
        userId: user.userId,
        userCode: user.userCode,
        name: user.fullName || user.username || 'Fipmoney User',
        mobileNumber: encryptData256(rawMobile),
        maskedMobile: maskMobile(rawMobile),
        email: user.email,
        isKycCompleted: user.isKycCompleted,
        kycLevel: user.kycLevel,
        status: user.status,
        amlScore,
        amlStatus,
        amlFlaggedReasons: user.amlFlaggedReasons || user.amtFlaggedReasons || [],
        lastTxnTimestamp: user.lastTxnTimestamp,
        lastTxnType: user.lastTxnType
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAmtScore = getUserAmlScore;

// @desc    Get All Real MongoDB Users for Admin Users Directory
// @route   GET /api/users/admin/all-users
export const getAllAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    const formattedUsers = users.map((user, idx) => {
      const userCode = user.userCode || `FIP${String(idx + 1).padStart(4, '0')}`;
      const name = user.fullName || user.username || `Fipmoney User #${userCode}`;
      const email = user.email || `${user.mobileNumber}@fipmoney.com`;
      const amlScore = user.amlScore !== undefined ? user.amlScore : (user.amtScore !== undefined ? user.amtScore : (user.isKycCompleted ? 85 : 45));
      const amlStatus = user.amlStatus || user.amtStatus || (amlScore >= 80 ? 'Low Risk' : amlScore >= 50 ? 'Moderate Risk' : 'High Risk');

      return {
        id: user.userId || String(user._id),
        userCode,
        name,
        email,
        phone: user.mobileNumber,
        walletBal: `₹${(user.cashBalance || 0).toLocaleString()}`,
        goldBal: `${(user.goldHoldingsGrams || 0).toFixed(3)} g`,
        kycStatus: user.isKycCompleted ? 'Verified' : 'Pending',
        status: user.status === 'SUSPENDED' ? 'Suspended' : 'Active',
        joined: user.createdAt ? new Date(user.createdAt).toISOString().substring(0, 10) : '2026-08-08',
        amlScore,
        amlStatus,
        amlFlaggedReasons: user.amlFlaggedReasons || user.amtFlaggedReasons || [],
        amtScore: amlScore,
        amtStatus: amlStatus,
        amtFlaggedReasons: user.amlFlaggedReasons || user.amtFlaggedReasons || []
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Real MongoDB users retrieved successfully for Admin Dashboard',
      count: formattedUsers.length,
      data: formattedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Update AML Score for a user
// @route   PUT /api/users/admin/update-aml-score
export const adminUpdateAmlScore = async (req, res, next) => {
  try {
    const { userId, amlScore, amtScore, auditNote } = req.body;
    const targetScore = amlScore !== undefined ? amlScore : amtScore;
    if (!userId || targetScore === undefined) {
      res.status(400);
      throw new Error('userId and score are required');
    }

    const numScore = Math.max(0, Math.min(100, Number(targetScore)));
    const cleanId = String(userId).trim();

    const user = await User.findOne({
      $or: [
        { userId: cleanId },
        { mobileNumber: cleanId },
        { userCode: cleanId }
      ]
    });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.amlScore = numScore;
    user.amlStatus = numScore >= 80 ? 'Low Risk' : numScore >= 50 ? 'Moderate Risk' : 'High Risk';

    const flaggedReasons = user.amlFlaggedReasons || [];
    flaggedReasons.push({
      reason: auditNote ? `Admin Override: ${auditNote}` : `Manual Admin Score Override to ${numScore}/100`,
      timestamp: new Date(),
      penalty: 0
    });
    user.amlFlaggedReasons = flaggedReasons;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `AML Audit Score updated to ${numScore}/100 (${user.amlStatus}) for user ${user.username || user.mobileNumber}`,
      data: getSafeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateAmtScore = adminUpdateAmlScore;

// @desc    Admin Toggle User Suspension / Active Status
// @route   PUT /api/users/admin/toggle-status
export const adminToggleUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400);
      throw new Error('userId is required');
    }

    const cleanId = String(userId).trim();
    const user = await User.findOne({
      $or: [
        { userId: cleanId },
        { mobileNumber: cleanId },
        { userCode: cleanId }
      ]
    });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.status = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User status changed to ${user.status}`,
      data: getSafeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if an admin is already registered with an email address
// @route   POST /api/users/check-admin-email
export const checkAdminEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    
    // Check MongoDB User collection for admin role or admin email match
    const existingUser = await User.findOne({
      email: cleanEmail,
      $or: [{ role: 'admin' }, { role: 'Super Admin' }, { isAdmin: true }, { isApprovedAdmin: true }]
    });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        alreadyRegistered: true,
        message: 'An Admin account is already registered with this email address.'
      });
    }

    return res.status(200).json({
      success: true,
      alreadyRegistered: false,
      message: 'Email address is available for admin registration.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send Super-Admin Authorization OTP to support@fipmoney.com for Admin Signup Approval
// @route   POST /api/users/send-superadmin-otp
export const sendSuperAdminAuthOtp = async (req, res, next) => {
  try {
    const { adminName, adminEmail, adminMobile } = req.body;
    const targetSupportEmail = 'support@fipmoney.com';
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { email: 'superadmin_approval_' + targetSupportEmail },
      { email: 'superadmin_approval_' + targetSupportEmail, otp: generatedOtp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send email to support@fipmoney.com
    await sendTemplatedEmail({
      toEmail: targetSupportEmail,
      templateId: 'FIPMONEY_SUPERADMIN_AUTH_OTP',
      fromEmail: 'support@fipmoney.com',
      variables: {
        userName: 'Super-Admin Support Desk',
        verificationCode: generatedOtp,
        otp: generatedOtp,
        adminName: adminName || 'New Admin Applicant',
        adminEmail: adminEmail || '',
        adminMobile: adminMobile || '',
        expiryMinutes: 10,
        currentYear: new Date().getFullYear(),
        supportEmail: 'support@fipmoney.com'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Super-Admin authorization OTP sent to support@fipmoney.com'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Super-Admin Authorization OTP sent to support@fipmoney.com
// @route   POST /api/users/verify-superadmin-otp
export const verifySuperAdminAuthOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ success: false, message: 'Authorization OTP is required' });
    }

    const otpRecord = await Otp.findOne({ email: 'superadmin_approval_support@fipmoney.com' });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Super-Admin authorization OTP expired or not found. Please request a new one.' });
    }

    if (otpRecord.otp !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid Super-Admin authorization OTP code.' });
    }

    await Otp.deleteOne({ _id: otpRecord._id });
    return res.status(200).json({ success: true, message: 'Super-Admin authorization verified successfully.' });
  } catch (error) {
    next(error);
  }
};
