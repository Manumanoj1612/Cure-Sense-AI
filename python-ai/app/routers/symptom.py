from fastapi import APIRouter, HTTPException
from app.schemas.request_models import SymptomCheckRequest
from app.services.gemini_service import analyze_symptoms

router = APIRouter()

@router.post("/symptom-check")
async def check_symptoms(request: SymptomCheckRequest):
    result = await analyze_symptoms(
        request.symptoms, 
        request.age, 
        request.duration, 
        request.severity
    )
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["details"])
    return result
