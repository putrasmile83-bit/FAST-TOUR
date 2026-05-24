# 🚀 COMPLETE DEPLOYMENT GUIDE - Replit + Vercel

## **IMPORTANT: Do These Steps in ORDER**

---

## **STEP 1: DEPLOY BACKEND TO REPLIT** (10 minutes)

### **What is Replit?**
- Free cloud platform that runs your backend 24/7
- Telegram bot polls continuously (never stops)
- Perfect for your needs
- No credit card needed

### **Detailed Steps:**

#### **1.1 - Go to Replit**
```
1. Open: https://replit.com
2. Click "Sign up" (top right)
3. Choose "Sign up with GitHub"
4. Connect your GitHub account
5. Done! ✓
```

#### **1.2 - Create New Replit Project**
```
1. Click "+ Create Replit" (or "New Replit")
2. Click "Import from GitHub"
3. Enter repository URL:
   https://github.com/YOUR_USERNAME/FAST-TOUR
   
4. Select the repository
5. Click "Import"
6. Wait for it to load (30 seconds)
```

#### **1.3 - Configure Replit**
```
IMPORTANT: When Replit asks what to do with package.json:
→ Select: "Use npm as package manager"
→ Click: "Import"

Wait for dependencies to install...
(This takes 1-2 minutes)
```

#### **1.4 - Add Environment Variables (CRITICAL!)**
```
In Replit, on the left side:
1. Click the "Secrets" button (looks like a lock 🔒)
2. Click "Add Secret"
3. Add these variables (copy exactly):

Name: NODE_ENV
Value: production
[Click "Add Secret"]

Name: PORT
Value: 5000
[Click "Add Secret"]

Name: TELEGRAM_BOT_TOKEN
Value: 8278697371:AAEXIhx_lXQDLv4uWoIZagZat-Tuxk0x5_Y
[Click "Add Secret"]

Name: ADMIN_PHONE_1
Value: +6285857322097
[Click "Add Secret"]

Name: ADMIN_PHONE_2
Value: +628972337396
[Click "Add Secret"]

Name: ADMIN_BANK_ACCOUNT
Value: 085716941474
[Click "Add Secret"]

Name: ADMIN_PIN
Value: FT001
[Click "Add Secret"]

After ALL secrets are added, go to next step ↓
```

#### **1.5 - Run the Backend**
```
In Replit:
1. Click "Run" button (top of screen)
2. Wait for it to start...

You should see in console:
✓ SQLite database connected
✓ Telegram Bot initialized
✓ Running on port 5000

Copy the URL it shows at the top. It will look like:
https://FAST-TOUR-YOUR-USERNAME.replit.dev

SAVE THIS URL! You'll need it for frontend setup.
```

#### **1.6 - Test Backend is Working**
```
In a new browser tab, open:
https://FAST-TOUR-YOUR-USERNAME.replit.dev/api/health

You should see:
{
  "status": "Server is running",
  "timestamp": "..."
}

✓ Backend is WORKING!
```

---

## **STEP 2: DEPLOY FRONTEND TO VERCEL** (10 minutes)

### **What is Vercel?**
- Best platform for React apps
- Auto-deploys on every GitHub push
- Super fast global network
- Free forever

### **Detailed Steps:**

#### **2.1 - Update Frontend Configuration**
**Important: Do this BEFORE deploying**

In your local project:
```bash
# Open: frontend/.env

Change this line:
VITE_API_URL=http://localhost:5000

To this:
VITE_API_URL=https://FAST-TOUR-YOUR-USERNAME.replit.dev

(Use the Replit URL you saved from Step 1.5)
```

Save the file and PUSH to GitHub:
```bash
git add frontend/.env
git commit -m "Update API URL to production"
git push
```

#### **2.2 - Go to Vercel**
```
1. Open: https://vercel.com
2. Click "Sign Up" (top right)
3. Choose "Continue with GitHub"
4. Authorize Vercel to access GitHub
5. Done! ✓
```

#### **2.3 - Create New Project on Vercel**
```
1. Click "Add New..." (or "New Project")
2. Click "Import Git Repository"
3. Enter your GitHub URL:
   https://github.com/YOUR_USERNAME/FAST-TOUR
4. Click "Import"
```

#### **2.4 - Configure Vercel Project**
```
Vercel will show configuration page:

PROJECT NAME: Leave as default (FAST-TOUR)

ROOT DIRECTORY: Click "Edit" and select "frontend"
(Important! This tells Vercel where your React app is)

FRAMEWORK: Should auto-detect "Vite"
(If not, select it manually)

BUILD COMMAND: npm run build
(Should be auto-filled)

OUTPUT DIRECTORY: dist
(Should be auto-filled)

Click "Deploy"
```

