# FAST TOUR - Quick Start Deployment Guide

## ✅ All Issues Fixed! Ready to Deploy

### What's Been Fixed
- ✓ Railway Docker error ("npm: not found")
- ✓ Frontend UI crashes (styled-jsx removed)
- ✓ Cleaned up backup and unused files
- ✓ Frontend builds successfully
- ✓ Added deployment instructions

---

## 🚀 Deploy Backend to Railway (10-15 min)

### Step 1: Install Railway CLI
```bash
npm i -g @railway/cli
```

### Step 2: Login
```bash
railway login
```

### Step 3: Initialize and Deploy
```bash
cd backend
railway up
```

✓ You'll get a URL like: **https://fast-tour.railway.app**

📝 **Save this URL - you need it for frontend!**

---

## 🌐 Deploy Frontend to Vercel (5-10 min)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Update Environment Variable
Edit `frontend/.env.production`:
```
VITE_API_URL=https://YOUR_RAILWAY_URL_HERE
```

### Step 3: Deploy
```bash
cd frontend
vercel --prod
```

✓ You'll get a URL like: **https://fast-tour.vercel.app**

---

## ✅ Verify Deployment

### Test Backend Health
```bash
curl https://YOUR_RAILWAY_URL/api/health
```

### Test Frontend
1. Open your Vercel URL in browser
2. Press F12 to open DevTools
3. Check Console for any errors

### Test API Connection
In browser console:
```javascript
fetch('https://YOUR_RAILWAY_URL/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

Should show: `{status: "ok", ...}`

---

## 📋 Local Development (Optional)

### Setup
```bash
# Backend
cd backend && npm install && npm start

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

Visit: http://localhost:3000

---

## 📁 Project Structure

```
FAST-TOUR/
├── backend/
│   ├── Dockerfile (NEW - For Railway)
│   ├── railway.json (NEW - Config)
│   ├── src/server.js
│   └── src/services/
├── frontend/
│   ├── .env.production (NEW - API URL)
│   ├── src/pages/PaymentPage.jsx (Simplified)
│   └── src/styles/
├── RAILWAY_DEPLOYMENT_GUIDE.md (Full guide)
└── QUICK_START.md (This file)
```

---

## 🎯 Next Steps

1. Deploy backend to Railway
2. Copy Railway URL
3. Update frontend .env.production
4. Deploy frontend to Vercel
5. Test everything
6. Go live! 🎉

---

## ⚠️ Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| "npm: not found" | Already fixed! Just push latest code |
| Frontend 404 | vercel.json already configured, no action needed |
| CORS errors | Check VITE_API_URL in .env.production |
| Build takes long | Normal for first deploy, usually 2-3 min |

---

## 📞 Full Documentation

For detailed step-by-step guide:
→ See **RAILWAY_DEPLOYMENT_GUIDE.md**

---

**Status**: ✅ Production Ready

All code is committed and ready to deploy!


---

## 🎯 First Time Setup Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Install dependencies (npm install)
- [ ] Update admin phone numbers in `.env`
- [ ] Start backend server
- [ ] Start frontend dev server
- [ ] Test homepage loads
- [ ] Access admin panel with PIN: FT001
- [ ] Update admin info in Settings tab
- [ ] Test registration flow
- [ ] Test payment page

---

## 🔑 Default Admin PIN

```
FT001
```

Access at: `/admin`

---

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `.env` | Configuration (create from .env.example) |
| `backend/src/server.js` | Backend API server |
| `frontend/src/App.jsx` | Main frontend app |
| `frontend/src/context/AppContext.jsx` | Global state |
| `README.md` | Full documentation |

---

## ❓ Quick FAQ

**Q: How to change admin PIN?**
A: Update `REACT_APP_ADMIN_PIN` in `.env` (both frontend and backend)

**Q: Where to add Telegram bot token?**
A: Add `TELEGRAM_BOT_TOKEN` to `.env`

**Q: How to update bank account?**
A: Admin Panel → Settings → Update info

**Q: How to test payments?**
A: Use registration page → select payment → click confirm

**Q: Where are registrations stored?**
A: LocalStorage (frontend) and in-memory (backend)

---

## 🚀 Next Steps

1. Customize admin information
2. Add Telegram bot integration
3. Test WhatsApp auto-messaging
4. Set up QRIS image
5. Configure tournament rules
6. Test complete registration flow

Happy tournament managing! 🎮
