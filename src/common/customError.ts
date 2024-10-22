import { CustomError } from '../types';

export const createError = (statusCode: number = 500, message: string) => {
  const error = new Error(message) as any;

  error.statusCode = statusCode;
  error.message = message;
  // error.stack = stack || new Error().stack;
  // error.details = details || null;
 
  return error;
};
