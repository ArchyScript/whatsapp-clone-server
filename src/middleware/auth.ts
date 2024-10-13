import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

// Extend Request type to include userId
interface AuthenticatedRequest extends Request {
  userId?: string;
  email?: string;
}

// Define type for the JWT payload
interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
}
const JWT_SECRET = process.env.JWT_SECRET as string;

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access Denied. No Token Provided.');

  console.log('token:::', token);

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).send('Invalid Token');

    // Typecast the payload to TokenPayload
    const { userId, email } = payload as TokenPayload;

    // Attach the userId and email to the request object
    req.userId = userId;
    req.email = email;
    next();
  });

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
