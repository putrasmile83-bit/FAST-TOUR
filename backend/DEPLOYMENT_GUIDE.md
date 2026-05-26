# 🚀 FAST TOUR BACKEND - RENDER/RAILWAY MIGRATION GUIDE

## 📋 BACKEND PURPOSE & ARCHITECTURE

### What This Backend Does
The FAST TOUR backend is a **tournament payment verification system** that:
- Manages team registrations
- Handles payment processing (QRIS & DANA transfers)
- Provides real-time payment status tracking  
- Integrates Telegram bot for admin notifications
- Verifies payment proofs and updates tournament slots

### Architecture Overview
```
Express.js REST API
    ├── /api/registrations       → Team registration
    ├── /api/payments            → Payment processing
    ├── /api/verify              → Admin verification
    └── /api/health              → Health check
         │
         ▼
    SQLite Database
         │
         ▼
    Telegram Bot (Admin notifications)
```

---

## ⚠️ REPLIT → RENDER/RAILWAY MIGRATION

### Why We're Moving

**Replit Issues:**
- ❌ Unreliable for production
- ❌ Slow performance
- ❌ Limited database storage
- ❌ Free tier restrictions
- ❌ Poor scaling

**Render/Railway Benefits:**
- ✅ Production-grade infrastructure
- ✅ PostgreSQL support (better than SQLite)
- ✅ Reliable 99.9% uptime
- ✅ Auto-scaling
- ✅ Easy deployment from GitHub
- ✅ Better for payment systems

### Which Platform?

| Requirement | Render | Railway |
|------------|--------|---------|
| **Ease of Deployment** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **PostgreSQL** | ✅ Free | ✅ Included |
| **Pricing** | $7/month | $5/month |
| **Best For** | Beginners | Developers |

**Recommendation:** Use **Railway** (faster setup, cheaper)

---

## 📂 NEW BACKEND STRUCTURE

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          ← Database connection
│   │   └── environment.js       ← Environment variables
│   │
│   ├── models/
│   │   ├── Registration.js      ← Registration data
│   │   ├── Payment.js           ← Payment data
│   │   └── User.js              ← User data
│   │
│   ├── routes/
│   │   ├── registrations.js     ← Registration endpoints
│   │   ├── payments.js          ← Payment endpoints
│   │   ├── admin.js             ← Admin endpoints
│   │   └── health.js            ← Health check
│   │
│   ├── services/
│   │   ├── paymentService.js    ← Payment logic
│   │   ├── telegramService.js   ← Bot integration
│   │   └── verificationService.js ← Verification logic
│   │
│   ├── middleware/
│   │   ├── auth.js              ← Authentication
│   │   └── errorHandler.js      ← Error handling
│   │
│   └── server.js                ← Main entry point
│
├── migrations/                   ← Database migrations
├── .env.example                  ← Example environment
├── package.json
└── README.md                     ← This file
```

---

## 🔄 DEPLOYMENT STEPS

### Step 1: Choose Platform

**Option A: Railway (Recommended)**
```
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Choose "Deploy from GitHub repo"
5. Select putrasmile83-bit/FAST-TOUR
6. Railway auto-detects Node.js
7. Add environment variables (see below)
8. Deploy!
```

**Option B: Render**
```
1. Go to https://render.com
2. Sign up with GitHub
3. Create new "Web Service"
4. Connect FAST-TOUR repo
5. Set build command: npm install
6. Set start command: npm start
7. Add environment variables
8. Deploy!
```

### Step 2: Environment Variables

Both platforms: Add these variables in dashboard

| Variable | Example | Purpose |
|----------|---------|---------|
| `NODE_ENV` | `production` | Environment |
| `PORT` | `5000` | Server port |
| `TELEGRAM_BOT_TOKEN` | `8278...` | Bot authentication |
| `ADMIN_PIN` | `FT001` | Admin login |
| `DATABASE_URL` | `postgresql://...` | Database (if using PostgreSQL) |

### Step 3: Get Backend URL

**Railway:** `https://fast-tour-production.up.railway.app`  
**Render:** `https://fast-tour.onrender.com`

### Step 4: Update Frontend

In Vercel settings, set environment variable:
```
VITE_API_URL = https://your-backend-url
```

Then redeploy frontend.

---

## 🗄️ DATABASE UPGRADE

### Current (SQLite)
- ✅ Works for small projects
- ❌ Not ideal for production
- ❌ No concurrent access
- ❌ Limited scaling

### New (PostgreSQL)
- ✅ Production-grade
- ✅ Concurrent access
- ✅ Better security
- ✅ Automatic backups

### Migration
1. Railway/Render includes PostgreSQL
2. Update connection string in `.env`
3. Run migrations automatically
4. Old SQLite data can be exported if needed

---

## 🛡️ SECURITY BEST PRACTICES

### Environment Variables
```
❌ WRONG: Hardcode credentials
✅ RIGHT: Use .env file (NEVER commit)
```

### API Authentication
```javascript
❌ WRONG: No authentication check
✅ RIGHT: Verify admin PIN for admin routes
```

### Data Validation
```javascript
❌ WRONG: Accept any upload
✅ RIGHT: Validate payment proof image
```

### CORS Configuration
```javascript
❌ WRONG: Allow all origins
✅ RIGHT: Whitelist only Vercel domain
```

---

## 📊 MONITORING & DEBUGGING

### Health Check Endpoint
```bash
curl https://your-backend/api/health
# Returns: {"status":"ok","message":"..."}
```

### View Logs

**Railway:**
```
Dashboard → Project → View logs
```

**Render:**
```
Dashboard → Service → Logs
```

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| 503 Error | App crashed | Check logs |
| 404 on API | Wrong URL | Verify VITE_API_URL |
| Telegram not responding | Bot token wrong | Check .env |
| Database error | Connection failed | Check DATABASE_URL |

---

## 🔐 PRODUCTION CHECKLIST

- [ ] Environment variables set on deployment platform
- [ ] CORS configured for Vercel domain only
- [ ] Database backups configured
- [ ] Error logging implemented
- [ ] Health check working
- [ ] API documentation complete
- [ ] Rate limiting implemented (optional)
- [ ] HTTPS enforced (platforms do this automatically)

---

## 📞 SUPPORT & RESOURCES

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Express.js Guide](https://expressjs.com)
- [PostgreSQL Basics](https://www.postgresql.org/docs)

---

**Backend is now production-ready for Render/Railway!** 🚀
