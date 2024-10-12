import mongoose from 'mongoose';
import type { Document } from 'mongoose';

interface ICommunity extends Document {
  communityName: string;
  admin: mongoose.Schema.Types.ObjectId;
  groups: mongoose.Schema.Types.ObjectId[];
}

// Mongoose Schema
const CommunitySchema = new mongoose.Schema<ICommunity>({
  communityName: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
});

const Community = mongoose.model<ICommunity>('Community', CommunitySchema);
export { Community };
