# 🚀 Quick Setup Guide

Get AlphaSharp running in 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB installed ([Download](https://www.mongodb.com/try/download/community))

## Setup Steps

### 1. Clone & Navigate
```bash
git clone <your-repo-url>
cd StockMarket
```

### 2. Start MongoDB
```bash
cd backend
mongod --dbpath=data
```
Leave this terminal running.

### 3. Setup & Start Backend
Open a new terminal:
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alphasharp
JWT_SECRET=change-this-secret-key
JWT_REFRESH_SECRET=change-this-refresh-secret
FRONTEND_URL=http://localhost:5173
PYTHON_API_URL=https://finance-v1-kyu7.onrender.com
```

Start backend:
```bash
npm start
```

### 4. Setup & Start Frontend
Open a new terminal:
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

### 5. Open App
Navigate to: **http://localhost:5173**

---
