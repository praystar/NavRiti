import mongoose, { Schema, Document } from 'mongoose';

export interface IParentPreference extends Document {
  // Raw input from user request
  user_input: any;
  
  // Raw output from AI server
  ai_output: any;
  
  // Metadata
  timestamp: Date;
  ai_server_endpoint: string;
  ai_server_status: number;
}

const ParentPreferenceSchema: Schema = new Schema({
  // Store exact user input as-is
  user_input: {
    type: Schema.Types.Mixed,
    required: true
  },
  
  // Store exact AI output as-is
  ai_output: {
    type: Schema.Types.Mixed,
    required: true
  },
  
  // Metadata
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  

  ai_server_status: {
    type: Number,
    required: true
  }
});

export default mongoose.model<IParentPreference>('ParentPreference', ParentPreferenceSchema);