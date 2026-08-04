import crypto from 'crypto';
import User from '../models/User.js';
import VirtualCard from '../models/VirtualCard.js';
import VaultTransaction from '../models/VaultTransaction.js';
import Otp from '../models/Otp.js';
import { generateUniqueCardDetails } from '../utils/cardGenerator.js';

async function sendSmsOtp(mobile, otpCode) {
  const authKey = process.env.SMSCOUNTRY_AUTH_KEY;
  const authToken = process.env.SMSCOUNTRY_AUTH_TOKEN;
  const senderId = process.env.SMSCOUNTRY_SENDER_ID || "FIPMNY";
  
  if (!authKey || !authToken) {
    console.log(`[SMS Mock] OTP for ${mobile} is ${otpCode}`);
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

const getSafeUser = (userDoc) => {
  const obj = userDoc.toObject ? userDoc.toObject() : userDoc;
  return {
    userId: obj.userId,
    userCode: obj.userCode,
    username: obj.username,
    firstName: obj.firstName,
    lastName: obj.lastName,
    fullName: obj.fullName,
    mobileNumber: obj.mobileNumber,
    email: obj.email,
    profileImage: obj.profileImage,
    isKycCompleted: obj.isKycCompleted,
    kycLevel: obj.kycLevel,
    status: obj.status,
    isMobileVerified: obj.isMobileVerified,
    isEmailVerified: obj.isEmailVerified
  };
};

// @desc    Register or Login User
// @route   POST /api/users/auth
export const authUser = async (req, res, next) => {
  try {
    const { mobile, username, fullName, tpin, email, password } = req.body;

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
      if (password) {
        user.password = encryptPassword256(password);
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
        data: getSafeUser(user),
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

      const encryptedPassword = encryptPassword256(password || 'defaultSecuredPassword123');

      const cardDetails = await generateUniqueCardDetails();
      const nameOnCard = finalName || "Fipmoney User";

      const generatedVid = crypto.randomUUID();

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

      user = await User.create({
        userId: generatedUserId,
        userCode: generatedUserCode,
        vid: generatedVid,
        mobileNumber: cleanMobile,
        email: email || '',
        password: encryptedPassword,
        username: finalName,
        fullName: '',
        firstName,
        lastName,
        profileImage: '',
        gender: '',
        dateOfBirth: null,
        countryCode: '+91',
        nationality: '',
        occupation: '',
        annualIncome: 0,
        maritalStatus: '',
        motherName: '',
        fatherName: '',
        referralCode: '',
        referredBy: '',
        status: 'ACTIVE',
        userType: 'CUSTOMER',
        accountLevel: 'LEVEL_1',
        isMobileVerified: true,
        isEmailVerified: false,
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

      res.cookie('fm_userid', user.userId, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false });

      return res.status(201).json({
        success: true,
        message: 'New user created successfully with 256-bit encrypted password, userCode and UUID userId',
        data: getSafeUser(user),
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

    await user.save();

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
      fullName: user.fullName,
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
