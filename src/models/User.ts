// models/user.model.ts
import mongoose from 'mongoose';
import type { Document } from 'mongoose';
import Joi from 'joi';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatarUrl?: string;
  status?: string;
  lastSeen?: Date;
  isOnline?: boolean;
  contacts: mongoose.Schema.Types.ObjectId[];
}

// Mongoose Schema
const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  avatarUrl: { type: String, default: null },
  status: { type: String, default: 'Hey there! I am using WhatsApp.' },
  lastSeen: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// Joi Schema for validation
const userValidationSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().required(),
  avatarUrl: Joi.string().uri().optional(),
  status: Joi.string().optional(),
});

const User = mongoose.model<IUser>('User', UserSchema);
export { User, userValidationSchema };
