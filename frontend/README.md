# 🌍 TripForge

AI-Powered Smart Travel Planning Platform built using **React, FastAPI, AWS DynamoDB, JWT Authentication, and Python**.

TripForge helps users generate personalized travel plans based on destination, budget, travel style, travel dates, and interests. Users can securely register, log in, generate AI-powered itineraries, and save their journeys.

---

# 🚀 Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing (bcrypt)
- Protected APIs

---

## AI Travel Planner

- Personalized Trip Generation
- Budget Planning
- Day-wise Itinerary
- Journey Overview
- Travel Recommendations
- Travel Tips

---

## Journey Management

- Save Journey
- View Saved Journeys
- Delete Saved Journey
- User-specific Trip Storage

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React

## Backend

- FastAPI
- Python
- Pydantic
- JWT
- bcrypt

## Database

- AWS DynamoDB

## Cloud

- AWS CLI
- AWS EC2

## Version Control

- Git
- GitHub

---

# 📂 Project Structure

```text
TripForge
│
├── backend
│   ├── agents
│   ├── database
│   ├── routes
│   ├── services
│   ├── utils
│   ├── models
│   ├── main.py
│   └── requirements.txt
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── services
│   │   ├── assets
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

# ⚙ Backend Setup

## Clone Repository

```bash
git clone https://github.com/rohit-mathur4568/TripForge.git
```

---

## Backend

```bash
cd backend
```

Create Virtual Environment

```bash
python -m venv venv
```

Activate

### Windows

```bash
venv\Scripts\activate
```

### Linux

```bash
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Configure AWS

```bash
aws configure
```

Create `.env`

```env
JWT_SECRET=your_secret_key

JWT_ALGORITHM=HS256

JWT_EXPIRATION_HOURS=12

AWS_REGION=ap-south-1
```

Run Backend

```bash
python -m uvicorn main:app --reload
```

Backend

```
http://127.0.0.1:8000
```

Swagger

```
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

```bash
cd frontend
```

Install Packages

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

---

# 🔐 Authentication

TripForge uses **JWT Authentication**.

- User Registration
- Secure Login
- Password Hashing using bcrypt
- Protected Endpoints
- Bearer Token Authentication

---

# ☁ AWS Services Used

- AWS DynamoDB
- AWS EC2
- AWS CLI

---

# 📡 API Endpoints

## Authentication

```http
POST /auth/register
POST /auth/login
GET  /auth/me
```

## Trips

```http
POST   /trips/generate
POST   /trips/save
GET    /trips
GET    /trips/{tripId}
DELETE /trips/{tripId}
```

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing
- Email Validation
- Strong Password Validation
- Protected APIs
- Secure User Sessions

---

# 📷 Application Workflow

```text
Register

↓

Login

↓

Generate Journey

↓

AI Travel Plan

↓

Save Journey

↓

View Saved Journeys

↓

Delete Journey

↓

Logout
```

---

# 👨‍💻 Developers

TripForge Development Team

---

# 📄 License

This project is developed for educational and learning purposes.