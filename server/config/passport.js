// server/config/passport.js - Google OAuth Configuration
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  // Only configure Google OAuth if credentials are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists
            let user = await User.findOne({ email: profile.emails[0].value });
            
            if (user) {
              return done(null, user);
            }
            
            // Create new user if doesn't exist
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0]?.value,
              password: Math.random().toString(36).slice(-8), // Random password for OAuth users
            });
            
            done(null, user);
          } catch (err) {
            console.error('Google OAuth error:', err);
            done(err, null);
          }
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    });
    
    console.log('✅ Google OAuth configured');
  } else {
    console.log('⚠️  Google OAuth not configured (missing credentials)');
  }
};