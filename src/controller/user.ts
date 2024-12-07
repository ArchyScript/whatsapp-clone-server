import { User } from '../models/User';
import asyncHandler from 'express-async-handler';
import type { Request, Response, NextFunction } from 'express';
import { createError } from '../common/customError'; 

// export const updateUserStatus = async (userId: string, isActive: boolean) => {
//   try {
//     await User.findByIdAndUpdate(userId, { isActive });
//   } catch (error) {
//     console.error('Error updating user status:', error); 
//   }
// };

export const updateUserStatus = asyncHandler( 
  async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
    // Create a new user in the database
    try { 
        console.log('Creating new user')
    } catch (error) {
      next(error);
    }
  },
);