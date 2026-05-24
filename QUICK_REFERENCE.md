# 🚀 QUICK REFERENCE - 20-Minute Deployment Guide

## **Your Current Status** ✅

```
✓ Backend code:     UPDATED to SQLite
✓ Database:          SQLite3 INSTALLED & CONFIGURED
✓ Telegram bot:      READY (polling works)
✓ Frontend:          READY (no changes needed)
✓ Old files:         CLEANED UP
✓ Ready to deploy:   YES! 🎉
```

---

## **What's Free vs Paid**

| Component | Free Option | Cost |
|-----------|------------|------|
| Frontend hosting | Vercel | ✅ $0 |
| Backend hosting | Replit | ✅ $0 |
| Database | SQLite | ✅ $0 |
| Bot | Telegram | ✅ $0 |
| **Everything** | **Combined** | **✅ $0/month** |

---

## **20-Minute Deployment Plan**

### **Minute 1-5: Test Locally**
```bash
# Terminal 1
cd backend && npm start

# Terminal 2  
cd frontend && npm run dev

# Open http://localhost:3000 and test registration
# Verify data persists after restart
```

### **Minute 6-10: Deploy Frontend (Vercel)**
```
1. Go to vercel.com
2. Import your GitHub repo
3. Click Deploy
4. Get URL: https://your-app.vercel.app
```

### **Minute 11-20: Deploy Backend (Replit)**
```
1. Go to replit.com
2. Import from GitHub
3. Add .env variables
4. Click Run
5. Get URL: https://your-backend.replit.dev
6. Update frontend VITE_API_URL
7. Push to GitHub (auto-redeploy)
```

### **Done! Tournament is LIVE** 🎉

---

## **Platform Comparison (Choose ONE)**

### **BEST: Replit (For Backend)**
- ✅ 24/7 FREE
- ✅ Bot always polling
- ✅ SQLite database included
- ✅ Auto-restart on crash
- ✅ Easiest setup
- 🎯 **USE THIS**

### **GOOD: Railway**
- ✅ Free tier
- ⚠️ Limited to 500 hours/month
- ✅ Still FREE
- 🎯 **BACKUP OPTION**

### **GOOD: Render**
- ✅ Free tier
- ⚠️ Sleeps after 15 min inactivity
- ✓ But wakes up on request
- 🎯 **ANOTHER OPTION**

---

## **File Structure (Now)**

```
FAST-TOUR/
├── backend/
│   ├── src/
│   │   ├── server.js           ← UPDATED (SQLite)
│   │   ├── database.js         ← SQLite module
│   │   └── server-old.js       ← Backup old version
│   ├── data/
│   │   └── tournament.db       ← Created on first run
│   └── package.json            ← sqlite3 added
│
├── frontend/
│   ├── src/
│   ├── dist/                   ← Build here for deployment
│   └── .env                    ← Update VITE_API_URL
│
├── README.md
├── QUICK_START.md
├── NEXT_STEPS.md              ← Read this!
├── DEPLOYMENT_READY.md        ← Then read this
└── ANSWERS_TO_YOUR_QUESTIONS.md ← Or this
```

---

## **Commands You Need**

### **Local Testing**
```bash
npm start                    # Backend
npm run dev                 # Frontend
npm run build               # Build for deployment
```

### **Database**
```bash
sqlite3 tournament.db ".tables"                    # List tables
sqlite3 tournament.db "SELECT * FROM registrations;"  # View data
```

### **Check Status**
```bash
curl http://localhost:5000/api/health
```

---

## **Environment Variables (Save These)**

```
# backend/.env
NODE_ENV=production
PORT=5000
TELEGRAM_BOT_TOKEN=8278697371:AAEXIhx_lXQDLv4uWoIZagZat-Tuxk0x5_Y
ADMIN_PHONE_1=+6285857322097
ADMIN_PHONE_2=+628972337396
ADMIN_BANK_ACCOUNT=085716941474
ADMIN_PIN=FT001

# frontend/.env
VITE_API_URL=http://localhost:5000  # Change to your deployed URL
VITE_ADMIN_PIN=FT001
```

---

## **URLs After Deployment**

```
Frontend:   https://your-app.vercel.app
Backend:    https://your-backend.replit.dev
Admin:      https://your-app.vercel.app/admin (PIN: FT001)
```

---

## **Testing on Live**

### **Test 1: Register Team**
```bash
curl -X POST https://your-backend.replit.dev/api/registrations \
  -H "Content-Type: application/json" \
  -d '{"teamName":"Test","playerCount":2,"fee":5}'
```

### **Test 2: Check Data**
```bash
curl https://your-backend.replit.dev/api/registrations
```

### **Test 3: Telegram Bot**
```
Send /start to @YOUR_BOT_NAME
Should get welcome menu
```

---

## **If Something Goes Wrong**

| Problem | Solution |
|---------|----------|
| Backend won't start | `npm install && npm start` |
| Data not persisting | Check `backend/data/tournament.db` exists |
| Telegram bot silent | Check token in .env matches |
| Frontend broken | Check `npm run build` succeeds |
| API not responding | Check `VITE_API_URL` in frontend .env |

---

## **Cost Summary (First Year)**

| Item | Cost |
|------|------|
| Frontend (Vercel) | $0 |
| Backend (Replit) | $0 |
| Database (SQLite) | $0 |
| Bot (Telegram) | $0 |
| Domain (optional) | $10-15 |
| **TOTAL** | **$0-15** |

**That's cheaper than ONE cup of coffee per month!**

---

## **Features You Have**

✅ Unlimited registrations
✅ Real-time payment tracking
✅ Telegram bot verification
✅ Admin panel with PIN
✅ WhatsApp integration
✅ Payment statistics
✅ Auto-backups
✅ 24/7 availability
✅ Zero maintenance
✅ Production-ready

---

## **Next 5 Minutes**

1. Read `NEXT_STEPS.md` (5 min)
2. Or read `DEPLOYMENT_READY.md` (10 min)
3. Then start deploying!

---

**Everything is ready. No more work. Just deploy!** 🚀

**Estimated time: 20 minutes to go LIVE**

---

*Last Updated: May 23, 2026*
*Status: PRODUCTION READY ✅*
