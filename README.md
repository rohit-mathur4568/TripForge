<div align="center">

<img src="https://img.shields.io/badge/TripForge-2.0.0-6366f1?style=for-the-badge&logo=airplane&logoColor=white" alt="TripForge" />

# ✈️ TripForge

### *AI-Powered Multi-Agent Travel Planning Platform*

<p>
  Plan smarter journeys with a coordinated team of AI agents — from destination research and budget breakdowns to day-by-day itineraries and local recommendations.
</p>

[![FastAPI](https://img.shields.io/badge/FastAPI-2.0.0-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![DynamoDB](https://img.shields.io/badge/DynamoDB-AWS-FF9900?style=flat-square&logo=amazondynamodb&logoColor=white)](https://aws.amazon.com/dynamodb/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

</div>

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#-api-reference)
- [Multi-Agent System](#-multi-agent-system)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌍 Overview

**TripForge** is a full-stack AI travel planning platform that uses a **multi-agent architecture** to generate complete, personalized trip itineraries. Users input their preferences — origin, destination, dates, budget, travel style, and interests — and TripForge's network of specialized AI agents collaborates behind the scenes to produce a comprehensive journey plan in seconds.

The platform includes **JWT-authenticated user accounts**, a **trip history dashboard**, an **interactive AI chat assistant**, **interactive maps via Leaflet**, and **budget analytics via Recharts**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Multi-Agent Planning** | Supervisor orchestrates 4 specialized agents for destination, budget, itinerary, and recommendations |
| 🗺️ **Interactive Maps** | Visualize your journey with Leaflet & React-Leaflet integration |
| 💬 **AI Chat Assistant** | Ask follow-up travel questions with a built-in chatbot |
| 📊 **Budget Analytics** | Detailed budget breakdowns and spending visualizations with Recharts |
| 🔐 **JWT Authentication** | Secure sign-up / sign-in with token-based auth |
| 💾 **Trip History** | Save, revisit, and manage all past generated itineraries |
| 🎉 **Confetti Celebrations** | Delightful micro-interactions on trip generation completion |
| 📱 **Responsive UI** | Fully responsive design across desktop and mobile |
| ⚡ **Admin Analytics** | System-level usage analytics dashboard |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    TripForge Platform                   │
│                                                         │
│  ┌──────────────┐          ┌────────────────────────┐  │
│  │   React 19   │  REST    │   FastAPI Backend       │  │
│  │   Frontend   │◄────────►│   (Python 3.11+)        │  │
│  │   (Vite 8)   │  JSON    │                        │  │
│  └──────────────┘          └──────────┬─────────────┘  │
│                                       │                 │
│                            ┌──────────▼─────────────┐  │
│                            │   Supervisor Agent      │  │
│                            │   (Orchestrator)        │  │
│                            └──┬───┬───────┬──────────┘  │
│                    ┌──────────┘   │       └──────────┐  │
│           ┌────────▼──┐  ┌────────▼──┐  ┌───────────▼┐ │
│           │Destination│  │  Budget   │  │ Itinerary  │ │
│           │   Agent   │  │   Agent   │  │   Agent    │ │
│           └───────────┘  └───────────┘  └────────────┘ │
│                    ┌─────────────────────┐              │
│                    │ Recommendation Agent│              │
│                    └──────────┬──────────┘              │
│                               │                         │
│                    ┌──────────▼─────────────┐           │
│                    │   AWS DynamoDB          │           │
│                    │   (Trip Storage)        │           │
│                    └────────────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Framework | [FastAPI](https://fastapi.tiangolo.com/) 2.0.0 |
| Language | Python 3.11+ |
| Auth | JWT (JSON Web Tokens) |
| Database | AWS DynamoDB |
| Location Services | Custom location service |
| AI Agents | Custom multi-agent pipeline |

### Frontend

| Layer | Technology |
|---|---|
| Framework | [React](https://react.dev/) 19 |
| Build Tool | [Vite](https://vitejs.dev/) 8 |
| Styling | [TailwindCSS](https://tailwindcss.com/) 4 |
| Routing | React Router 8 |
| Maps | Leaflet + React-Leaflet |
| Charts | Recharts |
| Icons | Lucide React |
| Linting | OxLint |

---

## 📁 Project Structure

```
TripForge/
├── backend/
│   ├── agents/
│   │   ├── supervisor_agent.py       # Orchestrates the full journey pipeline
│   │   ├── destination_agent.py      # Destination research & overview
│   │   ├── budget_agent.py           # Budget breakdown & cost estimation
│   │   ├── itinerary_agent.py        # Day-by-day itinerary generation
│   │   ├── recommendation_agent.py   # Local tips & recommendations
│   │   └── assistant_agent.py        # Conversational chat assistant
│   ├── database/
│   │   └── dynamodb.py               # DynamoDB CRUD operations
│   ├── routes/
│   │   └── auth_routes.py            # Auth endpoints (sign-up, sign-in)
│   ├── services/
│   │   ├── auth_service.py           # JWT token logic & password hashing
│   │   ├── current_user.py           # Auth dependency injection
│   │   └── location_service.py       # Location resolution & geocoding
│   ├── auth.py                       # Auth helpers
│   ├── main.py                       # FastAPI app entry point & routes
│   └── requirements.txt              # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── UserSignInPage.jsx
    │   │   ├── UserSignUpPage.jsx
    │   │   ├── TripPlannerFormPage.jsx
    │   │   ├── ItineraryGeneratingPage.jsx
    │   │   ├── GeneratedTripItineraryPage.jsx
    │   │   ├── UserDashboardHistoryPage.jsx
    │   │   └── AdminSystemAnalyticsPage.jsx
    │   ├── components/               # Reusable UI components
    │   ├── context/                  # React context providers
    │   ├── services/                 # API call utilities
    │   ├── layouts/                  # Page layout wrappers
    │   └── utils/                    # Helper utilities
    ├── public/                       # Static assets
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Python** `>= 3.11`
- **Node.js** `>= 18.x`
- **npm** `>= 9.x`
- An **AWS account** with DynamoDB access (access key & secret required)

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables (see Environment Variables section)
cp .env.example .env   # then fill in your values

# 5. Start the development server
uvicorn main:app --reload --port 8000
```

The API will be live at: **`http://localhost:8000`**
Interactive docs available at: **`http://localhost:8000/docs`**

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be live at: **`http://localhost:5173`**

---

## 📡 API Reference

### Health & Status

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Service status check |
| `GET` | `/health` | Health probe |

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/signup` | Register a new user | ❌ |
| `POST` | `/auth/signin` | Sign in & receive JWT | ❌ |

### Trips

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/trips/generate` | Generate a complete AI trip plan | ✅ |
| `POST` | `/trips/save` | Save a generated trip | ✅ |
| `GET` | `/trips` | List all saved trips | ✅ |
| `GET` | `/trips/{trip_id}` | Get a specific trip | ✅ |
| `DELETE` | `/trips/{trip_id}` | Delete a saved trip | ✅ |

### Assistant

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/chat` | Chat with the travel AI assistant | ❌ |

> All authenticated routes require the `Authorization: Bearer <token>` header.

---

## 🤖 Multi-Agent System

TripForge's backend is powered by a **pipeline of specialized agents**, orchestrated by a central supervisor:

```
POST /trips/generate
        │
        ▼
┌─────────────────────┐
│   Supervisor Agent  │  ← Coordinates the full pipeline
└──────────┬──────────┘
           │ Calls in sequence:
           ├── 1. destination_agent    → Journey overview & highlights
           ├── 2. budget_agent         → Cost breakdown by category
           ├── 3. itinerary_agent      → Day-by-day schedule
           └── 4. recommendation_agent → Local tips, food, & must-sees
```

Each agent is independently responsible for its domain, making the system **modular, testable, and extensible**.

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# DynamoDB Table Names
DYNAMODB_TRIPS_TABLE=tripforge-trips
DYNAMODB_USERS_TABLE=tripforge-users

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# AI / LLM Configuration
OPENAI_API_KEY=your_openai_api_key
```

> ⚠️ **Never commit your `.env` file to version control.** It is already listed in `.gitignore`.

---

## 🤝 Contributing

Contributions are warmly welcome! To get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and ensure the linter passes (`npm run lint` in the frontend).

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using FastAPI, React, and multi-agent AI

⭐ **Star this repo** if TripForge helped you plan a great trip!

</div>
