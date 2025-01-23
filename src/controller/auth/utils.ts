// Use this file for validating if user is on database
import mongoose from 'mongoose';
import { User, ActiveUser } from '../../models/User';
import type { UserModelType } from '../../types/User/UserModel';

// #region 
export const findUserByEmail = async (
  email: string,
): Promise<UserModelType | null> => {
  const user = await User.findOne({ email });
  return user ? user : null;
};

export const findUserById = async (
  id: string,
): Promise<UserModelType | null> => {
  const user = await User.findById(id);
  return user ? user : null;
};

export const deleteUserById = async (
  id: string,
): Promise<UserModelType | null> => {
  const user = await User.findById(id);
  return user ? user : null;
};
