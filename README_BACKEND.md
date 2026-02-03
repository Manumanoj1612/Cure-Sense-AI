# Backend Setup Instructions

## Prerequisites
- Node.js installed
- Python installed
- MongoDB running locally

## 1. Node.js Backend
1. Navigate to `backend/` directory.
2. Install dependencies (if not already):
   ```bash
   npm install
   ```
3. Update `.env` file with your secrets (especially `MONGO_URI` and `JWT_SECRET`).
4. Run the server:
   ```bash
   npm run dev
   ```
   Server will start on `http://localhost:5000`.

## 2. Python AI Service
1. Navigate to `ai_service/` directory.
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: This includes EasyOCR and PyTorch, which might take some time.*
4. Update `.env` file with your `GEMINI_API_KEY`.
5. Run the service:
   ```bash
   python app.py
   ```
   Service will start on `http://localhost:8000`.

## 3. Frontend Integration
The frontend is already configured to talk to `http://localhost:5000` which proxies AI requests to `http://localhost:8000`. Ensure both backend services are running for full functionality.
