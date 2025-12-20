// src/models/BlacklistedToken.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IBlacklistedToken extends Document {
  token: string;
  expiresAt: Date;
}

const BlacklistedTokenSchema: Schema = new Schema({
  token: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true, index: true }
});

// TTL index: documents expire when expiresAt is reached
BlacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IBlacklistedToken>('BlacklistedToken', BlacklistedTokenSchema);
