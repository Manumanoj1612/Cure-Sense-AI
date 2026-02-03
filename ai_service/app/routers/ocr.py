from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.ocr_service import extract_text_from_image

router = APIRouter()

@router.post("/ocr")
async def get_ocr_text(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = extract_text_from_image(content)
        if not text:
            return {"text": "", "warning": "No text detected"}
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
