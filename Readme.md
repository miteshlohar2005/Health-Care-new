# Rural Healthcare AI Platform

An AI-powered health screening and hospital locator platform built for rural and underserved communities.

---

## What it does

- **Symptom Checker** — Describe symptoms in natural language and get AI-powered preliminary analysis via Google Gemini
- **Image Analysis** — Upload photos of visible symptoms or medical reports for AI assessment
- **Hospital Locator** — Find nearest hospitals based on your GPS location from a database of 10,000+ facilities
- **Multilingual** — Supports English, Hindi (हिंदी), Marathi (मराठी), and Bengali (বাংলা)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| AI | Google Gemini Pro & Vision API |
| Database | Supabase (hospitals), CSV fallback |
| i18n | i18next |

---

## Project Structure

```
├── client/         # React + Vite frontend
│   └── src/
│       ├── pages/          # Home, SymptomChecker, HospitalLocator, ImageAnalysis
│       ├── components/     # UI components
│       ├── services/       # Axios API calls
│       └── locales/        # Translation files (en, hi, mr, bn)
│
└── server/         # Node.js + Express backend
    ├── routes/             # API route handlers
    ├── services/           # Gemini AI, DB, CSV logic
    └── server.js           # Entry point
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Google Gemini API Key
- Supabase project (optional, CSV fallback available)

### Backend
```bash
cd server
npm install
# Create .env with PORT, GEMINI_API_KEY, SUPABASE_URL, SUPABASE_KEY
npm start
```

### Frontend
```bash
cd client
npm install
# Create .env with VITE_API_URL=http://localhost:5000
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analyze-symptoms` | AI symptom analysis |
| POST | `/api/follow-up` | Follow-up Q&A |
| POST | `/api/analyze-image` | Medical image analysis |
| POST | `/api/hospitals/nearest-hospitals` | Find nearby hospitals |
| GET | `/health` | Server health check |

---

## Deployment

- **Frontend** → [Vercel](https://vercel.com) (set `VITE_API_URL` env var)
- **Backend** → [Render](https://render.com) (set all `.env` vars in dashboard)

---

> **Disclaimer:** This tool is for informational purposes only and does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.
