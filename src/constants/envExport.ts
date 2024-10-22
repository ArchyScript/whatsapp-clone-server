import dotenv from 'dotenv';

dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL || '';
export const MONGODB_CONNECTION_STRING: string =
  process.env.MONGODB_CONNECTION_STRING || '';

export const JWT_SECRET: string = process.env.JWT_SECRET || '';
export const PORT: string = process.env.PORT || '5000';
export const NODE_ENV: string = process.env.NODE_ENV || '';
export const ORIGIN: string = process.env.ORIGIN || '';

export const FACEBOOK_APP_ID: string = process.env.FACEBOOK_APP_ID || '';
export const FACEBOOK_APP_SECRET: string =
  process.env.FACEBOOK_APP_SECRET || '';
export const CALLBACK_URL: string = process.env.CALLBACK_URL || '';
