# 🚀 AlphaSharp - Financial Intelligence Platform

> **Institutional-grade financial intelligence powered by AI, machine learning, and advanced market regime detection**

AlphaSharp is a full-stack MERN application that provides real-time stock analysis, market regime detection using Hidden Semi-Markov Models (HSMM), Monte Carlo price forecasting, and an AI-powered financial assistant. Built for traders, investors, and financial analysts who need actionable insights backed by data science.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248.svg)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo & Screenshots](#-demo--screenshots)
- [Tech Stack](#️-tech-stack)
- [System Architecture](#-system-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Market Regime Detection](#-market-regime-detection)
- [Caching Strategy](#-caching-strategy)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 📊 **Stock Analysis & Intelligence**
- **Real-time Stock Data**: Live quotes, fundamentals, and technical indicators
- **Company Profiles**: Detailed company information, financials, and key metrics
- **Peer Comparison**: Compare stocks against industry peers
- **AI-Powered Insights**: GPT-generated analysis and investment recommendations
- **News & Sentiment**: Real-time news aggregation with sentiment analysis
- **Price History**: Historical price charts and performance metrics

### 🎯 **Market Regime Detection**
- **9 Market Regimes**: Bull (Quiet, Normal, Volatile), Bear (Quiet, Normal, Volatile), Neutral states
- **Hidden Semi-Markov Models**: Advanced statistical modeling for regime identification
- **Regime History**: Historical regime transitions with visual timeline
- **Risk Assessment**: Real-time risk levels based on current market conditions
- **Regime Characteristics**: Average returns, volatility, and duration for each regime

### 📈 **Price Forecasting**
- **Monte Carlo Simulations**: Probabilistic price predictions using 2,000+ simulations
- **Regime-Aware Dynamics**: Forecasts adapt to current market regime
- **Confidence Intervals**: 95% and 5% percentile projections
- **Short-term Predictions**: 5-day tactical forecasts
- **Long-term Outlook**: 60-day strategic projections

### 🤖 **AI Financial Assistant**
- **Natural Language Queries**: Ask questions in plain English
- **Web Search Integration**: Real-time information retrieval
- **Context-Aware Responses**: Understands financial terminology
- **Multi-turn Conversations**: Maintains context across queries
- **Source Citations**: Links to relevant articles and data

### 📱 **User Features**
- **Personal Dashboard**: Customized view of market conditions and watchlist
- **Watchlists**: Track unlimited stocks with real-time data
- **Portfolio Tracker**: Monitor investments and P&L (coming soon)
- **Search History**: Quick access to previously analyzed stocks
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: Easy on the eyes for extended trading sessions

### 🔐 **Authentication & Security**
- **Email/Password Authentication**: Secure manual registration and login
- **JWT Tokens**: Stateless authentication with refresh tokens
- **Protected Routes**: Role-based access control
- **Rate Limiting**: API protection against abuse
- **CORS Protection**: Secure cross-origin requests
- **Helmet.js**: Security headers and XSS protection

---

## 🎬 Demo & Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x450?text=Dashboard+Screenshot)
*Real-time market regime detection and watchlist overview*

### Stock Analysis
![Stock Analysis](https://via.placeholder.com/800x450?text=Stock+Analysis+Screenshot)
*Comprehensive stock analysis with AI insights*

### Market Overview
![Market Overview](https://via.placeholder.com/800x450?text=Market+Overview+Screenshot)
*Historical regime transitions and Monte Carlo forecasts*

### AI Agent
![AI Agent](https://via.placeholder.com/800x450?text=AI+Agent+Screenshot)
*Interactive financial assistant with web search*

---

## 🏗️ Tech Stack

### **Backend** (Node.js/Express)
| Technology | Purpose |
|-----------|---------|
| **Express.js** | REST API server framework |
| **MongoDB** | NoSQL database for users, watchlists, cache |
| **Mongoose** | ODM for MongoDB with schema validation |
| **JWT** | Stateless authentication with access/refresh tokens |
| **Bcrypt** | Password hashing and security |
| **Axios** | HTTP client for Python API integration |
| **Node-Cron** | Scheduled tasks for API keep-alive |
| **Winston** | Structured logging with file rotation |
| **Helmet** | Security headers and protection |
| **Express Rate Limit** | API request throttling |
| **Cookie Parser** | HTTP cookie parsing |

### **Frontend** (React/Vite)
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library with hooks and context |
| **Vite** | Fast build tool and dev server |
| **React Router v6** | Client-side routing and navigation |
| **TanStack Query** | Server state management and caching |
| **Zustand** | Lightweight global state management |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | Accessible, customizable components |
| **Recharts** | Data visualization and charting |
| **Framer Motion** | Smooth animations and transitions |
| **React Hot Toast** | Beautiful toast notifications |
| **Lucide React** | Modern icon library |

### **External Services**
| Service | Purpose |
|---------|---------|
| **Python Finance API** | Stock data, market regimes, ML forecasting |
| **Yahoo Finance** | Real-time stock quotes and data |
| **MongoDB Atlas** | Cloud database (production) |

### **DevOps & Tools**
- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-reload during development
- **Postman** - API testing

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   React    │  │  TanStack  │  │  Zustand   │            │
│  │  Router    │  │   Query    │  │   Store    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │               │                │                   │
│         └───────────────┴────────────────┘                   │
│                         │                                    │
│                    Axios Client                              │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          │ HTTP/REST
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                         ▼                                    │
│                  Express Server                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes → Controllers → Services → Models            │   │
│  └──────────────────────────────────────────────────────┘   │
│         │               │                │                   │
│         ▼               ▼                ▼                   │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐             │
│  │   Auth   │  │  Python API  │  │ MongoDB  │             │
│  │Middleware│  │   Service    │  │  Cache   │             │
│  └──────────┘  └──────────────┘  └──────────┘             │
│                       │                                      │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        │ HTTP/REST
                        │
┌───────────────────────▼──────────────────────────────────────┐
│              Python Finance API (Render)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   FastAPI    │  │  scikit-hmmlearn │  NumPy/Pandas│      │
│  │   Endpoints  │  │     HSMM Model   │  Monte Carlo │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

### Request Flow Example (Stock Analysis)

1. **User** enters ticker "AAPL" in search
2. **Frontend** sends `GET /api/stocks/AAPL/analysis`
3. **Backend** checks MongoDB cache (5-minute TTL)
4. If cache miss, **Backend** calls `Python API /api/stock/AAPL/analysis`
5. **Python API** processes request:
   - Fetches data from Yahoo Finance
   - Runs fundamental analysis
   - Generates AI insights
   - Returns JSON response
6. **Backend** caches response in MongoDB
7. **Backend** returns data to frontend
8. **Frontend** displays analysis with charts

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 6.0+ ([Download](https://www.mongodb.com/try/download/community))
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd StockMarket
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

3. **Setup Frontend** (new terminal)
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

4. **Access the application**
- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:5000**
- API Docs: **http://localhost:5000/api**

📝 **For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

---

## 📂 Project Structure

See the [detailed structure](#) above for the complete directory layout.

**Key Directories:**
- `backend/src/controllers/` - API request handlers
- `backend/src/services/` - Business logic and external API integration
- `backend/src/models/` - MongoDB schemas
- `frontend/src/pages/` - Page components
- `frontend/src/components/` - Reusable UI components
- `frontend/src/services/` - API client services

---

## 📡 API Documentation

### **Authentication Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new account | ❌ |
| POST | `/api/auth/login` | Login with email/password | ❌ |
| GET | `/api/auth/me` | Get current user profile | ✅ |
| POST | `/api/auth/logout` | Logout and clear tokens | ✅ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ |

### **Stock Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/stocks/search?q={query}` | Search for tickers | ❌ |
| GET | `/api/stocks/:ticker/analysis` | Get comprehensive stock analysis | ❌ |
| GET | `/api/stocks/:ticker/news` | Get latest news for stock | ❌ |
| GET | `/api/stocks/history` | Get user's search history | ✅ |

### **Market Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/market/condition` | Get current market regime | ❌ |
| GET | `/api/market/forecast` | Get Monte Carlo price forecast | ❌ |
| GET | `/api/market/forecast/short-term` | Get 5-day prediction | ❌ |
| GET | `/api/market/regimes` | Get all 9 regime descriptions | ❌ |
| GET | `/api/market/history?days=90` | Get regime transition history | ❌ |
| GET | `/api/market/status` | Check Python API status | ❌ |
| DELETE | `/api/market/cache/clear` | Clear market data cache | ✅ (Admin) |

### **Watchlist Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/watchlists` | Get all user watchlists | ✅ |
| POST | `/api/watchlists` | Create new watchlist | ✅ |
| GET | `/api/watchlists/:id` | Get watchlist by ID | ✅ |
| PUT | `/api/watchlists/:id` | Update watchlist | ✅ |
| DELETE | `/api/watchlists/:id` | Delete watchlist | ✅ |
| POST | `/api/watchlists/:id/stocks` | Add stock to watchlist | ✅ |
| DELETE | `/api/watchlists/:id/stocks/:ticker` | Remove stock | ✅ |
| GET | `/api/watchlists/:id/data` | Get watchlist with live data | ✅ |

### **AI Agent Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/agent/query` | Query AI assistant | ❌ |

### **Yahoo Finance Endpoints** (Fallback)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/yahoo/quote/:ticker` | Get real-time quote | ❌ |
| GET | `/api/yahoo/chart/:ticker` | Get historical price data | ❌ |

📘 **For detailed API documentation with examples, see [API_MAPPING.md](./API_MAPPING.md)**

---

## 🎯 Market Regime Detection

AlphaSharp uses **Hidden Semi-Markov Models (HSMM)** to identify 9 distinct market regimes based on S&P 500 and VIX data from 1990-2022.

### The 9 Market Regimes

| ID | Regime | Characteristics | Avg Return | Volatility | Duration |
|----|--------|-----------------|------------|------------|----------|
| 0 | **Bull - Quiet** | Strong uptrend, low volatility | +15% | 10% | 180 days |
| 1 | **Bull - Normal** | Steady growth, moderate volatility | +12% | 12% | 150 days |
| 2 | **Bull - Volatile** | Gains with high uncertainty | +10% | 18% | 90 days |
| 3 | **Neutral - Quiet** | Sideways, low volatility | 0% | 8% | 120 days |
| 4 | **Neutral - Normal** | Range-bound, moderate volatility | 0% | 12% | 90 days |
| 5 | **Neutral - Volatile** | Choppy, high volatility | 0% | 20% | 60 days |
| 6 | **Bear - Quiet** | Decline, low volatility | -8% | 12% | 90 days |
| 7 | **Bear - Normal** | Steady decline, moderate volatility | -12% | 18% | 120 days |
| 8 | **Bear - Volatile** | Sharp losses, panic | -25% | 35% | 45 days |

### How It Works

1. **Data Collection**: Historical S&P 500 prices and VIX levels
2. **Feature Engineering**: Returns, volatility, trend indicators
3. **Model Training**: HSMM learns patterns and transitions
4. **Real-time Detection**: Current data classified into one of 9 regimes
5. **Forecasting**: Monte Carlo simulations use regime dynamics

### Applications

- **Risk Management**: Adjust portfolio based on current regime
- **Entry/Exit Timing**: Identify favorable conditions
- **Volatility Expectations**: Set appropriate stop-losses
- **Strategic Planning**: Long-term allocation decisions

---

## 💾 Caching Strategy

AlphaSharp implements a multi-layer caching system to optimize performance and reduce API calls.

### Cache Layers

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: React Query (Frontend)                    │
│  └─ 5 minute client-side cache                      │
│     └─ Stale-while-revalidate strategy              │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  Layer 2: MongoDB (Backend)                         │
│  └─ TTL-based document expiration                   │
│     └─ Serves as shared cache for all users         │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  Layer 3: Python API                                │
│  └─ Fresh data from Yahoo Finance                   │
└─────────────────────────────────────────────────────┘
```

### Cache TTL Configuration

| Data Type | Frontend (React Query) | Backend (MongoDB) |
|-----------|----------------------|-------------------|
| Stock Analysis | 5 minutes | 5 minutes |
| Stock News | 10 minutes | 10 minutes |
| Market Regime | 1 hour | 1 hour |
| Forecasts | 1 hour | 1 hour |
| Regime History | 30 minutes | 30 minutes |
| User Watchlist | 5 minutes | N/A (real-time) |

### Cold Start Handling

The Python API on Render's free tier spins down after 15 minutes of inactivity, causing 50-second cold starts.

**Solutions Implemented:**

1. **Keep-Alive Service**: Pings Python API every 13 minutes during market hours (9:00 AM - 4:30 PM ET)
2. **Graceful UX**: Lottie animation during wake-up with progress indicator
3. **Stale Data Display**: Shows cached data immediately while fetching fresh data
4. **Proactive Wake-up**: Homepage pings API on mount to warm it up
5. **Status Monitoring**: Real-time API status indicator in UI

---

## 🔐 Environment Variables

### Backend `.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/alphasharp
# For production (MongoDB Atlas):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alphasharp

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters
JWT_REFRESH_EXPIRE=30d

# Session Secret (CHANGE IN PRODUCTION!)
SESSION_SECRET=your-super-secret-session-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Python API
PYTHON_API_URL=https://finance-v1-kyu7.onrender.com
PYTHON_API_TIMEOUT=60000

# Optional Features
ENABLE_KEEP_ALIVE=true
KEEP_ALIVE_INTERVAL=13
```

### Frontend `.env`

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=AlphaSharp
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANIMATIONS=true
VITE_ENABLE_KEEP_ALIVE_PING=true
```

---

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. **Create New Service**
2. **Connect GitHub Repository**
3. **Set Root Directory**: `backend`
4. **Set Build Command**: `npm install`
5. **Set Start Command**: `npm start`
6. **Add Environment Variables**: Copy from `.env` file
7. **Deploy**

### Frontend Deployment (Vercel/Netlify)

1. **Create New Project**
2. **Connect GitHub Repository**
3. **Set Root Directory**: `frontend`
4. **Set Build Command**: `npm run build`
5. **Set Output Directory**: `dist`
6. **Add Environment Variables**: Copy from `.env` file
7. **Deploy**

### Database Deployment (MongoDB Atlas)

1. **Create Free Cluster** at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Whitelist IP Addresses** (0.0.0.0/0 for all or specific IPs)
3. **Create Database User**
4. **Get Connection String**
5. **Update `MONGODB_URI` in backend environment variables**

📘 **For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                   # Run all tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:coverage      # Coverage report
```

### Frontend Tests

```bash
cd frontend
npm test                   # Run tests
npm run test:ui            # Interactive UI
npm run test:coverage      # Coverage report
```

### Manual Testing

Use the provided Postman collection for API testing:
1. Import `postman_collection.json`
2. Set environment variables
3. Run test scenarios

---

## 🤝 Contributing

This is a university/personal project. Contributions are welcome!

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style

- **Backend**: ES6+ with ESLint
- **Frontend**: React with ESLint + Prettier
- **Commits**: Conventional Commits format

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links & Resources

- **Live Demo**: [Coming Soon]
- **Python API Documentation**: https://finance-v1-kyu7.onrender.com/docs
- **Backend API**: http://localhost:5000 (development)
- **Frontend App**: http://localhost:5173 (development)

---

## 👥 Team

**AlphaSharp Development Team**

- **Full-Stack Developer**: Web application development
- **Data Science Team**: Python API & ML models
- **UI/UX Designer**: Interface design

---

## 🙏 Acknowledgments

- **Yahoo Finance** for market data
- **shadcn/ui** for beautiful components
- **scikit-hmmlearn** for HSMM implementation
- **OpenAI** for AI insights generation
- **Render** for hosting the Python API

---

## 📧 Contact & Support

For questions, issues, or suggestions:
- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)
- **Email**: support@alphasharp.com
- **Documentation**: Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) and [API_MAPPING.md](./API_MAPPING.md)

---

<div align="center">

**Built with ❤️ using MERN Stack**

⭐ Star this repo if you found it helpful!

</div>
   - Generates AI insights
   - Returns JSON response
6. **Backend** caches response in MongoDB
7. **Backend** returns data to frontend
8. **Frontend** displays analysis with charts

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 6.0+ ([Download](https://www.mongodb.com/try/download/community))
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd StockMarket
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

3. **Setup Frontend** (new terminal)
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

4. **Access the application**
- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:5000**
- API Docs: **http://localhost:5000/api**

📝 **For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

---

```
StockMarket/
├── backend/                 # Node.js Express server
│   ├── src/
│   │   ├── config/         # Database, passport, environment
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Auth, error handling, rate limiting
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Helpers and utilities
│   │   └── app.js          # Express app setup
│   ├── server.js           # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/               # React Vite application
│   ├── src/
│   │   ├── components/     # React components (UI, layout, features)
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Helper functions
│   │   ├── styles/         # CSS files
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Python API URL (default: https://finance-v1-kyu7.onrender.com)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and set:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Random secret key for JWT
- `FRONTEND_URL` - http://localhost:5173 (dev) or your production URL
- `PYTHON_API_URL` - https://finance-v1-kyu7.onrender.com

4. **Start development server:**
```bash
npm run dev
```

Backend will run on **http://localhost:5000**

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install shadcn/ui components:**
```bash
npx shadcn-ui@latest add button card badge skeleton dialog dropdown-menu input table tabs toast
```

4. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and set:
- `VITE_API_URL` - http://localhost:5000/api (or your backend URL)
- `VITE_GOOGLE_CLIENT_ID` - Same as backend Google Client ID

5. **Start development server:**
```bash
npm run dev
```

Frontend will run on **http://localhost:5173**

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - http://localhost:5000/api/auth/google/callback (development)
   - https://your-backend-domain.com/api/auth/google/callback (production)
6. Add authorized JavaScript origins:
   - http://localhost:5173 (development)
   - https://your-frontend-domain.com (production)

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/alphasharp
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your-session-secret
FRONTEND_URL=http://localhost:5173
PYTHON_API_URL=https://finance-v1-kyu7.onrender.com
PYTHON_API_TIMEOUT=60000
ENABLE_KEEP_ALIVE=true
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_APP_NAME=AlphaSharp
VITE_ENABLE_ANIMATIONS=true
```

## 📡 API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)
- `POST /api/auth/refresh` - Refresh JWT token

### Stocks
- `GET /api/stocks/search?q={query}` - Search tickers
- `GET /api/stocks/:ticker/analysis` - Stock analysis
- `GET /api/stocks/:ticker/news` - Stock news
- `GET /api/stocks/history` - Search history (protected)

### Market Regimes
- `GET /api/market/condition` - Current market regime
- `GET /api/market/forecast` - Monte Carlo forecast
- `GET /api/market/forecast/short-term` - Short-term prediction
- `GET /api/market/regimes` - All regimes info
- `GET /api/market/history` - Regime history
- `GET /api/market/status` - Python API status

### Watchlists (Protected)
- `GET /api/watchlists` - Get all watchlists
- `POST /api/watchlists` - Create watchlist
- `GET /api/watchlists/:id` - Get watchlist
- `PUT /api/watchlists/:id` - Update watchlist
- `DELETE /api/watchlists/:id` - Delete watchlist
- `POST /api/watchlists/:id/stocks` - Add stock
- `DELETE /api/watchlists/:id/stocks/:ticker` - Remove stock
- `GET /api/watchlists/:id/data` - Get with stock data

### AI Agent
- `POST /api/agent/query` - Query AI assistant

## 🚨 Cold Start Handling

The Python API on Render free tier spins down after inactivity. Our solution:

1. **Keep-Alive Service**: Backend pings Python API every 13 minutes during market hours
2. **Multi-Layer Caching**: MongoDB caches API responses with TTL
3. **Graceful UX**: Lottie animation during 50s cold start
4. **Stale-While-Revalidate**: Shows cached data while fetching fresh data
5. **Proactive Wake-up**: Frontend pings API on landing page

## 📊 Caching Strategy

| Endpoint | TTL | Cache Location |
|----------|-----|----------------|
| Stock Analysis | 5 min | MongoDB |
| Market News | 10 min | MongoDB |
| Market Regime | 1 hour | MongoDB |
| Forecasts | 1 hour | MongoDB |
| Client Data | 5 min | React Query |

## 🎨 Design System

- **Colors**: Clean, no gradients
- **Primary**: Blue (#2563eb)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)
- **Typography**: System UI / Inter
- **Animations**: Subtle, 200-300ms transitions
- **Components**: shadcn/ui with Tailwind CSS

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend (Railway/Render/Heroku)
1. Create new app
2. Connect GitHub repository
3. Set environment variables
4. Deploy `backend` directory
5. Configure custom domain (optional)

### Frontend (Vercel/Netlify)
1. Create new project
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Set environment variables
6. Deploy `frontend` directory

## 📝 Development Workflow

1. **Phase 1**: Backend API & Database ✅
2. **Phase 2**: Frontend Architecture ✅
3. **Phase 3**: Core Components (In Progress)
4. **Phase 4**: Advanced Features
5. **Phase 5**: Testing & Optimization
6. **Phase 6**: Deployment

## 🤝 Contributing

This is a group project. Team members:
- Web Developer: Frontend & Backend development
- Data Science Team: Python API maintenance

## 📄 License

MIT License

## 🔗 Links

- Python API Docs: https://finance-v1-kyu7.onrender.com/docs
- Backend API: http://localhost:5000
- Frontend App: http://localhost:5173

---

**Built with ❤️ by the AlphaSharp Team**
