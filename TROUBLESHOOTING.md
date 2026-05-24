## FAST TOUR - Installation Help

If you're having trouble with setup, follow these steps:

### ✅ Prerequisite Check

1. **Node.js installed?**
   ```bash
   node --version
   npm --version
   ```
   Should show version numbers. If not, download from nodejs.org

2. **In correct folder?**
   ```bash
   cd FAST-TOUR
   dir (Windows) or ls (Mac/Linux)
   ```
   Should see `frontend`, `backend`, `README.md`

### 🛠️ Step-by-Step Installation

#### Step 1: Environment Setup
```bash
# From FAST-TOUR folder
copy .env.example .env
```

Open `.env` file and update:
- `ADMIN_PHONE_1` (your number)
- `ADMIN_PHONE_2` (admin number)
- Keep other values for testing

#### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```
Wait for completion (2-3 minutes)

#### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```
Wait for completion (3-5 minutes)

#### Step 4: Start Backend (Terminal 1)
```bash
cd backend
npm start
```
Should see: "Running on port 5000"

#### Step 5: Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Should see: "Local: http://localhost:3000"

#### Step 6: Test the App
1. Open http://localhost:3000
2. Click "Join Tournament"
3. Fill registration form
4. Click "Proceed to Payment"
5. Test admin: http://localhost:3000/admin (PIN: FT001)

### 🐛 Troubleshooting

**Error: npm not found**
- Install Node.js from nodejs.org
- Restart terminal
- Run `npm --version`

**Error: Port 3000 in use**
- Change port in vite.config.js
- Or kill process using port 3000

**Error: REACT_APP_API_URL not working**
- Add to frontend/.env:
  ```
  REACT_APP_API_URL=http://localhost:5000
  ```

**Error: Backend not responding**
- Check if running on http://localhost:5000
- In browser console, check for CORS errors
- Restart backend server

**Error: Admin panel PIN not working**
- Default PIN: FT001
- Make sure you're at /admin route
- Check .env for PIN changes

### 📞 Common Questions

**Q: Where's my database?**
A: Uses localStorage (frontend) and in-memory (backend). Add MongoDB later.

**Q: Can I change the port?**
A: Frontend: vite.config.js → Backend: .env PORT setting

**Q: How to change admin PIN?**
A: Update REACT_APP_ADMIN_PIN in .env (both frontend & backend)

**Q: Where are registrations saved?**
A: Frontend: localStorage | Backend: in-memory (temp)

### ✨ Quick Test Checklist

- [ ] Backend running on localhost:5000
- [ ] Frontend running on localhost:3000
- [ ] Homepage loads without errors
- [ ] Can fill registration form
- [ ] Payment page displays correctly
- [ ] Admin panel access works
- [ ] Admin PIN (FT001) works
- [ ] Toast notifications appear

### 🆘 Still Stuck?

1. Check browser Console (F12)
2. Check terminal for errors
3. Verify .env file configured
4. Ensure ports 3000 & 5000 are free
5. Try installing dependencies again
6. Delete node_modules and reinstall

---

**Version**: 1.0.0
