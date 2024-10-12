import mongoose from 'mongoose';
import type { Document } from 'mongoose';

interface IMessage extends Document {
  chatId: mongoose.Schema.Types.ObjectId;
  senderId: mongoose.Schema.Types.ObjectId;
  content: string;
  type: string;  // Can be text, image, video, etc.
  timestamp: Date;
  isRead: boolean;
}

// Mongoose Schema
const MessageSchema = new mongoose.Schema<IMessage>({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);
export { Message };
