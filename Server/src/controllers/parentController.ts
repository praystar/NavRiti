import { Request, Response } from 'express';
import ParentPreference from '../models/ParentPreference';

export const submitParentPreferences = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Static prediction result (mock for now)
    const staticPrediction = {
      score: 85,
      recommended_path: "Software Engineering",
      match_reason: "High alignment with financial stability and low risk tolerance.",
      flags: ["Matches budget constraints"]
    };

    // Save BOTH input data + prediction
    const newPreference = new ParentPreference({
      ...data,
      analysis: staticPrediction,
      timestamp: new Date()
    });

    await newPreference.save();

    res.status(201).json({
      status: "success",
      message: "Preferences saved and analyzed.",
      prediction: staticPrediction,
      saved_id: newPreference._id
    });

  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ 
      message: "Server error processing request", 
      error 
    });
  }
};
