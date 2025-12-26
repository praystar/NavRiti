
// 2. UPDATED CONTROLLER (server/controllers/birthInfoController.ts)
// ============================================
import { Request, Response } from 'express';
import BirthInfo from '../models/BirthInfo';

export const submitBirthInfo = async (req: Request, res: Response) => {
  try {
    const { birthDate, birthTime, birthPlace, personality_traits } = req.body;

    // Validation
    if (!birthDate || !birthTime || !birthPlace) {
      return res.status(400).json({ 
        status: "error",
        message: "All fields (birthDate, birthTime, birthPlace) are required" 
      });
    }

    // Validate personality traits if provided
    if (personality_traits) {
      const requiredTraits = ['creative', 'analytical', 'technical', 'leadership', 'communication', 'healing', 'business'];
      for (const trait of requiredTraits) {
        if (personality_traits[trait] === undefined) {
          return res.status(400).json({
            status: "error",
            message: `Missing personality trait: ${trait}`
          });
        }
        if (personality_traits[trait] < 1 || personality_traits[trait] > 10) {
          return res.status(400).json({
            status: "error",
            message: `Personality trait ${trait} must be between 1 and 10`
          });
        }
      }
    }




    // Save birth info with personality traits
    const newBirthInfo = new BirthInfo({
      birth_id: (crypto && (crypto as any).randomUUID) 
        ? (crypto as any).randomUUID() 
        : `${Date.now()}-${Math.random()}`,
      birthDate,
      birthTime,
      birthPlace,
      personality_traits: personality_traits || undefined,
      timestamp: new Date()
    });

    await newBirthInfo.save();

    res.status(201).json({
      status: "success",
      message: "Birth information saved and analyzed.",
      saved_id: newBirthInfo._id
    });

  } catch (error) {
    console.error("Error saving birth info:", error);
    res.status(500).json({ 
      status: "error",
      message: "Server error processing request", 
      error: (error as Error).message 
    });
  }
};
