@echo off
echo Starting Cure-Sense-AI Backend Services...

:: Start Python AI Service (OCR Only)
start "Python OCR Service" cmd /k "cd ai_service && echo Installing Python Deps... && pip install -r requirements.txt && echo Starting FastAPI... && python main.py"

:: Start Node.js Backend (Gateway + Gemini)
start "Node.js Backend" cmd /k "cd backend && echo Installing Node Deps... && npm install && echo Starting Node Server... && npm run dev"

echo Services started!
echo Python OCR: http://localhost:8000
echo Node.js API: http://localhost:5000
echo.
pause
