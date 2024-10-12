import mongoose from 'mongoose';
import type { Document } from 'mongoose';

interface IChat extends Document {
  participants: mongoose.Schema.Types.ObjectId[];
  messages: mongoose.Schema.Types.ObjectId[];
  isGroup: boolean;
  lastMessageAt: Date;
}

// Mongoose Schema
const ChatSchema = new mongoose.Schema<IChat>({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  isGroup: { type: Boolean, default: false },
  lastMessageAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model<IChat>('Chat', ChatSchema);
export { Chat };
