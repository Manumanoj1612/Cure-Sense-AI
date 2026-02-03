from fastapi import APIRouter, UploadFile, File, HTTPException
import easyocr
import numpy as np
import io
from PIL import Image
from app.services.gemini_service import extract_prescription_details

router = APIRouter()

# Initialize EasyOCR Reader once (loading model takes time)
reader = easyocr.Reader(['en']) 

@router.post("/prescription")
async def read_prescription(file: UploadFile = File(...)):
    try:
        # Read image file
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to numpy for EasyOCR
        image_np = np.array(image)
        
        # Extract text
        result = reader.readtext(image_np, detail=0)
        extracted_text = " ".join(result)
        
        # Process with Gemini
        medicine_data = await extract_prescription_details(extracted_text)
        
        return medicine_data

    except Exception as e:
        print(f"Error processing prescription: {e}")
        raise HTTPException(status_code=500, detail=str(e))
