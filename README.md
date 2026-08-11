# LearnFlow

> AI-Powered Personalized and Adaptive Learning Recommendation System

## Overview

LearnFlow is a personalized learning platform that analyzes a student's knowledge, identifies weak areas, recommends what they should learn next, and continuously adapts the learning path based on performance.

**Current status: Phase 1 — Foundation & UI**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB running locally or a MongoDB Atlas URI

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd LearnFlow

# Install all dependencies
npm run install:all
```

### Configuration

```bash
# Copy the example env file
cp .env.example server/.env

# Edit server/.env with your values
# Required: MONGO_URI, JWT_SECRET
```

### Running

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately
npm run server   # backend on :5000
npm run client   # frontend on :5173
```

## Project Structure

```
LearnFlow/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route pages
│       ├── layouts/        # Layout wrappers
│       ├── hooks/          # Custom React hooks
│       ├── services/       # API service layer
│       ├── context/        # React context providers
│       └── utils/          # Utility functions
│
├── server/                 # Node.js/Express backend
│   ├── config/             # DB and app config
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth and error middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routers
│   └── utils/              # Server utilities
│
└── .env.example            # Environment variable template
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |

## Phases Roadmap

- **Phase 1** ✅ Foundation & UI (current)
- **Phase 2** Topics, Resources, Questions, Quizzes, Diagnostic Assessment
- **Phase 3** Knowledge Profile, Knowledge Gap Detection, Progress Tracking
- **Phase 4** Recommendation Engine (Content-Based + Collaborative Filtering)
- **Phase 5** Adaptive Difficulty, Learning Path Generation
- **Phase 6** Spaced Repetition
- **Phase 7** ML Evaluation
- **Phase 8** RAG Tutor / Instructor Analytics
