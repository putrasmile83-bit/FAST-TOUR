╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║              FAST TOUR - COMPLETE DEPLOYMENT GUIDE FOR RAILWAY            ║
║                                                                            ║
║                         ✓ Backend + Frontend Ready                        ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

═════════════════════════════════════════════════════════════════════════════

🚀 DEPLOY BACKEND TO RAILWAY (STEP-BY-STEP)

═════════════════════════════════════════════════════════════════════════════

OPTION 1: Deploy with Railway CLI (Recommended - Fastest)

Step 1: Install Railway CLI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Windows (PowerShell):
    iwr https://railway.app/install.ps1 -useb | iex

Or use npm:
    npm i -g @railway/cli

Verify installation:
    railway --version


Step 2: Login to Railway
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    railway login

This opens a browser. Follow the prompts to authorize.


Step 3: Initialize Railway Project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Navigate to project root:
    cd c:\Users\putra\eco\FAST-TOUR

Link to Railway:
    railway link

When asked "Is this a new Railway project?", type: yes


Step 4: Deploy Backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Navigate to backend folder:
    cd backend

Deploy:
    railway up

This will:
✓ Build the project using Dockerfile
✓ Upload to Railway servers
✓ Start the application
✓ Generate a public URL


Step 5: Get Your Backend URL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
View your deployment:
    railway open

Or find URL in Railway dashboard:
    https://dashboard.railway.app/
    
Your backend URL will look like:
    https://fast-tour.railway.app
    
📝 SAVE THIS URL - YOU'LL NEED IT FOR FRONTEND


Step 6: Verify Deployment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test your backend:
    curl https://fast-tour.railway.app/api/health

Expected response:
    {"status":"ok","service":"FAST TOUR Backend",...}


═════════════════════════════════════════════════════════════════════════════

OPTION 2: Deploy via GitHub (If CLI doesn't work)

Step 1: Push Code to GitHub
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    cd c:\Users\putra\eco\FAST-TOUR
    git add -A
    git commit -m "Final deployment version"
    git push origin main


Step 2: Connect to Railway Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Go to: https://railway.app/
2. Sign in with GitHub
3. Click "+ New Project"
4. Select "Deploy from GitHub repo"
5. Authorize Railway to access your repos
6. Select: putrasmile83-bit/FAST-TOUR


Step 3: Configure Build
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
In Railway Dashboard:
1. Select the FAST-TOUR repository
2. Click "Configure"
3. Set Root Directory: ./backend
4. Railway auto-detects Dockerfile ✓


Step 4: Add Environment Variables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
In Railway Dashboard Variables tab, add:

    NODE_ENV = production
    PORT = 5000
    TELEGRAM_BOT_TOKEN = (your bot token)
    ADMIN_PIN = FT001
    FRONTEND_URL = (leave empty for now)


Step 5: Deploy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Click "Deploy" button
Wait for build to complete (~2-3 minutes)
Copy the generated URL


═════════════════════════════════════════════════════════════════════════════

🌐 DEPLOY FRONTEND TO VERCEL (STEP-BY-STEP)

═════════════════════════════════════════════════════════════════════════════

Step 1: Install Vercel CLI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    npm i -g vercel


Step 2: Add Environment Variable
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Create file: .env.production

    VITE_API_URL=https://fast-tour.railway.app

(Replace with YOUR Railway backend URL)


Step 3: Build & Deploy to Vercel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    cd frontend
    vercel --prod

Follow the prompts:
✓ Project name: FAST-TOUR (or your preference)
✓ Directory: (use default)
✓ Build command: npm run build
✓ Output directory: dist


Step 4: Get Frontend URL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your frontend URL:
    https://fast-tour.vercel.app

(Or your custom domain)


═════════════════════════════════════════════════════════════════════════════

✅ VERIFY DEPLOYMENT

═════════════════════════════════════════════════════════════════════════════

Test Backend Health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    curl https://fast-tour.railway.app/api/health

Expected output:
    {"status":"ok","service":"FAST TOUR Backend","environment":"production",...}


Test Frontend Loading
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Open: https://fast-tour.vercel.app
2. Should load without 404 errors
3. Check console (F12 → Console) for errors


Test API Connection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Open DevTools (F12)
2. Go to Console
3. Run:
    fetch('https://fast-tour.railway.app/api/health')
      .then(r => r.json())
      .then(d => console.log(d))

Should show status: "ok"


═════════════════════════════════════════════════════════════════════════════

🔧 TROUBLESHOOTING

═════════════════════════════════════════════════════════════════════════════

Error: "npm: not found" on Railway
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ This is FIXED! The Dockerfile now includes Node.js
✓ Make sure you pushed the latest code with the Dockerfile

Fix:
    1. Push latest code
    2. Delete old Railway deployment
    3. Redeploy: railway up


Error: "Frontend shows 404"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ The vercel.json file handles this
✓ Make sure vercel.json exists in root

File location: FAST-TOUR/vercel.json


Error: "Backend URL not working"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Possible causes:
1. Railway deployment not complete
2. Wrong URL in frontend .env
3. CORS not configured

Fix:
    1. Wait 5 minutes for Railway to initialize
    2. Check Railway dashboard for errors
    3. View logs: railway logs


Error: "API returns CORS error"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is fixed in the backend code.
If still seeing CORS error:
    1. Check backend/src/server.js line 50
    2. Ensure CORS middleware is configured
    3. Redeploy backend


═════════════════════════════════════════════════════════════════════════════

📊 PAYMENT SYSTEM TEST

═════════════════════════════════════════════════════════════════════════════

Test Creating a Payment

Step 1: Register a Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    curl -X POST https://fast-tour.railway.app/api/registrations \
      -H "Content-Type: application/json" \
      -d '{
        "teamName":"Test Team",
        "playerCount":5,
        "fee":5000
      }'

