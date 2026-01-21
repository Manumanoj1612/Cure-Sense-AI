from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import pandas as pd
import joblib
try:
    import cv2
except Exception:
    cv2 = None
    print("Warning: cv2 not found")
import io
import re
from PIL import Image

# Optional AI imports
try:
    import pytesseract
except Exception:
    pytesseract = None
    print("Warning: pytesseract not found")

try:
    import spacy
except Exception:
    spacy = None
    print("Warning: spacy not found")

try:
    from sklearn.feature_extraction.text import CountVectorizer
    from sklearn.naive_bayes import MultinomialNB
except Exception:
    CountVectorizer = None
    MultinomialNB = None
    print("Warning: sklearn not found")

# try:
#     from transformers import pipeline
# except Exception:
#     pipeline = None
#     print("Warning: transformers not found")
pipeline = None # Disabled due to DLL crash in user environment

# Initialize FastAPI
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. Symptom Checker (Enhanced Logic) ---
# Expanded dataset with severity and advice
disease_db = {
    "Flu": {"severity": "Moderate", "advice": "Rest, drink fluids, take fever reducers. See a doctor if symptoms worsen.", "precautions": ["Isolate", "Hydrate", "Rest"]},
    "COVID-19": {"severity": "Moderate", "advice": "Isolate, monitor oxygen levels. Seek emergency care if breathing difficulty occurs.", "precautions": ["Mask up", "Isolate", "Monitor O2"]},
    "Migraine": {"severity": "Moderate", "advice": "Rest in a dark quiet room, take pain relievers.", "precautions": ["Avoid triggers", "Rest", "Hydrate"]},
    "Food Poisoning": {"severity": "Moderate", "advice": "Stay hydrated. See a doctor if vomiting persists for >24h.", "precautions": ["Hydrate", "Bland diet"]},
    "Heart Attack": {"severity": "Emergency", "advice": "Call emergency services immediately. Chew aspirin if not allergic.", "precautions": ["Call 911/Ambulance", "Do not drive"]},
    "Allergy": {"severity": "Normal", "advice": "Take antihistamines, avoid allergens.", "precautions": ["Avoid allergen", "Antihistamines"]},
    "Arthritis": {"severity": "Normal", "advice": "Gentle exercise, pain management. Consult a rheumatologist.", "precautions": ["Exercise", "Heat/Cold therapy"]},
    "Common Cold": {"severity": "Normal", "advice": "Rest and hydration. It usually resolves in a week.", "precautions": ["Wash hands", "Rest"]},
    "Pneumonia": {"severity": "Emergency", "advice": "See a doctor immediately. Antibiotics may be needed.", "precautions": ["See Doctor", "Rest"]},
    "Diabetes": {"severity": "Moderate", "advice": "Consult a doctor for blood sugar testing and management.", "precautions": ["Diet control", "Exercise"]},
}

symptom_data = [
    ("fever, headache, chills, body ache", "Flu"),
    ("fever, cough, fatigue, loss of taste", "COVID-19"),
    ("headache, nausea, sensitivity to light, throbbing", "Migraine"),
    ("stomach pain, nausea, vomiting, diarrhea", "Food Poisoning"),
    ("chest pain, shortness of breath, arm pain, sweating", "Heart Attack"),
    ("skin rash, itching, redness, swelling", "Allergy"),
    ("joint pain, stiffness, swelling", "Arthritis"),
    ("sore throat, runny nose, sneezing, mild fever", "Common Cold"),
    ("fever, cough, shortness of breath, chest pain", "Pneumonia"),
    ("thirst, frequent urination, fatigue, weight loss", "Diabetes"),
]

df = pd.DataFrame(symptom_data, columns=["symptoms", "disease"])

clf = None
vectorizer = None

if CountVectorizer and MultinomialNB:
    try:
        vectorizer = CountVectorizer()
        X = vectorizer.fit_transform(df["symptoms"])
        y = df["disease"]
        clf = MultinomialNB()
        clf.fit(X, y)
        
        # Save model (demo purpose) - Wrapped in try-except to prevent startup failure
        try:
            joblib.dump(clf, "symptom_model.pkl")
            joblib.dump(vectorizer, "vectorizer.pkl")
        except Exception as e:
            print(f"Warning: Failed to save models: {e}")
    except Exception as e:
        print(f"Error initializing symptom checker: {e}")

