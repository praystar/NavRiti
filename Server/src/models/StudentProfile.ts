import mongoose, { Schema, Document } from 'mongoose';

// School student interface
interface ISchoolData {
  grade?: number;
  subject_preference: string;
  extracurricular_activities: string;
  hobbies: string;
  achievements: string;
  dream_career: string;
}

// Undergraduate student interface
interface IUndergraduateData {
  degree: string;
  university: string;
  current_year: string;
  cgpa: string;
  skills: string;
  experience: string;
  projects: string;
  preferred_roles: string;
}

// AI Result interface for better typing
interface IAIResult {
  stage?: string;
  student_name?: string;
  grade?: number;
  ai_predictions?: any;
  generated_at?: string;
  ai_powered?: boolean;
  parsed_successfully?: boolean;
  cv_data?: any;
  stage2_result?: any;
}

export interface IStudentProfile extends Document {
  student_id?: string;
  name: string;
  level: 'school' | 'undergraduate';
  inputMethod?: 'manual' | 'upload';
  
  // School data (if level is 'school')
  schoolData?: ISchoolData;
  
  // Undergraduate data (if level is 'undergraduate' and manual)
  ugData?: IUndergraduateData;
  
  // CV file info (if level is 'undergraduate' and upload)
  cvFile?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    uploadDate: Date;
  };
  
  // Analysis result (to be added later with ML)
  analysis?: {
    score: number;
    recommended_path: string;
    match_reason: string;
    flags: string[];
  };
  
  // ✅ ADD THIS: AI Result field to store complete AI response
  aiResult?: IAIResult;
  
  timestamp: Date;
}

const StudentProfileSchema: Schema = new Schema({
  student_id: { type: String, required: false },
  name: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['school', 'undergraduate'], 
    required: true 
  },
  inputMethod: { 
    type: String, 
    enum: ['manual', 'upload'], 
    required: false 
  },
  
  // School data
  schoolData: {
    grade: Number,
    subject_preference: String,
    extracurricular_activities: String,
    hobbies: String,
    achievements: String,
    dream_career: String
  },
  
  // Undergraduate manual data
  ugData: {
    degree: String,
    university: String,
    current_year: String,
    cgpa: String,
    skills: String,
    experience: String,
    projects: String,
    preferred_roles: String
  },
  
  // CV file metadata
  cvFile: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    uploadDate: Date
  },
  
  // Analysis results
  analysis: {
    score: Number,
    recommended_path: String,
    match_reason: String,
    flags: [String]
  },
  
  // ✅ ADD THIS: AI Result field to store complete AI response
  aiResult: {
    type: Schema.Types.Mixed, // Use Mixed type for flexible structure
    required: false
  },
  
  timestamp: { type: Date, default: Date.now }
});

// Optional: Add indexes for better query performance
StudentProfileSchema.index({ name: 1, timestamp: -1 });
StudentProfileSchema.index({ level: 1 });
StudentProfileSchema.index({ 'aiResult.generated_at': -1 });

export default mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);