You'll get back:
    {"id":"REGISTRATION-ID-HERE",...}

📝 SAVE THIS ID


Step 2: Create Payment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    curl -X POST https://fast-tour.railway.app/api/payments/create \
      -H "Content-Type: application/json" \
      -d '{
        "registrationId":"REGISTRATION-ID-HERE",
        "paymentMethod":"QRIS",
        "baseAmount":5000000
      }'

You should get:
    {
      "paymentId":"...",
      "orderId":"TRN-12345",
      "uniqueNominal":1234,
      "totalAmount":5001234,
      "countdown":"10:00"
    }


Step 3: Check Payment Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    curl https://fast-tour.railway.app/api/payments/PAYMENT-ID-HERE/status

Should return status: "pending"


═════════════════════════════════════════════════════════════════════════════

📁 PROJECT STRUCTURE (Final)

═════════════════════════════════════════════════════════════════════════════

FAST-TOUR/
├── backend/
│   ├── src/
│   │   ├── server.js (Main API - Production Ready)
│   │   └── services/
│   │       ├── paymentService.js
│   │       └── telegramService.js
│   ├── Dockerfile (NEW - For Railway)
│   ├── railway.json (NEW - Railway config)
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── PaymentPage.jsx (Simplified, Stable)
│   │   ├── styles/
│   │   │   ├── global.css (Black/Yellow Theme)
│   │   │   └── payment.css (Updated)
│   │   └── index.css
│   ├── vite.config.js
│   ├── package.json
│   └── .env.production (NEW - API URL)
│
├── vercel.json (Frontend SPA config)
├── .gitignore
└── DEPLOYMENT_GUIDE.md (This file)


═════════════════════════════════════════════════════════════════════════════

📝 CHECKLIST

═════════════════════════════════════════════════════════════════════════════

Before Deploying:
  ☐ Backend files ready (server.js, services/)
  ☐ Dockerfile exists in backend/
  ☐ railway.json configured
  ☐ Frontend PaymentPage.jsx updated
  ☐ payment.css updated with new theme
  ☐ .env.production created in frontend/
  ☐ All code committed to git

Deploying Backend:
  ☐ Railway CLI installed
  ☐ Logged into Railway
  ☐ Backend deployed successfully
  ☐ Backend URL obtained
  ☐ Health check passing

Deploying Frontend:
  ☐ .env.production updated with backend URL
  ☐ Frontend deployed to Vercel
  ☐ Frontend URL obtained
  ☐ No console errors

Testing:
  ☐ Backend /api/health working
  ☐ Frontend loads without 404
  ☐ API connection successful
  ☐ Payment creation works
  ☐ Status polling works


═════════════════════════════════════════════════════════════════════════════

🎯 NEXT STEPS

═════════════════════════════════════════════════════════════════════════════

1. Deploy Backend to Railway (10-15 minutes)
2. Deploy Frontend to Vercel (5-10 minutes)
3. Test both systems
4. Go live! 🎉

If any errors occur:
  1. Check the troubleshooting section
  2. Review the logs
  3. Make corrections and redeploy


═════════════════════════════════════════════════════════════════════════════

💡 TIPS

═════════════════════════════════════════════════════════════════════════════

- Railway provides free tier with some limits
- Vercel provides free tier for static/SPA deployments
- Database is SQLite (production-ready for Railway)
- For production scale, upgrade to PostgreSQL on Railway
- Monitor deployment progress in dashboards
- Save backend URL in secure location


═════════════════════════════════════════════════════════════════════════════

📞 SUPPORT

═════════════════════════════════════════════════════════════════════════════

Railway Support: https://railway.app/support
Vercel Support: https://vercel.com/support
Backend Logs: railway logs
Frontend Logs: Browser Console (F12)

═════════════════════════════════════════════════════════════════════════════
