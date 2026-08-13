import express from 'express';
import crypto from 'crypto';
import Admin from '../models/Admin.js';

const router = express.Router();

// Helper to hash password/PIN
const hashPassword = (pwd) => {
  if (!pwd) return '';
  return crypto.createHash('sha256').update(pwd).digest('hex');
};

// @desc    Check if any admin account exists in database
// @route   GET /api/admin/check-exists
// @access  Public
router.get('/check-exists', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    return res.status(200).json({
      success: true,
      totalAdmins: count,
      exists: count > 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Verify if secret code or admin exists
// @route   GET /api/admin/verify-code
// @access  Public
router.get('/verify-code', async (req, res) => {
  try {
    const { code, email, mobile } = req.query;
    const query = [];
    if (code) query.push({ secretCode: String(code).trim() });
    if (email) query.push({ email: String(email).trim().toLowerCase() });
    if (mobile) query.push({ mobile: String(mobile).trim() });

    if (query.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide code, email, or mobile' });
    }

    const admin = await Admin.findOne({ $or: query }).select('-password');

    return res.status(200).json({
      success: true,
      exists: !!admin,
      data: admin || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Register new Admin Account & store details in DB
// @route   POST /api/admin/signup
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, password, secretCode, role } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, mobile, password',
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanMobile = String(mobile).trim();
    const cleanCode = secretCode ? String(secretCode).trim() : '2787';

    // Check if email or mobile already registered
    const existing = await Admin.findOne({
      $or: [{ email: cleanEmail }, { mobile: cleanMobile }, { secretCode: cleanCode }],
    });

    if (existing) {
      let conflictField = 'Details';
      if (existing.email === cleanEmail) conflictField = 'Email address';
      else if (existing.mobile === cleanMobile) conflictField = 'Mobile number';
      else if (existing.secretCode === cleanCode) conflictField = 'Secret Code';

      return res.status(400).json({
        success: false,
        message: `An admin account with this ${conflictField} already exists! Please login instead.`,
      });
    }

    const hashedPassword = hashPassword(password);

    const newAdmin = await Admin.create({
      name,
      email: cleanEmail,
      mobile: cleanMobile,
      secretCode: cleanCode,
      password: hashedPassword,
      role: role || 'Super Admin',
      status: 'Active',
      permissions: ['all'],
      lastLogin: new Date(),
    });

    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      message: 'Admin account created and registered in database successfully!',
      data: adminResponse,
    });
  } catch (error) {
    console.error('[Admin Signup API Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error registering admin account',
      error: error.message,
    });
  }
});

// @desc    Admin Login Endpoint & DB Authentication
// @route   POST /api/admin/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { secretCode, emailOrMobile, password } = req.body;

    // Check total admin count in DB first
    const totalAdmins = await Admin.countDocuments();
    if (totalAdmins === 0) {
      return res.status(404).json({
        success: false,
        noAdminExists: true,
        message: 'No admin registered in system database yet. Please complete Admin Registration first.',
      });
    }

    const query = [];
    if (secretCode) query.push({ secretCode: String(secretCode).trim() });
    if (emailOrMobile) {
      const cleanInput = String(emailOrMobile).trim();
      query.push({ email: cleanInput.toLowerCase() });
      query.push({ mobile: cleanInput });
    }

    let admin = null;
    if (query.length > 0) {
      admin = await Admin.findOne({ $or: query });
    }

    // Fallback: If secret code matches default '2787' and no query matched, try first active admin
    if (!admin && secretCode === '2787') {
      admin = await Admin.findOne({ status: 'Active' });
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Secret Code or Admin Credentials. No matching admin found.',
      });
    }

    // Verify Password if password is provided
    if (password) {
      const hashedInput = hashPassword(password);
      if (admin.password !== hashedInput && admin.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password / PIN entered.',
        });
      }
    }

    // Update lastLogin timestamp
    admin.lastLogin = new Date();
    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully!',
      data: adminResponse,
    });
  } catch (error) {
    console.error('[Admin Login API Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin authentication',
      error: error.message,
    });
  }
});

// @desc    Get all registered admins
// @route   GET /api/admin/all
// @access  Admin
router.get('/all', async (req, res) => {
  try {
    const list = await Admin.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete admin entry
// @route   DELETE /api/admin/:id
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Admin account removed successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
