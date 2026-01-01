// src/models/ParentPreference.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IParentPreference extends Document {
  parent_id?: string;
  financial_stability_weight: number;
  job_security_weight: number;
  prestige_weight: number;
  location_preference: string;
  migration_willingness: string;
  budget_constraints: {
    max_tuition_per_year: number;
  };
  unacceptable_professions: string[];
  acceptable_professions: string[];
  parent_risk_tolerance: number;
  weight_on_parent_layer: number;
  
  // Analysis results from FastAPI
  analysis: {
    score: number;
    recommended_path: string;
    match_reason: string;
    flags: string[];
    top_5_careers?: Array<{
      career_id: string;
      parent_score: number;
    }>;
    raw_parent_score?: number;
  };
  
  // Metadata
  meta?: {
    receivedAt: string;
    sourceIp?: string;
    userAgent?: string;
    fastApiStatus?: 'success' | 'failed';
    fastApiError?: string;
    retriedAt?: string;
  };
  
  timestamp: Date;
}

const ParentPreferenceSchema: Schema = new Schema({
  parent_id: { type: String, required: false },

  financial_stability_weight: { type: Number, required: true, min: 0, max: 1 },
  job_security_weight: { type: Number, required: true, min: 0, max: 1 },
  prestige_weight: { type: Number, required: true, min: 0, max: 1 },

  location_preference: { 
    type: String, 
    enum: ["local", "national", "international", "conditional"], 
    required: true 
  },

  migration_willingness: { 
    type: String, 
    enum: ["yes", "no", "conditional"], 
    required: true 
  },

  budget_constraints: {
    max_tuition_per_year: { type: Number, required: true }
  },

  unacceptable_professions: [{ type: String }],
  acceptable_professions: [{ type: String }],

  parent_risk_tolerance: { type: Number, required: true, min: 0, max: 1 },
  weight_on_parent_layer: { type: Number, required: true, min: 0, max: 1 },

  // Analysis from FastAPI
  analysis: {
    score: { type: Number },
    recommended_path: { type: String },
    match_reason: { type: String },
    flags: [{ type: String }],
    top_5_careers: [{
      career_id: { type: String },
      parent_score: { type: Number }
    }],
    raw_parent_score: { type: Number }
  },

  // Metadata for tracking
  meta: {
    receivedAt: { type: String },
    sourceIp: { type: String },
    userAgent: { type: String },
    fastApiStatus: { type: String, enum: ['success', 'failed'] },
    fastApiError: { type: String },
    retriedAt: { type: String }
  },

  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for efficient querying
ParentPreferenceSchema.index({ parent_id: 1 });
ParentPreferenceSchema.index({ timestamp: -1 });
ParentPreferenceSchema.index({ 'analysis.recommended_path': 1 });
ParentPreferenceSchema.index({ 'meta.fastApiStatus': 1 });

export default mongoose.model<IParentPreference>('ParentPreference', ParentPreferenceSchema);