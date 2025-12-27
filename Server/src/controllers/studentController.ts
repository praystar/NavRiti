// ============================================
// CONTROLLER (server/controllers/studentController.ts)
// ============================================
import { Request, Response } from 'express';
import StudentProfile from '../models/StudentProfile';
import multer from 'multer';
import path from 'path';

// Configure multer for CV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cvs/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// STAGE 1: School student (6-12) submission
export const submitStage1 = async (req: Request, res: Response) => {
  try {
    const { name, level, schoolData } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ 
        status: "error",
        message: "Name is required" 
      });
    }

    if (level !== 'school') {
      return res.status(400).json({ 
        status: "error",
        message: "Level must be 'school' for stage1" 
      });
    }

    if (!schoolData) {
      return res.status(400).json({ 
        status: "error",
        message: "School data is required" 
      });
    }

    // Validate school data fields
    const requiredSchoolFields = ['subject_preference', 'extracurricular_activities', 'hobbies']; 
    for (const field of requiredSchoolFields) {
      if (!schoolData[field]) {
        return res.status(400).json({
          status: "error",
          message: `School data field '${field}' is required`
        });
      }
    }

    // Static prediction for school students
    const staticPrediction = {
      score: 82,
      recommended_path: "Computer Science & Engineering",
      match_reason: "Strong interest in technology subjects and problem-solving activities.",
      flags: ["High academic potential", "Tech-oriented interests"]
    };

    // Save school student profile
    const newProfile = new StudentProfile({
      student_id: (crypto && (crypto as any).randomUUID) 
        ? (crypto as any).randomUUID() 
        : `${Date.now()}-${Math.random()}`,
      name,
      level: 'school',
      inputMethod: 'manual',
      schoolData,
      timestamp: new Date()
    });

    await newProfile.save();

    res.status(201).json({
      status: "success",
      message: "Stage 1: School student profile saved and analyzed.",
      prediction: staticPrediction,
      saved_id: newProfile._id
    });

  } catch (error) {
    console.error("Error in stage1:", error);
    res.status(500).json({ 
      status: "error",
      message: "Server error processing stage1 request", 
      error: (error as Error).message 
    });
  }
};

// STAGE 2: Undergraduate student (manual input) submission
export const submitStage2 = async (req: Request, res: Response) => {
  try {
    const { name, input_data } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ 
        status: "error",
        message: "Name is required" 
      });
    }

    if (!input_data) {
      return res.status(400).json({ 
        status: "error",
        message: "Input data is required for stage2" 
      });
    }

    // Map input_data fields to ugData structure
    const ugData = {
      degree: input_data.degree || '',
      university: input_data.university || '',
      current_year: input_data.current_year || '',
      cgpa: input_data.cgpa || '',
      skills: input_data.skills || '',
      experience: input_data.experience || '',
      projects: input_data.projects || '',
      preferred_roles: input_data.preferred_roles || ''
    };

    // Static prediction for undergraduate students
    const staticPrediction = {
      score: 88,
      recommended_path: "Software Engineering",
      match_reason: "Excellent technical skills and relevant project experience align with software development roles.",
      flags: ["Strong technical background", "Relevant project portfolio"]
    };

    // Save undergraduate student profile
    const newProfile = new StudentProfile({
      student_id: (crypto && (crypto as any).randomUUID) 
        ? (crypto as any).randomUUID() 
        : `${Date.now()}-${Math.random()}`,
      name,
      level: 'undergraduate',
      inputMethod: 'manual',
      ugData,
      timestamp: new Date()
    });

    await newProfile.save();

    res.status(201).json({
      status: "success",
      message: "Stage 2: Undergraduate student profile saved and analyzed.",
      saved_id: newProfile._id
    });

  } catch (error) {
    console.error("Error in stage2:", error);
    res.status(500).json({ 
      status: "error",
      message: "Server error processing stage2 request", 
      error: (error as Error).message 
    });
  }
};

// CV Upload for undergraduate students
export const submitStudentProfileWithCV = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name ) {
      return res.status(400).json({ 
        status: "error",
        message: "Name and level are required" 
      });
    }

    if (!file) {
      return res.status(400).json({ 
        status: "error",
        message: "CV file is required" 
      });
    }

    const newProfile = new StudentProfile({
      student_id: (crypto && (crypto as any).randomUUID) 
        ? (crypto as any).randomUUID() 
        : `${Date.now()}-${Math.random()}`,
      name,
      level: 'undergraduate',
      inputMethod: 'upload',
      cvFile: {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        uploadDate: new Date()
      },
      timestamp: new Date()
    });

    await newProfile.save();

    res.status(201).json({
      status: "success",
      message: "Student profile with CV saved and analyzed.",
      saved_id: newProfile._id
    });

  } catch (error) {
    console.error("Error saving student profile with CV:", error);
    res.status(500).json({ 
      status: "error",
      message: "Server error processing request", 
      error: (error as Error).message 
    });
  }
};
