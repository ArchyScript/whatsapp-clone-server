import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/envExport';


// Extend Request type to include userId
interface AuthenticatedRequest extends Request {
  userId?: string;
  email?: string;
}

// Define type for the JWT payload
export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

export const isTokenValid = (
  token: string,
): { valid: boolean; payload?: TokenPayload } => {
  try {
    // Verify the token
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // console.log();

    // If the token is valid, return true with the decoded payload
    return { valid: true, payload };
  } catch (err) {
    console.error('Token validation error:', err);
    // If the token is invalid, return false
    return { valid: false };
  }
};

// use isTokenValid to verify token
export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  console.log('req.header from verify token', req.header);

  // Extract token from Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'Access Denied. No Token Provided.' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access Denied. No Token Provided.');

  const response = isTokenValid(token);
  const { valid, payload } = response;

  if (valid && payload) {
    const { userId, email } = payload as TokenPayload;
    req.userId = userId;
    req.email = email;
    next();
  } else {
    res.status(401).json({ message: 'Invalid token' });
  }
  // jwt.verify(token, JWT_SECRET, (err, payload) => {
  //   if (err) return res.status(403).send('Invalid Token');

  //   try {
  //     const { userId, email } = payload as TokenPayload;
  //     req.userId = userId;
  //     req.email = email;
  //     next();
  //   } catch (err) {
  //     res.status(401).json({ message: 'Invalid token' });
  //   }
  // });

  //   const token = req.cookies.jwt;
  //   if (!token) return res.status(401).send('Not Authenticated');

  //   jwt.verify(token, JWT_SECRET, async (err, payload) => {
  //     if (err) return res.status(403).send('Invalid Token');

  //     // add user id gotten from the token to the request that can be accessed by the next middleware or controller
  //     req.userId = payload.userId;
  //     next();
  //   });

  // let authHeader = req.headers.Authorization || req.headers.authorization
  // if (authHeader && authHeader.startsWith('Bearer')) {
  //     token = authHeader.split(" ")[1]
  //     console.log("token", token)
  //     await jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
  //         if (err) {
  //             res.status(401)
  //             console.log('err:::', err)
  //             throw new Error('Not authorized')
  //         } else {
  //             req.user = decoded
  //             console.log("decoded:::", decoded)
  //             next()
  //         }
  //     })
  // }
};
