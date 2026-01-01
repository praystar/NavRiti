// src/controllers/parentController.ts
import { Request, Response } from 'express';
import ParentPreference from '../models/ParentPreference';
import axios from 'axios';

// FastAPI endpoint URL - adjust based on your deployment
const FASTAPI_PARENT_URL = process.env.FASTAPI_PARENT_URL || 'http://localhost:8001';

/**
 * POST /parent/preferences
 * Accepts parent preference data, calls FastAPI for ML-based recommendation,
 * and saves both input and results to MongoDB.
 */
export const submitParentPreferences = async (req: Request, res: Response) => {
  let savedDocId: string | null = null;
  let fastApiSuccess = false;

  try {
    const data = req.body;

    // Validate required fields
    const requiredFields = [
      'financial_stability_weight',
      'job_security_weight', 
      'prestige_weight',
      'location_preference',
      'migration_willingness',
      'budget_constraints',
      'parent_risk_tolerance',
      'weight_on_parent_layer'
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        return res.status(400).json({
          status: 'error',
          message: `Missing required field: ${field}`
        });
      }
    }

    // Validate budget_constraints structure
    if (!data.budget_constraints?.max_tuition_per_year) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing budget_constraints.max_tuition_per_year'
      });
    }

    let analysisResult: any = null;
    let fastApiError: string | null = null;

    // Transform Express payload to FastAPI format
    const fastApiPayload = transformToFastApiFormat(data);

    // Try to call FastAPI recommendation endpoint
    try {
      const fastApiResponse = await axios.post(
        `${FASTAPI_PARENT_URL}/rescore-parent`,
        fastApiPayload,
        {
          timeout: 15000, // 15 second timeout (Gemini can be slow)
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const apiResult = fastApiResponse.data;

      // Transform FastAPI response to our format
      analysisResult = {
        score: apiResult.final_recommendation.parent_score * 10, // Convert 0-10 to 0-100
        recommended_path: apiResult.final_recommendation.career_id,
        match_reason: apiResult.final_recommendation.parent_explanation,
        flags: generateFlags(apiResult, data),
        top_5_careers: apiResult.top_5_parent_scores,
        raw_parent_score: apiResult.final_recommendation.parent_score
      };

      fastApiSuccess = true;

    } catch (fastApiErr) {
      console.error('FastAPI parent call failed:', fastApiErr);

      // Store error details
      if (axios.isAxiosError(fastApiErr)) {
        fastApiError = fastApiErr.response?.data?.detail || fastApiErr.message;
      } else {
        fastApiError = (fastApiErr as Error).message;
      }

      // Create fallback analysis when FastAPI fails
      analysisResult = {
        score: 0,
        recommended_path: 'Analysis Pending',
        match_reason: 'FastAPI service unavailable. Data saved for later processing.',
        flags: ['fastapi_failure'],
        top_5_careers: []
      };
    }

    // ALWAYS save to MongoDB, regardless of FastAPI success
    const newPreference = new ParentPreference({
      ...data,
      analysis: analysisResult,
      meta: {
        receivedAt: new Date().toISOString(),
        sourceIp: req.ip,
        userAgent: req.get('user-agent'),
        fastApiStatus: fastApiSuccess ? 'success' : 'failed',
        fastApiError: fastApiError || undefined
      },
      timestamp: new Date()
    });

    await newPreference.save();
    savedDocId = newPreference._id.toString();

    // Return response based on FastAPI status
    if (fastApiSuccess) {
      return res.status(201).json({
        status: 'success',
        message: 'Preferences saved and analyzed successfully.',
        prediction: analysisResult,
        saved_id: savedDocId
      });
    } else {
      return res.status(202).json({
        status: 'partial_success',
        message: 'Preferences saved, but ML analysis failed. You can retry later.',
        prediction: analysisResult,
        saved_id: savedDocId,
        error: fastApiError
      });
    }

  } catch (error) {
    console.error('Error in submitParentPreferences:', error);

    // If we saved to MongoDB before this error, include that info
    if (savedDocId) {
      return res.status(500).json({
        status: 'error',
        message: 'Server error after saving to database',
        saved_id: savedDocId,
        error: (error as Error).message
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Server error processing request',
      error: (error as Error).message
    });
  }
};

/**
 * Transform Express format to FastAPI format
 * Express uses 0-1 scale for weights, FastAPI expects 1-5 Likert scale for some fields
 */
function transformToFastApiFormat(expressData: any): any {
  // Convert 0-1 weights to 1-5 Likert scale
  const toLikert = (val: number): number => Math.round(val * 4) + 1;

  return {
    budget_max_tuition: expressData.budget_constraints.max_tuition_per_year,
    
    // Convert 0-1 weights to 1-5 Likert scale
    importance_finances: toLikert(expressData.financial_stability_weight),
    importance_job_security: toLikert(expressData.job_security_weight),
    importance_prestige: toLikert(expressData.prestige_weight),
    parent_risk_tolerance: toLikert(expressData.parent_risk_tolerance),
    influence_from_people: toLikert(expressData.weight_on_parent_layer),
    
    location_preference: expressData.location_preference === 'conditional' 
      ? 'national' 
      : expressData.location_preference,
    
    migration_allowed: expressData.migration_willingness === 'yes' 
      ? true 
      : expressData.migration_willingness === 'no' 
        ? false 
        : true, // conditional defaults to true
    
    unacceptable_careers: expressData.unacceptable_professions || []
  };
}

/**
 * Generate flags based on analysis patterns
 */
function generateFlags(apiResult: any, originalData: any): string[] {
  const flags: string[] = [];

  // Check if recommended career is within budget
  const topCareer = apiResult.top_5_parent_scores?.[0];
  if (topCareer) {
    flags.push('top_recommendation_generated');
  }

  // Check if multiple careers have similar scores
  if (apiResult.top_5_parent_scores?.length >= 2) {
    const top1 = apiResult.top_5_parent_scores[0].parent_score;
    const top2 = apiResult.top_5_parent_scores[1].parent_score;
    if (Math.abs(top1 - top2) < 0.1) {
      flags.push('multiple_similar_options');
    }
  }

  // Check for high financial weight
  if (originalData.financial_stability_weight > 0.8) {
    flags.push('high_financial_priority');
  }

  // Check for low risk tolerance
  if (originalData.parent_risk_tolerance < 0.3) {
    flags.push('low_risk_tolerance');
  }

  // Check for location restrictions
  if (originalData.location_preference === 'local' && originalData.migration_willingness === 'no') {
    flags.push('strict_location_constraint');
  }

  // Check for many unacceptable professions
  if (originalData.unacceptable_professions?.length > 5) {
    flags.push('many_career_restrictions');
  }

  return flags;
}

/**
 * GET /parent/preferences/:id
 * Retrieve a saved parent preference by ID
 */
export const getParentPreference = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const preference = await ParentPreference.findById(id);
    
    if (!preference) {
      return res.status(404).json({
        status: 'error',
        message: 'Parent preference not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: preference
    });
  } catch (error) {
    console.error('Error retrieving parent preference:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error retrieving preference',
      error: (error as Error).message
    });
  }
};

