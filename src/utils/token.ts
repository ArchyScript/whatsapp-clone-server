import type { CookieOptions } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/envExport';

const maxAge = 3 * 24 * 60 * 60 * 1000;
export const createToken = (email: string, userId: mongoose.Types.ObjectId) => {
  return jwt.sign({ email, userId }, JWT_SECRET, { expiresIn: maxAge });
};

export const cookieOptions: CookieOptions = {
  maxAge,
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};
