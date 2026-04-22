const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User     = require('../models/User');
const { auth, generateToken } = require('../middleware/auth');

const sanitize = (user) => {
  const { password, __v, ...safe } = user;
  return safe;
};

// POST /api/auth/register
router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { name, email, password, plan = 'starter' } = req.body;

      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

      const hashedPassword = await bcrypt.hash(password, 12);
      const user  = await User.create({ name, email, password: hashedPassword, plan, platforms: [] });
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: sanitize(user.toObject()),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// POST /api/auth/login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

      const token = generateToken(user._id);
      res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: sanitize(user.toObject()),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
  res.json({ success: true, user: sanitize(req.user) });
});

// PUT /api/auth/profile
router.put('/profile', auth,
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
  ],
  async (req, res) => {
    try {
      const { name, email, bio, location, avatar, theme, notifications } = req.body;
      const updates = {};
      if (name !== undefined)          updates.name          = name;
      if (email) {
        const existing = await User.findOne({ email });
        if (existing && String(existing._id) !== String(req.user._id)) {
          return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        updates.email = email;
      }
      if (bio           !== undefined) updates.bio           = bio;
      if (location      !== undefined) updates.location      = location;
      if (avatar        !== undefined) updates.avatar        = avatar;
      if (theme         !== undefined) updates.theme         = theme;
      if (notifications !== undefined) updates.notifications = notifications;

      const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).lean();
      res.json({ success: true, user: sanitize(updated) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// POST /api/auth/change-password
router.post('/change-password', auth,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Current password incorrect' });

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
      res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;
