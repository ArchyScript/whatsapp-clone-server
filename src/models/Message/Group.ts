import mongoose from 'mongoose';
import type { Document } from 'mongoose';

interface IGroup extends Document {
  groupName: string;
  members: mongoose.Schema.Types.ObjectId[];
  admin: mongoose.Schema.Types.ObjectId;
  avatarUrl: string;
}

// Mongoose Schema
const GroupSchema = new mongoose.Schema<IGroup>({
  groupName: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  avatarUrl: { type: String, default: '' },
});

const Group = mongoose.model<IGroup>('Group', GroupSchema);
export { Group };
