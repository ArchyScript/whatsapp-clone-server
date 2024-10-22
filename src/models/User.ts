import mongoose from 'mongoose';
import type { UserModel } from '../types/User';

// Returns true if the user is not using social login
const isSocialLogin = function (this: any): boolean {
  return !this.provider;
};

const UserSchema = new mongoose.Schema<UserModel>(
  {
    username: {
      type: String,
      required: isSocialLogin,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: isSocialLogin,
    },
    phoneNumber: {
      type: String,
      required: isSocialLogin,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    about: {
      type: String,
      default: 'Hey there! I am using WhatsApp.',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Social login fields
    provider: {
      type: String,
      enum: ['google', 'facebook'],
      default: null,
    },
    providerId: {
      type: String,
      default: null,
    },
    accessToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<UserModel>('User', UserSchema);
