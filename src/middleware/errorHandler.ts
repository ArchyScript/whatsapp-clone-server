import { errorConstants } from '../constants/errorConstants';
// import type { CreateHttpError, HttpError } from 'http-errors';
import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  // err:  HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('error', err)
  // Set default status code to 500 (Internal Server Error)
  const statusCode = err.statusCode || errorConstants.INTERNAL_SERVER_ERROR;

  // Determine the error title based on the status code
  const errorTitle = Object.keys(errorConstants.ERROR_TITLES).includes(
    statusCode.toString(),
  )
    ? (errorConstants.ERROR_TITLES as Record<string, string>)[statusCode]
    : errorConstants.ERROR_TITLES.INTERNAL_SERVER_ERROR;

  const stack = process.env.NODE_ENV === 'production' ? null : err.stack;
  console.error('errStack::', stack);

  // Send error response
  res.status(statusCode).json({
    success: false,
    statusCode,
    title: errorTitle,
    stack,
    message: err.message || errorConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
};
