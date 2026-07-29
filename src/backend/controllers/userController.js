import crypto from 'crypto';
import User from '../models/User.js';
import VaultTransaction from '../models/VaultTransaction.js';

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
        message: 'User exists in database',
        data: user,
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

// @desc    Register or Login User
// @route   POST /api/users/auth
export const authUser = async (req, res, next) => {
  try {
    const { mobile, fullName, email, password } = req.body;

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
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'User authenticated successfully',
        data: user,
      });
    } else {
      // Auto-generate userCode starting from #FIP0001 series based on DB count
      const count = await User.countDocuments();
      const nextIndex = count + 1;
      const generatedUserCode = `FIP${String(nextIndex).padStart(4, '0')}`;
      const generatedUserId = crypto.randomUUID();

      const nameParts = (fullName || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const encryptedPassword = encryptPassword256(password || 'defaultSecuredPassword123');

      user = await User.create({
        userId: generatedUserId,
        userCode: generatedUserCode,
        mobileNumber: cleanMobile,
        email: email || '',
        password: encryptedPassword,
        fullName: fullName || '',
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
        isPinSet: false,
        isBiometricEnabled: false,
        isFaceIdEnabled: false,
        isFingerPrintEnabled: false,
        isKycCompleted: true,
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
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      });

      return res.status(201).json({
        success: true,
        message: 'New user created successfully with 256-bit encrypted password, userCode and UUID userId',
        data: user,
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
      data: [user],
    });
  } catch (error) {
    next(error);
  }
};
