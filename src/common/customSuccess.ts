import type { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any,
  statusCode: number = 200,
) => {
  return res.status(statusCode).json({ success: true, data });
};
