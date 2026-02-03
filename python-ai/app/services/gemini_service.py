import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use a model that supports both text and images if possible, or separate.
# gemini-1.5-flash is multimodal and fast.
MODEL_NAME = 'gemini-1.5-flash'

def get_model():
    return genai.GenerativeModel(MODEL_NAME)

async def analyze_symptoms(symptoms: list, age: int, duration: str, severity: str):
    model = get_model()
    prompt = f"""
    Act as a medical symptom checker AI.
    Patient Profile:
    - Age: {age}
    - Symptoms: {", ".join(symptoms)}
    - Duration: {duration}
    - Self-reported Severity: {severity}

    Task: Analyze the symptoms and provide a structured assessment.
    
    Response Format (Strict JSON):
    {{
        "conditions": [
            {{ "name": "Condition Name", "confidence": 0.0-1.0 (float) }}
        ],
        "severity": "Low/Medium/High/Critical",
        "advice": "Actionable medical advice",
        "disclaimer": "This is not a medical diagnosis. Consult a professional."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except Exception as e:
        print(f"Gemini Error: {e}")
        return {"error": "AI Analysis Failed", "details": str(e)}

async def extract_prescription_details(text: str):
    model = get_model()
    prompt = f"""
    Extract structured medicine details from this OCR text of a prescription:
    "{text}"

    Response Format (Strict JSON):
    {{
        "medicines": [
            {{
                "name": "Medicine Name",
                "dosage": "e.g. 500mg",
                "frequency": "e.g. Twice daily",
                "duration": "e.g. 5 days"
            }}
        ]
    }}
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except Exception as e:
        print(f"Gemini Prescription Error: {e}")
        return {"medicines": []}
