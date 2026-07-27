import User from '../models/User.js';

// @desc    Register or login user by mobile number
// @route   POST /api/users/auth
export const authUser = async (req, res, next) => {
  try {
    const { mobile, fullName, email } = req.body;

    if (!mobile) {
      res.status(400);
      throw new Error('Mobile number is required');
    }

    let user = await User.findOne({ mobile });

    if (user) {
      // User exists
      res.status(200).json({
        success: true,
        message: 'User authenticated successfully',
        data: user,
      });
    } else {
      // Create new user in dev_users collection
      user = await User.create({
        mobile,
        fullName: fullName || '',
        email: email || '',
        isVerified: true,
      });

      res.status(201).json({
        success: true,
        message: 'New user created successfully in dev database',
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users in dev_users
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
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
