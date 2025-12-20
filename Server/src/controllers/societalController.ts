// src/controllers/societalController.ts
import { Request, Response } from 'express';
import SocietalAnalysis from '../models/SocietalAnalysis';

/**
 * POST /societal/analyze
 * Accepts free-form payload in req.body, saves it and returns a static analysis result.
 */
export const analyzeSocietal = async (req: Request, res: Response) => {
  try {
    const inputPayload = req.body ?? {};

    // Static/mock analysis result (replace with real model/service later)
    const staticAnalysis = {
      score: 72,
      summary: 'Moderate societal alignment — there are both positive indicators and some risk factors.',
      recommended_actions: [
        'Investigate flagged regions',
        'Increase public-awareness campaigns',
        'Monitor trends weekly'
      ],
      flags: ['budget_mismatch', 'regional_variability']
    };

    // Save raw input + analysis to Mongo
    const doc = new SocietalAnalysis({
      input: inputPayload,
      analysis: staticAnalysis,
      meta: {
        receivedAt: new Date().toISOString(),
        sourceIp: req.ip
      }
    });

    await doc.save();

    // Return structured response including saved id and mock prediction
    res.status(201).json({
      status: 'success',
      message: 'Analysis completed (static result). Saved to DB.',
      analysis: staticAnalysis,
      saved_id: doc._id
    });
  } catch (err) {
    console.error('Error in analyzeSocietal:', err);
    res.status(500).json({ status: 'error', message: 'Server error', error: (err as Error).message });
  }
};
