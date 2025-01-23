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
  createLoginData,
} from '../utils';



// #region ADD ACTIVE USER
/**
 * @desc Add active user to the database 
 * @access Private
 */
export const addActiveUser = asyncHandler(
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

      // res.cookie('jwt', createToken(email, user._id), cookieOptions);

      const accessToken = createToken(email, user._id);

      // Respond with the created user (without the password)
      return res.status(201).json({
        success: true,
        data: {
          accessToken,
          user,
        },
      });

      // return res.status(201).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  },
);
// #endregion
