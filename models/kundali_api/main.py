from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from starlette.responses import JSONResponse

app = FastAPI(title="NavRiti Kundali API (standalone)")

# Lazy-initialized generator to avoid importing heavy deps at module import time
kundali_generator: Optional[Any] = None

class KundaliInput(BaseModel):
    birth_date: str = Field(..., description="YYYY-MM-DD")
    birth_time: str = Field(..., description="HH:MM (24h)")
    birth_place: str = Field(...)
    personality_traits: Optional[Dict[str, int]] = None

@app.get("/health")
def health():
    return {"status": "ok", "kundali_ready": kundali_generator is not None}

@app.post("/kundali")
def kundali(payload: KundaliInput):
    global kundali_generator
    if kundali_generator is None:
        try:
            import starfinal
            kundali_generator = starfinal.KundaliGenerator()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to initialize KundaliGenerator: {e}")

    try:
        result = kundali_generator.generate_kundali(
            birth_date=payload.birth_date,
            birth_time=payload.birth_time,
            birth_place=payload.birth_place,
            personality_traits=payload.personality_traits
        )
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
