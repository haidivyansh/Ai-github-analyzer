# AI GitHub Project Analyzer

AI GitHub Project Analyzer is a full-stack web application designed to inspect, analyze, and gain deep insights into GitHub repositories using Google Gemini AI, GitHub REST API, and modern web technologies.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Middleware**: CORS, Dotenv

### Database & Auth (Future Steps)
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT & bcrypt

### External APIs (Future Steps)
- **AI Engine**: Google Gemini API
- **Repository Integration**: GitHub REST API

---

## 📁 Folder Structure

```
Ai github project analyzer/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── healthController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── .gitkeep
│   ├── routes/
│   │   └── healthRoutes.js
│   ├── services/
│   │   └── .gitkeep
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   └── Header.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useHealth.js
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Setup and Installation Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### 1. Backend Setup

```bash
# Navigate into the backend directory
cd backend

# Install dependencies
npm install

# (Optional) Environment variables setup
# The .env file is already configured with default settings
cp .env.example .env
```

### 2. Frontend Setup

```bash
# Navigate into the frontend directory
cd frontend

# Install dependencies
npm install

# (Optional) Environment variables setup
cp .env.example .env
```

---

## 🚀 Running the Application (Recommended: 1-Command Startup)

From the project root directory, run both Backend & Frontend simultaneously with a single command:

```bash
# Run both Backend & Frontend concurrently
npm run dev

# Or on Windows, double-click or run:
.\dev.bat
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Running Separately (Alternative)

**Backend Server:**
```bash
cd backend
npm run dev
```

**Frontend Dev Server:**
```bash
cd frontend
npm run dev
```

---

## 🧪 Verification API Endpoints

### Backend Health Check
- **URL**: `http://localhost:5000/api/health`
- **Method**: `GET`
- **Expected Response**:
```json
{
  "success": true,
  "message": "Backend is running"
}
```
