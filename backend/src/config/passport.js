import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/users/google/callback',
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists in our database
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // If user exists, just pass them to the next step
            return done(null, user);
          } else {
            // If user does not exist, create a new user in our database
            const newUser = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              isVerified: true, // Users from Google are considered verified
            });
            return done(null, newUser);
          }
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  // These are not strictly needed for JWT stateless sessions but are good practice
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
  });
};

export default configurePassport;