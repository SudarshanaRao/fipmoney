import crypto from 'crypto';
import User from '../models/User.js';

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
        kycLevel: 'MINIMUM',
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
