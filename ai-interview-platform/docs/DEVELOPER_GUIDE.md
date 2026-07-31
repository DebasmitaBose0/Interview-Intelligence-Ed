# Developer Onboarding & Architecture Guide

## Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- MongoDB (Local or Atlas URI)

## Installation & Setup

1. **Clone Repository & Install Dependencies**
```bash
git clone https://github.com/Babin123456/Interview-Intelligence-.git
cd Interview-Intelligence-/ai-interview-platform
npm install
cd client && npm install
```

2. **Environment Setup**
Copy `.env.example` to `.env` in `ai-interview-platform/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interview_intelligence
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
```

3. **Running the Application**
- Backend server: `npm run dev:server`
- Frontend client: `npm run dev:client` (in `client/` folder)

4. **Executing Test Suite**
```bash
npm test
```
