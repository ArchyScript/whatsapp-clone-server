import mongoose from 'mongoose';
import type { Document } from 'mongoose';
import Joi from 'joi';

interface IContact extends Document {
  userId: mongoose.Schema.Types.ObjectId;        // The user who owns this contact
  contactId: mongoose.Schema.Types.ObjectId;     // The contact user
  name: string;                                  // Display name of the contact
  isBlocked: boolean;                            // Whether the contact is blocked
  savedContact: boolean;                         // Whether the contact is saved
}

// Mongoose Schema
const ContactSchema = new mongoose.Schema<IContact>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },    // This is the display name
  isBlocked: { type: Boolean, default: false },
  savedContact: { type: Boolean, default: true },
});

const Contact = mongoose.model<IContact>('Contact', ContactSchema);

// Joi validation schema
const contactValidationSchema = Joi.object({
  userId: Joi.string().required(),      // User adding the contact
  contactId: Joi.string().required(),   // User being added as a contact
  name: Joi.string().min(3).required(), // Display name of the contact
  isBlocked: Joi.boolean().optional(),
  savedContact: Joi.boolean().optional(),
});

export { Contact, contactValidationSchema };
