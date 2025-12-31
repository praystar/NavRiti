import mongoose, { Schema, Document } from 'mongoose';

export interface IBirthInfo extends Document {
  birth_id: string;
  input: {
    birth_date: string;
    birth_time: string;
    birth_place: string;
    personality_traits?: {
      creative: number;
      analytical: number;
      technical: number;
      leadership: number;
      communication: number;
      healing: number;
      business: number;
    };
  };
  output: any; // Complete Kundali API response
  timestamp: Date;
}

const BirthInfoSchema: Schema = new Schema({
  birth_id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  input: {
    birth_date: { type: String, required: true },
    birth_time: { type: String, required: true },
    birth_place: { type: String, required: true },
    personality_traits: {
      creative: { type: Number, min: 1, max: 10 },
      analytical: { type: Number, min: 1, max: 10 },
      technical: { type: Number, min: 1, max: 10 },
      leadership: { type: Number, min: 1, max: 10 },
      communication: { type: Number, min: 1, max: 10 },
      healing: { type: Number, min: 1, max: 10 },
      business: { type: Number, min: 1, max: 10 }
    }
  },
  output: {
    type: Schema.Types.Mixed,
    required: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IBirthInfo>('BirthInfo', BirthInfoSchema);