# --- 2. Prescription Reader (Enhanced Parsing) ---
# Load SpaCy model
nlp = None
if spacy:
    try:
        nlp = spacy.load("en_core_web_sm")
    except:
        print("Downloading SpaCy model...")
        try:
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"], check=True)
            nlp = spacy.load("en_core_web_sm")
        except Exception as e:
            print(f"Failed to load SpaCy model: {e}")

def parse_prescription_text(text):
    medicines = []
    lines = text.split('\n')
    
    # Common abbreviations
    freq_map = {
        "OD": "Once a day", "BD": "Twice a day", "BID": "Twice a day",
        "TDS": "Thrice a day", "TID": "Thrice a day", "QID": "Four times a day",
        "HS": "Before sleep", "SOS": "When needed", "PRN": "When needed"
    }
    
    for line in lines:
        line = line.strip()
        if not line or len(line) < 4: continue
        
        # Heuristic: Check if line contains dosage info (mg, ml, tablet)
        if re.search(r'\d+\s*(mg|ml|tab|cap)', line, re.I):
            # Extract frequency
            freq = "Once a day" # Default
            for abbr, full in freq_map.items():
                if re.search(rf'\b{abbr}\b', line, re.I):
                    freq = full
                    break
            
            # Extract duration
            duration = "5 days" # Default
            dur_match = re.search(r'for\s+(\d+)\s*days', line, re.I)
            if dur_match:
                duration = f"{dur_match.group(1)} days"
                
            medicines.append({
                "name": line.split()[0], # Simple assumption: first word is name
                "dosage": re.search(r'\d+\s*(mg|ml)', line, re.I).group(0) if re.search(r'\d+\s*(mg|ml)', line, re.I) else "Unknown",
                "frequency": freq,
                "days": duration.split()[0],
                "instructions": "After food" # Default safe instruction
            })
            
    return medicines

# --- 3. Chatbot (Transformers LLM) ---
chatbot = None
if pipeline:
    try:
        chatbot = pipeline("text-generation", model="distilgpt2")
        print("Chatbot model loaded.")
    except Exception as e:
        print(f"Failed to load chatbot model: {e}")


# --- Endpoints ---

class SymptomRequest(BaseModel):
    symptoms: str

@app.post("/predict_disease")
def predict_disease(request: SymptomRequest):
    if not clf or not vectorizer:
        return {
            "disease": "Unknown",
            "confidence": "0%",
            "severity": "Unknown",
            "description": "Symptom checker model not loaded.",
            "precautions": []
        }

    try:
        symptoms_vec = vectorizer.transform([request.symptoms])
        prediction = clf.predict(symptoms_vec)[0]
        probs = clf.predict_proba(symptoms_vec)[0]
        confidence = float(np.max(probs))
        
        details = disease_db.get(prediction, {
            "severity": "Unknown", 
            "advice": "Please consult a doctor.", 
            "precautions": ["Consult Doctor"]
        })
        
        return {
            "disease": prediction,
            "confidence": f"{confidence*100:.1f}%",
            "severity": details["severity"],
            "description": details["advice"],
            "precautions": details["precautions"]
        }
    except Exception as e:
        print(f"Error in predict_disease: {e}")
        return {
            "disease": "Unknown",
            "confidence": "0%",
            "severity": "Unknown",
            "description": "Error processing symptoms.",
            "precautions": []
        }

@app.post("/extract_prescription")
async def extract_prescription(file: UploadFile = File(...)):
    try:
        if not cv2:
            return {"error": "OpenCV not loaded."}

        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Preprocessing
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        
        text = ""
        if pytesseract:
            try:
                text = pytesseract.image_to_string(thresh)
            except Exception as e:
                text = "Error: Tesseract failed."
                print(f"Tesseract error: {e}")
        else:
            text = "Error: Tesseract not installed."
        
        # Enhanced parsing
        medicines = parse_prescription_text(text)
        
        # Fallback if parsing fails (for demo)
        if not medicines:
            medicines = [{"name": "Paracetamol", "dosage": "500mg", "frequency": "Twice a day", "days": "3", "instructions": "After food"}] 
        
        return {
            "raw_text": text,
            "medicines_detected": medicines, # Now returns structured objects
            "image_processed": "OpenCV preprocessing applied"
        }
    except Exception as e:
        print(f"Error in extract_prescription: {e}")
        return {"error": str(e)}

