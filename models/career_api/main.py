from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from starlette.responses import JSONResponse
import tempfile
import os

# Import the existing predictor
from studentlogicfinal import NaviRitiCareerPredictor

app = FastAPI(title="NavRiti FastAPI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for inputs
class Stage1Input(BaseModel):
    name: str = Field(...)
    grade: int = Field(..., ge=6, le=12)
    subject_preferences: List[str] = []
    extracurricular_activities: List[str] = []
    hobbies: Optional[str] = ""
    achievements: Optional[str] = ""
    dream_career: Optional[str] = ""

class Stage2Input(BaseModel):
    name: str = Field(...)
    input_data: Dict[str, Any] = {}

# Create a single predictor instance (reused across requests)
predictor = NaviRitiCareerPredictor()

@app.get("/health")
def health():
    return {"status": "ok", "ai_enabled": predictor.ai_enabled}


@app.get("/")
def root():
    """Redirect root to interactive docs for convenience."""
    return RedirectResponse(url="/docs")

@app.post("/stage1")
async def stage1(payload: Stage1Input):
    try:
        inputs = {
            'grade': payload.grade,
            'subject_preferences': payload.subject_preferences,
            'extracurricular_activities': payload.extracurricular_activities,
            'hobbies': payload.hobbies,
            'achievements': payload.achievements,
            'dream_career': payload.dream_career,
            'input_method': 'api'
        }
        result = predictor.generate_stage1_output_with_ai(payload.name, inputs)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stage2")
async def stage2(payload: Stage2Input):
    try:
        # payload.input_data should follow the manual/parsed CV structure expected by generator
        result = predictor.generate_stage2_output_with_ai(payload.name, payload.input_data)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload_cv")
async def upload_cv(name: str, file: UploadFile = File(...)):
    """Upload a CV (PDF) file, parse it, and run stage2 predictions."""
    try:
        # write upload to a temporary file
        suffix = os.path.splitext(file.filename)[1] or ".pdf"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp_path = tmp.name
            content = await file.read()
            tmp.write(content)

        cv_data = predictor.parse_cv_with_llm(tmp_path)

        # cleanup
        try:
            os.remove(tmp_path)
        except Exception:
            pass

        if not cv_data.get('parsed_successfully'):
            return JSONResponse(content={
                'parsed_successfully': False,
                'error': cv_data.get('error', 'parsing_failed'),
                'cv_data': cv_data
            })

        cv_data['input_method'] = 'cv_api'
        result = predictor.generate_stage2_output_with_ai(name, cv_data)

        return JSONResponse(content={
            'parsed_successfully': True,
            'cv_data': cv_data,
            'stage2_result': result
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save_report")
async def save_report(report: Dict[str, Any], ref_path: Optional[str] = None):
    try:
        path = predictor.save_report(report, ref_path)
        return {"saved_path": path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