/**
 * POST /parent/preferences/:id/retry
 * Retry FastAPI analysis for a saved preference
 */
export const retryParentAnalysis = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const preference = await ParentPreference.findById(id);
    
    if (!preference) {
      return res.status(404).json({
        status: 'error',
        message: 'Parent preference not found'
      });
    }

    // Transform to FastAPI format
    const fastApiPayload = transformToFastApiFormat(preference.toObject());

    try {
      const fastApiResponse = await axios.post(
        `${FASTAPI_PARENT_URL}/rescore-parent`,
        fastApiPayload,
        {
          timeout: 15000,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const apiResult = fastApiResponse.data;

      // Update the analysis
      preference.analysis = {
        score: apiResult.final_recommendation.parent_score * 10,
        recommended_path: apiResult.final_recommendation.career_id,
        match_reason: apiResult.final_recommendation.parent_explanation,
        flags: generateFlags(apiResult, preference.toObject()),
        top_5_careers: apiResult.top_5_parent_scores,
        raw_parent_score: apiResult.final_recommendation.parent_score
      };

      preference.meta = {
        ...preference.meta,
        fastApiStatus: 'success',
        retriedAt: new Date().toISOString()
      };

      await preference.save();

      return res.status(200).json({
        status: 'success',
        message: 'Analysis retried successfully',
        prediction: preference.analysis,
        saved_id: preference._id
      });

    } catch (fastApiErr) {
      return res.status(500).json({
        status: 'error',
        message: 'FastAPI analysis still failing',
        error: axios.isAxiosError(fastApiErr) 
          ? fastApiErr.response?.data?.detail || fastApiErr.message
          : (fastApiErr as Error).message
      });
    }

  } catch (error) {
    console.error('Error retrying parent analysis:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during retry',
      error: (error as Error).message
    });
  }
};