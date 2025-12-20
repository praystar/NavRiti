// src/models/SocietalAnalysis.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISocietalAnalysis extends Document {
  input: any;
  analysis: {
    score: number;
    summary: string;
    recommended_actions?: string[];
    flags?: string[];
  };
  meta?: any;
  timestamp: Date;
}

const SocietalAnalysisSchema: Schema = new Schema({
  input: { type: Schema.Types.Mixed, required: true },
  analysis: {
    score: { type: Number, required: true },
    summary: { type: String, required: true },
    recommended_actions: [{ type: String }],
    flags: [{ type: String }]
  },
  meta: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<ISocietalAnalysis>('SocietalAnalysis', SocietalAnalysisSchema);
