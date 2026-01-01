// src/models/SocietalAnalysis.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISocietalAnalysis extends Document {
  input: {
    survey_id?: string;
    timestamp?: string;
    source?: string;
    responses: Record<string, Record<string, { question: string; answer: number }>>;
    answersArray: number[];
    meta?: any;
  };
  analysis: {
    original_response: any; // ONLY the complete model response
  };
  meta?: {
    receivedAt: string;
    sourceIp?: string;
    userAgent?: string;
    fastApiStatus?: 'success' | 'failed';
    fastApiError?: string;
  };
  timestamp: Date;
}

const SocietalAnalysisSchema: Schema = new Schema({
  input: {
    survey_id: { type: String },
    timestamp: { type: String },
    source: { type: String },
    responses: { type: Schema.Types.Mixed, required: true },
    answersArray: [{ type: Number, min: 1, max: 5 }],
    meta: { type: Schema.Types.Mixed }
  },
  analysis: {
    original_response: { type: Schema.Types.Mixed, required: true } // Only store model response
  },
  meta: {
    receivedAt: { type: String },
    sourceIp: { type: String },
    userAgent: { type: String },
    fastApiStatus: { type: String, enum: ['success', 'failed'] },
    fastApiError: { type: String }
  },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for efficient querying
SocietalAnalysisSchema.index({ 'input.survey_id': 1 });
SocietalAnalysisSchema.index({ timestamp: -1 });

export default mongoose.model<ISocietalAnalysis>('SocietalAnalysis', SocietalAnalysisSchema);