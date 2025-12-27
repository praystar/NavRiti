import mongoose, { Schema, Document } from 'mongoose';

export interface IBirthInfo extends Document {
  birth_id?: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  personality_traits?: {
    creative: number;
    analytical: number;
    technical: number;
    leadership: number;
    communication: number;
    healing: number;
    business: number;
  };
  analysis?: {
    score: number;
    recommended_path: string;
    match_reason: string;
    flags: string[];
    astrological_insights?: string[];
  };
  timestamp: Date;
}

const BirthInfoSchema: Schema = new Schema({
  birth_id: { type: String, required: false },
  birthDate: { type: String, required: true },
  birthTime: { type: String, required: true },
  birthPlace: { type: String, required: true },
  
  personality_traits: {
    creative: { type: Number, min: 1, max: 10 },
    analytical: { type: Number, min: 1, max: 10 },
    technical: { type: Number, min: 1, max: 10 },
    leadership: { type: Number, min: 1, max: 10 },
    communication: { type: Number, min: 1, max: 10 },
    healing: { type: Number, min: 1, max: 10 },
    business: { type: Number, min: 1, max: 10 }
  },
  
  analysis: {
    score: Number,
    recommended_path: String,
    match_reason: String,
    flags: [String],
    astrological_insights: [String]
  },
  
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IBirthInfo>('BirthInfo', BirthInfoSchema);
