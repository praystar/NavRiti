import os
from pathlib import Path
from typing import List, Dict, Any

import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# ---------- NEW GOOGLE GENAI SDK ----------
try:
    # This is the correct import for the 'google-genai' package
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: 'google-genai' not found. Run 'pip install google-genai'")

# Initialize Client
API_KEY = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=API_KEY) if API_KEY else None

# ---------- Paths ----------
BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "parent_only_synthetic_dataset.csv"
MODEL_PATH = BASE_DIR / "models" / "parent_layer" / "parent_model_rf.joblib"
PREPROCESSOR_PATH = BASE_DIR / "models" / "preprocessors" / "parent_preprocessor_coltransformer.joblib"

# ---------- Load ML artifacts ----------
try:
    model = joblib.load(MODEL_PATH)
    preprocessor = joblib.load(PREPROCESSOR_PATH)
except Exception as e:
    print(f"Warning: ML artifacts could not be loaded: {e}")

# ---------- Load careers ----------
careers_df = (
    pd.read_csv(DATA_PATH)[
        ["career_id", "c_avg_salary", "c_job_security", "c_prestige", "c_tuition", "c_location"]
    ]
    .drop_duplicates("career_id")
)

app = FastAPI(title="Parent Recommendation API", version="1.3")

class ParentInput(BaseModel):
    budget_max_tuition: float = Field(..., gt=0)
    importance_finances: int = Field(..., ge=1, le=5)
    importance_job_security: int = Field(..., ge=1, le=5)
    importance_prestige: int = Field(..., ge=1, le=5)
    parent_risk_tolerance: int = Field(..., ge=1, le=5)
    influence_from_people: int = Field(..., ge=1, le=5)
    location_preference: str = Field(..., pattern="^(local|national|international)$")
    migration_allowed: bool
    unacceptable_careers: List[str] = []

def normalize_likert(x: int) -> float:
    return (x - 1) / 4.0

def location_match(parent_pref: str, career_loc: str) -> int:
    order = {"local": 0, "national": 1, "international": 2}
    return int(order[career_loc] <= order[parent_pref])

def explain_with_gemini(career_id: str, score: float, context: Dict[str, Any]) -> str:
    if not client:
        return "Recommended based on financial stability and prestige."

    prompt = f"""
    As a career advisor, explain why '{career_id}' is a great fit for a student.
    Parent's priorities: Finance Importance ({context['fin']}/5), Prestige Importance ({context['pre']}/5).
    Recommendation Score: {round(score, 2)}.
    Keep it to 2-3 warm, professional sentences for a parent.
    """
    
    try:
        # Correct syntax for the new google-genai SDK
        response = client.models.generate_content(
            model="gemini-2.5-pro",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Gemini error: {e}")
        return "This career aligns with your goals for long-term stability and professional prestige."

@app.post("/rescore-parent")
async def rescore_parent(input: ParentInput):
    # Process ML logic
    parent_features = {
        "p_financial_weight": normalize_likert(input.importance_finances),
        "p_job_security_weight": normalize_likert(input.importance_job_security),
        "p_prestige_weight": normalize_likert(input.importance_prestige),
        "p_parent_risk_tolerance": normalize_likert(input.parent_risk_tolerance),
        "p_weight_on_parent_layer": normalize_likert(input.influence_from_people),
        "p_budget_max_tuition": input.budget_max_tuition,
    }

    rows = []
    career_ids = []
    for _, c in careers_df.iterrows():
        row = {
            **parent_features,
            "c_avg_salary": c.c_avg_salary,
            "c_job_security": c.c_job_security,
            "c_prestige": c.c_prestige,
            "c_tuition": c.c_tuition,
            "f_fin_ratio": c.c_avg_salary / max(1, input.budget_max_tuition * 3),
            "f_tuition_affordable": int(c.c_tuition <= input.budget_max_tuition),
            "f_location_match": location_match(input.location_preference, c.c_location),
            "f_migration_ok": int(input.migration_allowed or c.c_location != "international"),
            "f_is_unacceptable": int(c.career_id in input.unacceptable_careers),
            "f_risk_penalty": 1.0
        }
        rows.append(row)
        career_ids.append(c.career_id)

    X = preprocessor.transform(pd.DataFrame(rows))
    scores = model.predict(X)

    results = sorted(
        [{"career_id": career_ids[i], "parent_score": round(float(scores[i]), 3)} for i in range(len(scores))],
        key=lambda x: x["parent_score"],
        reverse=True
    )

    best = results[0]
    explanation = explain_with_gemini(
        best["career_id"], 
        best["parent_score"], 
        {"fin": input.importance_finances, "pre": input.importance_prestige}
    )

    return {
        "top_5_parent_scores": results[:5],
        "final_recommendation": {
            "career_id": best["career_id"],
            "parent_score": best["parent_score"],
            "parent_explanation": explanation
        }
    }