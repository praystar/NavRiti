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

  // NEW FIELD
  analysis: {
    score: Number,
    recommended_path: String,
    match_reason: String,
    flags: [String]
  },

  timestamp: { type: Date, default: Date.now }
});


export default mongoose.model<IParentPreference>('ParentPreference', ParentPreferenceSchema);