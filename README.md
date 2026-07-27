# 🌍 TripForge - AI-Powered Travel Architect

![TripForge Banner](https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80)

> **TripForge** is a premium, AI-driven travel planning platform that generates highly optimized, budget-aware, and personalized travel itineraries in seconds. Built with a modern microservices architecture and a gorgeous SaaS-tier user interface.

## ✨ Key Features

- **🤖 Multi-Agent AI Core**: Utilizes specialized AI agents (Supervisor, Planner, Destination, and Chatbot) for generating dynamic, conflict-free, and logically sound itineraries.
- **🎨 Premium UI/UX**: State-of-the-art interface built with React and Tailwind CSS, featuring automated Dark/Light modes, glassmorphism, and responsive design.
- **📊 Interactive Dashboards**: Visual analytics, budget tracking, and demographic breakdowns for both Users and Administrators using Recharts.
- **🗺️ Interactive Maps**: Real-time itinerary visualization using Leaflet maps.
- **🔒 Secure Authentication**: Robust JWT-based authentication system with Role-Based Access Control (RBAC).

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS, Lucide Icons
- **Data Visualization**: Recharts
- **Routing**: React Router v7

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **AI Core**: LangChain / OpenAI API (Multi-agent architecture)
- **Database**: SQLite (Local Dev) / DynamoDB Support

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Valid API keys (OpenAI, Unsplash, etc.)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:
```env
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
```

Run the backend server:
```bash
python -m uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be running at `http://localhost:5173`.

## 📁 Architecture Overview

```text
TripForge/
├── backend/
│   ├── agents/          # Specialized AI agents (Planner, Chatbot, etc.)
│   ├── database/        # Database models and db_store configuration
│   ├── services/        # Third-party integrations (Location, Images)
│   ├── auth.py          # JWT and RBAC logic
│   └── main.py          # FastAPI application entry point
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI elements (Map, ChatBot, Modals)
    │   ├── layouts/     # Dashboard layouts
    │   ├── pages/       # Core application pages (Landing, Dashboards, Results)
    │   └── services/    # API interaction layer
    └── package.json
```

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
