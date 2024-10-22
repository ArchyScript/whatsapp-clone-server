import { NODE_ENV } from '../constants/envExport';
import { errorConstants } from '../constants';
import type { CreateHttpError, HttpError } from 'http-errors';
import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  // error: any,
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = error.statusCode || errorConstants.INTERNAL_SERVER_ERROR;
  let errorTitle = Object.keys(errorConstants.ERROR_TITLES).includes(
    statusCode.toString(),
  )
    ? (errorConstants.ERROR_TITLES as Record<string, string>)[statusCode]
    : errorConstants.ERROR_TITLES.INTERNAL_SERVER_ERROR;
  let message =
    error.message || errorConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  // Check if it's a MongoDB Duplicate Key Error
  if (error.name === 'MongoServerError' && error.code === 11000) {
    statusCode = 400;
    errorTitle = errorConstants.ERROR_TITLES.DUPLICATE_KEY_ERROR;

    const field = Object.keys(error.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  const stack = NODE_ENV === 'production' ? null : error.stack;

  res
    .status(statusCode)
    .json({ success: false, statusCode, title: errorTitle, stack, message });
};
