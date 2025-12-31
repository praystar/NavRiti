// src/controllers/societalController.ts
import { Request, Response } from 'express';
import SocietalAnalysis from '../models/SocietalAnalysis';
import axios from 'axios';

// FastAPI endpoint URL - adjust based on your deployment
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

/**
 * POST /societal/analyze
 * Accepts an array of 18 Likert responses, calls FastAPI for analysis,
 * and saves both input and results to MongoDB.
 */
export const analyzeSocietal = async (req: Request, res: Response) => {
  let savedDocId: string | null = null;
  let fastApiSuccess = false;
  
  try {
    const inputPayload = req.body ?? {};

    // Validate that we have responses array
    if (!inputPayload.responses) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing "responses" field in request body'
      });
    }

    // Extract the answers array from the nested structure
    const answersArray = extractAnswersArray(inputPayload.responses);

    if (answersArray.length !== 18) {
      return res.status(400).json({
        status: 'error',
        message: `Expected 18 responses, got ${answersArray.length}`
      });
    }

    let formattedAnalysis: any = null;
    let fastApiError: string | null = null;

    // Try to call FastAPI recommendation endpoint
    try {
      const fastApiResponse = await axios.post(`${FASTAPI_URL}/recommend`, {
        answers: answersArray
      }, {
        timeout: 10000 // 10 second timeout
      });

      const analysisResult = fastApiResponse.data;

      // Transform the FastAPI response to match our expected format
      formattedAnalysis = {
        score: calculateOverallScore(analysisResult.domain_scores),
        summary: analysisResult.gemini_explanation,
        recommended_domains: analysisResult.recommended_domains,
        domain_scores: analysisResult.domain_scores,
        bias_scores: analysisResult.bias_scores,
        reason: analysisResult.reason,
        recommended_actions: generateRecommendedActions(analysisResult),
        flags: generateFlags(analysisResult)
      };

      fastApiSuccess = true;

    } catch (fastApiErr) {
      console.error('FastAPI call failed:', fastApiErr);
      
      // Store error details
      if (axios.isAxiosError(fastApiErr)) {
        fastApiError = fastApiErr.response?.data?.detail || fastApiErr.message;
      } else {
        fastApiError = (fastApiErr as Error).message;
      }

      // Create fallback analysis when FastAPI fails
      formattedAnalysis = {
        score: 0,
        summary: 'Analysis pending - FastAPI service unavailable',
        recommended_domains: [],
        domain_scores: {},
        bias_scores: {},
        reason: 'FastAPI analysis failed, data saved for retry',
        recommended_actions: ['Retry analysis later'],
        flags: ['fastapi_failure']
      };
    }

    // ALWAYS save to MongoDB, regardless of FastAPI success
    const doc = new SocietalAnalysis({
      input: {
        ...inputPayload,
        answersArray
      },
      analysis: formattedAnalysis,
      meta: {
        receivedAt: new Date().toISOString(),
        sourceIp: req.ip,
        userAgent: req.get('user-agent'),
        fastApiStatus: fastApiSuccess ? 'success' : 'failed',
        fastApiError: fastApiError || undefined
      }
    });

    await doc.save();
    savedDocId = doc._id.toString();

    // Return response based on FastAPI status
    if (fastApiSuccess) {
      return res.status(201).json({
        status: 'success',
        message: 'Analysis completed and saved to database.',
        analysis: formattedAnalysis,
        saved_id: savedDocId
      });
    } else {
      return res.status(202).json({
        status: 'partial_success',
        message: 'Survey saved, but analysis failed. You can retry later.',
        analysis: formattedAnalysis,
        saved_id: savedDocId,
        error: fastApiError
      });
    }

  } catch (err) {
    console.error('Error in analyzeSocietal:', err);
    
    // If we saved to MongoDB before this error, include that info
    if (savedDocId) {
      return res.status(500).json({
        status: 'error',
        message: 'Server error after saving to database',
        saved_id: savedDocId,
        error: (err as Error).message
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: (err as Error).message
    });
  }
};

/**
 * Helper: Extract answers from nested object structure to flat array
 * Maps: { A: {0: 4, 1: 3, ...}, B: {...}, C: {...} } -> [4, 3, ...]
 */
function extractAnswersArray(responses: Record<string, Record<string, number>>): number[] {
  const sections = ['A', 'B', 'C'];
  const questionsPerSection = 6;
  const answersArray: number[] = [];

  for (const section of sections) {
    if (!responses[section]) {
      throw new Error(`Missing section ${section} in responses`);
    }

    for (let i = 0; i < questionsPerSection; i++) {
      const value = responses[section][i];
      if (typeof value !== 'number' || value < 1 || value > 5) {
        throw new Error(
          `Invalid response for section ${section}, question ${i}: expected number 1-5, got ${value}`
        );
      }
      answersArray.push(value);
    }
  }

  return answersArray;
}

/**
 * Helper: Calculate overall score from domain scores (0-100 scale)
 */
function calculateOverallScore(domainScores: Record<string, number>): number {
  const scores = Object.values(domainScores);
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  // Convert from 0-10 scale to 0-100 scale
  return Math.round((avgScore / 10) * 100);
}

/**
 * Helper: Generate recommended actions based on analysis
 */
function generateRecommendedActions(analysis: any): string[] {
  const actions: string[] = [];
  const topDomain = analysis.recommended_domains[0];

  actions.push(`Explore career opportunities in ${topDomain}`);
  actions.push('Connect with professionals in your recommended field');
  
  // Check for strong role model influence
  const roleKeys = Object.keys(analysis.bias_scores).filter(key => key.includes('role'));
  const hasStrongRoleModel = roleKeys.some(key => analysis.bias_scores[key] > 4);
  
  if (hasStrongRoleModel) {
    actions.push('Leverage your role model connections for mentorship');
  }
  
  actions.push('Research educational pathways in your aligned domain');
  actions.push('Consider internship or shadowing opportunities');

  return actions;
}

/**
 * Helper: Generate flags based on analysis patterns
 */
function generateFlags(analysis: any): string[] {
  const flags: string[] = [];
  
  // Check for conflicting influences
  const biasScores = Object.values(analysis.bias_scores) as number[];
  const variance = calculateVariance(biasScores);
  
  if (variance > 2) {
    flags.push('high_variance_in_influences');
  }

  // Check if multiple domains are equally recommended
  if (analysis.recommended_domains.length > 1) {
    flags.push('multiple_equal_recommendations');
  }

  // Check for weak overall influence
  const avgBias = biasScores.reduce((sum, val) => sum + val, 0) / biasScores.length;
  if (avgBias < 3) {
    flags.push('weak_overall_social_influence');
  }

  return flags;
}

/**
 * Helper: Calculate variance of an array
 */
function calculateVariance(arr: number[]): number {
  const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
  const squaredDiffs = arr.map(val => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / arr.length;
}