// import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../models/User';
import { createError } from '../common/customError';
import {
  loginValidation,
  signupValidation,
  resetPasswordValidation,
} from '../validations/auth';
import {
  createToken,
  cookieOptions,
  hashPassword,
  comparePassword,
} from '../utils';

// #region SIGNUP
/**
 * @desc signup user
 * @route POST /api/users/signup
 * @access Public
 */
export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { value, error } = signupValidation(req.body);
    if (error) return next(createError(400, error.details[0].message));

    const { email, password, username, phoneNumber } = value;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return next(createError(500, 'User already exist'));

    const hashedPassword = await hashPassword(password);

    // Create a new user in the database
    try {
      const user = await User.create({
        email,
        username,
        password: hashedPassword,
        phoneNumber,
      });

      res.cookie('jwt', createToken(email, user._id), cookieOptions);
      return res.status(201).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  },
);
// #endregion

// #region LOGIN
/**
 * @desc login
 * @route POST /api/users/login
 * @access Public
 */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { value, error } = loginValidation(req.body);
    if (error) return next(createError(400, error.details[0].message));

    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user) return next(createError(500, "User doesn't have an account"));

    // option to login with social of trad way
    if (!user.password) return;

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) return next(createError(401, 'Invalid password.'));

    res.cookie('jwt', createToken(email, user._id), cookieOptions);

    // Respond with the created user (without the password)
    return res.status(201).json({ success: true, user });
  },
);
// #endregion

// TODO Use Amazon SES for email service
// #region RESET PASSWORD
/**
 * @desc reset password
 * @route POST /api/users/reset-password
 * @access Public
 */
// export const resetPassword = asyncHandler(
//   async (req: Request, res: Response): Promise<any> => {
//     const { value, error } = resetPasswordValidation(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const { confirmPassword,  newPassword } = value;

// if (newPassword !== confirmPassword) {
//   return res.status(400).json({ message: 'Passwords do not match.' });
// }

// const user = await User.findOne({ email });
// if (!user) {
//   return res.status(404).json({ message: 'User not found.' });
// }

// const user = await User.findOne({ email });
// if (!user) return res.status(500).send("User doesn't have an account");

// // option to login with social of trad way
// if (!user.password) return;

// const isPasswordValid = await comparePassword(password, user.password);
// if (!isPasswordValid) return res.status(401).send('Invalid password.');

// res.cookie('jwt', createToken(email, user._id), cookieOptions);

// // Respond with the created user (without the password)
// return res.status(201).json({ success: true, user });
//   },
// );
// #endregion

// export const requestPasswordReset = asyncHandler(
//   async (req: Request, res: Response): Promise<any> => {
//     const { email } = req.body;

//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Generate a reset code (You can customize this further)
//     const resetCode = crypto.randomBytes(3).toString('hex'); // A 6-character code
//     const resetToken = crypto.createHash('sha256').update(resetCode).digest('hex'); // Hashed version to store in DB

//     // Set reset token and expiration (20 minutes)
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 20 * 60 * 1000; // 20 minutes from now

//     await user.save();

//     // Send the reset code via email
//     const message = `Your password reset code is: ${resetCode}. It will expire in 20 minutes.`;
//     await sendEmail({
//       to: user.email,
//       subject: 'Password Reset Code',
//       text: message,
//     });

//     return res.status(200).json({ message: 'Reset code sent to your email.' });
//   }
// );

// export const verifyResetCodeAndResetPassword = asyncHandler(
//   async (req: Request, res: Response): Promise<any> => {
//     const { email, resetCode, newPassword } = req.body;

//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Check if reset token has expired
//     if (user.resetPasswordExpires && Date.now() > user.resetPasswordExpires) {
//       return res.status(400).json({ message: "Reset code has expired." });
//     }

//     // Hash the incoming reset code and compare with stored token
//     const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

//     if (hashedResetCode !== user.resetPasswordToken) {
//       return res.status(400).json({ message: "Invalid reset code." });
//     }

//     // Hash the new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     // Update the user's password and clear reset token and expiration
//     user.password = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     return res.status(200).json({ message: "Password reset successful." });
//   }
// );
