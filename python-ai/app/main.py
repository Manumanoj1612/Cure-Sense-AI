from fastapi import FastAPI
from app.routers import symptom, prescription
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="AI Symptom Checker Service")

# Register Routers
app.include_router(symptom.router, prefix="/api/ai", tags=["AI"])
app.include_router(prescription.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
def read_root():
    return {"status": "AI Service Running", "model": "Gemini 1.5 Flash"}

if __name__ == '__main__':
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
