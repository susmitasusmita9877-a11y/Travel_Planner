const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { register, login, getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');

require('../config/passport'); // Initialize passport

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Traditional auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:5173/login',
    session: false 
  }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user._id);
    
    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/auth/callback?token=${token}&newUser=${req.user.isNewUser}`);
  }
);

// Profile update route
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.isNewUser === false) {
      user.isNewUser = false;
    }
    
    await user.save();
    
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    };
    
    res.json(userResponse);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: err.message || 'Failed to update profile' });
  }
});

// Change password route
router.put('/change-password', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    user.password = req.body.newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ message: err.message || 'Failed to change password' });
  }
});

module.exports = router;