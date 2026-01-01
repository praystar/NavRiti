// src/models/SocietalAnalysis.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISocietalAnalysis extends Document {
  input: {
    survey_id?: string;
    timestamp?: string;
    source?: string;
    responses: Record<string, Record<string, number>>;
    answersArray: number[]; // Flattened array of 18 responses
    meta?: any;
  };
  analysis: {
    score: number;
    summary: string;
    recommended_domains: string[];
    domain_scores: Record<string, number>;
    bias_scores: Record<string, number>;
    reason: string;
    recommended_actions: string[];
    flags: string[];
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
    score: { type: Number, required: true },
    summary: { type: String, required: true },
    recommended_domains: [{ type: String }],
    domain_scores: { type: Schema.Types.Mixed },
    bias_scores: { type: Schema.Types.Mixed },
    reason: { type: String },
    recommended_actions: [{ type: String }],
    flags: [{ type: String }]
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
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for efficient querying
SocietalAnalysisSchema.index({ 'input.survey_id': 1 });
SocietalAnalysisSchema.index({ timestamp: -1 });

export default mongoose.model<ISocietalAnalysis>('SocietalAnalysis', SocietalAnalysisSchema);