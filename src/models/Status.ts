
import mongoose from 'mongoose';
import type { Document } from 'mongoose';

interface IStatus extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  type: string; // Can be 'image', 'video', 'text'
  content: string;
  timestamp: Date;
  views: mongoose.Schema.Types.ObjectId[];
}

// Mongoose Schema
const StatusSchema = new mongoose.Schema<IStatus>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Status = mongoose.model<IStatus>('Status', StatusSchema);
export { Status };
