import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './env.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const setupPassport = () => {
  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy (optional - only if credentials are provided)
  if (config.google.clientId && config.google.clientSecret) {
    logger.info('✅ Configuring Google OAuth strategy');
    
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.google.clientId,
          clientSecret: config.google.clientSecret,
          callbackURL: config.google.callbackUrl,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
              // Update existing user
              user.lastLogin = new Date();
              await user.save();
              logger.info(`User logged in: ${user.email}`);
              return done(null, user);
            }

            // Create new user
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
              avatar: profile.photos[0]?.value,
              authProvider: 'google',
              isEmailVerified: true, // Google accounts are already verified
              lastLogin: new Date(),
            });

            logger.info(`New user registered via Google: ${user.email}`);
            return done(null, user);
          } catch (error) {
            logger.error(`Google OAuth error: ${error.message}`);
            return done(error, null);
          }
        }
      )
    );
  } else {
    logger.warn('⚠️  Google OAuth not configured (credentials missing). Only email/password authentication available.');
  }
};
