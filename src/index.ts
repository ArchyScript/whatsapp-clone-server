import express from 'express';
import dotenv from 'dotenv';
// import { connectDatabase } from './config/mongooseConnect.js';

import type { Request, Response } from 'express';

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

// connectDatabase();

// Middleware to parse JSON request bodies
app.use(express.json());

// Define a basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on PORT: ${port}`);
});

// // Configure the session
// app.use(
//   session({
//     secret: 'your-secret',
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// // Configure Passport with Facebook Strategy
// passport.use(
//   new FacebookStrategy.Strategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID!,
//       clientSecret: process.env.FACEBOOK_APP_SECRET!,
//       callbackURL: process.env.CALLBACK_URL!,
//       profileFields: ['id', 'displayName', 'photos', 'email'],
//     },
//     function (accessToken, refreshToken, profile, done) {
//       // In a real application, you'd want to save the profile info to your database
//       return done(null, profile);
//     }
//   )
// );

// // Serialize and Deserialize User
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// // Facebook Auth Route
// app.get(
//   '/auth/facebook',
//   passport.authenticate('facebook', { scope: ['email'] })
// );

// // Facebook Auth Callback
// app.get(
//   '/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/profile');
//   }
// );

// // Profile Route (After successful login)
// app.get('/profile', (req, res) => {
//   res.send(`Welcome ${req.user?.displayName}`);
// });

// // Home Route
// app.get('/', (req, res) => {
//   res.send('Home Page');
// });

// // Start the Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
