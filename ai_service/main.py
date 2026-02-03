from fastapi import FastAPI
from app.routers import ocr
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Service (OCR Only)")

app.include_router(ocr.router, prefix="/api/ai", tags=["OCR"])

@app.get("/")
def read_root():
    return {"status": "OCR Service Running"}

if __name__ == '__main__':
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
