from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import os

# ------------------------------------------------------------
# IMPORT YOUR EXISTING FUNCTIONS (NO LOGIC CHANGES)
# ------------------------------------------------------------
# Make sure this file is in the SAME folder or update import path
from societal import (
    compute_recommendation,
    generate_gemini_explanation,
    map_array_to_responses
)

# ------------------------------------------------------------
# FASTAPI APP
# ------------------------------------------------------------
app = FastAPI(
    title="Career Influence Recommendation API",
    description="Career recommendation using Likert-scale inputs and Gemini explanation",
    version="1.0.0"
)

# ------------------------------------------------------------
# REQUEST / RESPONSE MODELS
# ------------------------------------------------------------

class RecommendationRequest(BaseModel):
    answers: list[int]   # array of 18 Likert values
 # semantic_key → Likert value (1–5)

class RecommendationResponse(BaseModel):
    bias_scores: Dict[str, float]
    domain_scores: Dict[str, float]
    recommended_domains: list[str]
    reason: str
    gemini_explanation: str


# ------------------------------------------------------------
# HEALTH CHECK
# ------------------------------------------------------------

@app.get("/")
def health_check():
    return {"status": "API is running"}


# ------------------------------------------------------------
# MAIN RECOMMENDATION ENDPOINT
# ------------------------------------------------------------

@app.post("/recommend", response_model=RecommendationResponse)
def recommend(req: RecommendationRequest):

    try:
        # 1️⃣ Core computation (your existing logic)
        responses = map_array_to_responses(req.answers)

        bias_scores, domain_scores, final_domains, reason = compute_recommendation( responses)


        # 2️⃣ Gemini explanation (presentation layer)
        gemini_text = generate_gemini_explanation(
            bias_scores,
            domain_scores,
            final_domains
        )

        return {
            "bias_scores": bias_scores,
            "domain_scores": domain_scores,
            "recommended_domains": final_domains,
            "reason": reason,
            "gemini_explanation": gemini_text
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
