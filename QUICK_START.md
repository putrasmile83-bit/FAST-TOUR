# FAST TOUR - Installation & Quick Start Guide

## ⚡ Quick Start (5 minutes)

### 1️⃣ Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 2️⃣ Configure Environment

Copy environment template:
```bash
cp .env.example .env
```

Update `.env` file with:
- Admin contact numbers
- Telegram bot token (optional)
- Bank account details

### 3️⃣ Run the Application

**Terminal 1 - Backend (http://localhost:5000):**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend (http://localhost:3000):**
```bash
cd frontend
npm run dev
```

### 4️⃣ Access the Application

- **Homepage**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Admin PIN**: `FT001`

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