#### **2.5 - Wait for Deployment**
```
Vercel will show:
- "Building..." (takes 1-2 minutes)
- Then "Deployed! 🎉"

Click on the deployed URL, it will look like:
https://fast-tour-[random].vercel.app

SAVE THIS URL!
```

#### **2.6 - Test Frontend**
```
Open your Vercel URL in browser:
https://fast-tour-[random].vercel.app

You should see:
✓ FAST TOUR landing page loads
✓ Registration button works
✓ Navigation works

If you see "Cannot connect to backend":
→ Check that VITE_API_URL is correct in frontend/.env
→ Make sure Replit URL is in that file
→ Push to GitHub again
→ Vercel will auto-redeploy
```

---

## **STEP 3: TEST EVERYTHING TOGETHER** (5 minutes)

### **Test Registration**
```
1. Go to: https://fast-tour-[your-vercel-url].vercel.app
2. Click "Register a Team"
3. Fill in:
   - Team Name: Test Team
   - Players: 2
   - Fee: 5
4. Click Submit
5. Should see: "Registration successful!"
```

### **Test Admin Panel**
```
1. In same page, click "Admin Panel" (bottom of page)
2. Enter PIN: FT001
3. Click "Login"
4. Should see your test team in the list
5. Click "Verify Payment" (if you want to test)
```

### **Test Telegram Bot**
```
1. Open Telegram app
2. Search for: @YOUR_BOT_NAME
3. Send: /start
4. Should see welcome menu
5. Send: /help
6. Should see help menu

If bot doesn't respond:
→ Check TELEGRAM_BOT_TOKEN is correct in Replit secrets
→ Restart Replit (click "Stop" then "Run")
```

---

## **TROUBLESHOOTING**

### **Replit Won't Start**
```
If you see errors when clicking "Run":

1. Check all secrets are added (Step 1.4)
2. Click "Stop" button
3. Click "Run" again
4. Wait 30 seconds

Still not working?
→ In Replit, click "..." menu
→ Click "View all files"
→ Check src/server.js exists
→ Check package.json exists
```

### **Vercel Shows Error**
```
If frontend shows "Cannot connect to backend":

1. Check VITE_API_URL in frontend/.env
2. Make sure it has your Replit URL (from Step 1.5)
3. Push to GitHub: git push
4. Go to Vercel dashboard
5. Click your project
6. Should auto-redeploy
7. Wait 2 minutes
8. Refresh browser
```

### **Bot Not Responding**
```
If Telegram bot sends no messages:

1. Go to Replit
2. Check console for errors
3. Click "Stop" then "Run"
4. Wait for: "✓ Telegram Bot initialized"
5. Try /start again in Telegram
```

### **Cannot Access Replit URL**
```
If https://FAST-TOUR-YOUR-USERNAME.replit.dev shows error:

1. Go to Replit dashboard
2. Click your project
3. Make sure it says "Running" (green circle)
4. If not running, click "Run" button
5. Wait 30 seconds
6. Refresh the URL
```

---

## **YOUR FINAL URLS**

After deployment, you'll have:

```
FRONTEND:  https://fast-tour-[random].vercel.app
BACKEND:   https://FAST-TOUR-YOUR-USERNAME.replit.dev
ADMIN:     https://fast-tour-[random].vercel.app/admin (PIN: FT001)
```

---

## **WHAT HAPPENS NOW**

### **Backend (Replit)**
- Runs 24/7 automatically
- Telegram bot polls continuously
- Database saved locally
- Auto-restarts if crashes
- Cost: $0/month ✓

### **Frontend (Vercel)**
- Always online and fast
- Auto-deploys when you push to GitHub
- Works on all devices
- Cost: $0/month ✓

### **Together**
- Your tournament platform is LIVE
- Works 24/7
- Zero cost
- Professional quality

---

## **NEXT STEPS**

After everything is deployed:

1. Share your frontend URL with people
2. They can register at: https://fast-tour-[your-url].vercel.app
3. You approve payments in admin panel
4. Telegram bot helps verify payments
5. Everything works! 🎉

---

## **SUPPORT**

If you get stuck at any step:

1. Check the Troubleshooting section above
2. Read the specific step again carefully
3. Make sure you copied URLs correctly
4. Check spelling of environment variables

Common mistake: Wrong Replit URL in VITE_API_URL
→ Double-check the URL is correct
→ Don't add /api at the end, just the domain

---

**You've got this! Follow each step carefully and you'll be live in 20 minutes.** 🚀
