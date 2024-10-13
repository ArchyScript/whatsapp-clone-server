import mongoose from 'mongoose';
import type { Document } from 'mongoose';

export interface UserModel extends Document {
  _id: mongoose.Types.ObjectId;
  username?: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  about?: string;
  lastSeen?: Date;
  isOnline?: boolean;
  contacts: mongoose.Schema.Types.ObjectId[];

  // Social login fields
  provider?: 'google' | 'facebook';
  providerId?: string;
  accessToken?: string;
}