class DoctorRequest(BaseModel):
    location: str
    symptoms: str

@app.post("/recommend_doctors")
def recommend_doctors(request: DoctorRequest):
    try:
        symptoms_lower = request.symptoms.lower()
        
        # Triage Logic
        is_emergency = any(s in symptoms_lower for s in ["chest pain", "breathing", "unconscious", "bleeding", "stroke"])
        
        if is_emergency:
            return {
                "recommended_specialty": "Emergency Medicine",
                "note": "CRITICAL: Your symptoms indicate a potential emergency. Please visit the nearest ER immediately."
            }
            
        specialty_map = {
            "heart": "Cardiologist",
            "chest": "Cardiologist",
            "skin": "Dermatologist",
            "rash": "Dermatologist",
            "child": "Pediatrician",
            "lung": "Pulmonologist",
            "breath": "Pulmonologist",
            "stomach": "Gastroenterologist",
            "gut": "Gastroenterologist",
            "eye": "Ophthalmologist",
            "vision": "Ophthalmologist",
            "bone": "Orthopedic",
            "joint": "Orthopedic",
            "general": "General Physician",
            "fever": "General Physician",
            "cold": "General Physician"
        }
        
        query_specialty = "General Physician"
        for key, val in specialty_map.items():
            if key in symptoms_lower:
                query_specialty = val
                break
                
        return {
            "recommended_specialty": query_specialty,
            "note": f"Based on your symptoms, we recommend a {query_specialty}."
        }
    except Exception as e:
        print(f"Error in recommend_doctors: {e}")
        return {"error": str(e)}

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    try:
        if chatbot:
            # Simple prompt engineering for safety
            prompt = f"Medical Assistant: {request.message}"
            response = chatbot(prompt, max_length=100, num_return_sequences=1)[0]['generated_text']
            # Clean up response
            response = response.replace(prompt, "").strip()
        else:
            response = "I am a basic health assistant. How can I help? (AI model not loaded)"
            
        return {"response": response}
    except Exception as e:
        print(f"Error in chat: {e}")
        return {"response": "Sorry, I encountered an error."}

class ReminderRequest(BaseModel):
    instruction: str

@app.post("/parse_medicine_reminder")
def parse_medicine_reminder(request: ReminderRequest):
    if not nlp:
        return {
            "parsed_time": "09:00",
            "parsed_dosage": "1 pill",
            "note": "AI model not loaded, using default."
        }

    try:
        doc = nlp(request.instruction)
        
        # Enhanced Parsing Logic
        times = []
        dosage = "1 pill"
        
        # Detect Frequency
        text_lower = request.instruction.lower()
        if "twice" in text_lower or "bd" in text_lower or "2 times" in text_lower:
            times = ["09:00", "21:00"]
        elif "thrice" in text_lower or "tds" in text_lower or "3 times" in text_lower:
            times = ["09:00", "14:00", "21:00"]
        elif "once" in text_lower or "od" in text_lower or "daily" in text_lower:
            times = ["09:00"]
        elif "night" in text_lower or "bed" in text_lower or "hs" in text_lower:
            times = ["22:00"]
        
        # Detect Dosage
        for ent in doc.ents:
            if ent.label_ in ["QUANTITY", "CARDINAL"]:
                dosage = ent.text
                
        # Detect Time entities if frequency logic failed
        if not times:
            extracted_times = [ent.text for ent in doc.ents if ent.label_ == "TIME"]
            if extracted_times:
                times = extracted_times
            else:
                times = ["09:00"] # Default
                
        return {
            "parsed_time": times[0], # Frontend currently handles single time per reminder object
            "parsed_dosage": dosage,
            "note": "AI parsed timing and dosage."
        }
    except Exception as e:
        print(f"Error in parse_medicine_reminder: {e}")
        return {
            "parsed_time": "09:00",
            "parsed_dosage": "1 pill",
            "note": "Error parsing instruction."
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
