import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import express    from 'express';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Mock User Model
interface User {
  id: string;
  name: string;
  facebookId?: string;
  email?: string;
}

const users: User[] = []; // This is a mock user store, you would replace this with your DB logic

// Passport Facebook Strategy Configuration
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL as string,
      profileFields: ['id', 'emails', 'name'], // Fields to request from Facebook
    },
    (accessToken, refreshToken, profile, done) => {
      const { id, emails, name } = profile;
      const userEmail = emails && emails.length > 0 ? emails[0].value : undefined;

      // Search for the user in the database (or create a new one)
      let user = users.find((user) => user.facebookId === id);

      if (!user) {
        // Create a new user if one doesn't exist
        user = {
          id: String(users.length + 1),
          name: `${name?.givenName} ${name?.familyName}`,
          facebookId: id,
          email: userEmail,
        };
        users.push(user);
      }

      return done(null, user);
    },
  ),
);

// Serialize and Deserialize User
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((user) => user.id === id);
  done(null, user);
});

const router = express.Router();

// Route to Initiate Facebook Login
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Route to Handle Facebook Callback
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    // Successful login, redirect to home or send token
    res.redirect('/');
  },
);

export default router;
