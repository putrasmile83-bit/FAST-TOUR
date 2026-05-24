# 🚀 Step-by-Step Execution Plan

## Choose Your Path

### **Path A: Development Mode (Testing Locally)**
*Keep everything as-is, data is OK to lose*

```
Currently works perfectly for:
✅ Testing features
✅ Debugging
✅ Demos on your machine
✅ Small team testing

Skip to → "Run Locally" section
```

---

### **Path B: Production Mode (Real Tournament)**
*Add SQLite persistence + Deploy 24/7*

```
Required for:
✅ Real money handling
✅ Long-term data storage
✅ 24/7 bot availability
✅ Production deployment

Follow → Complete steps below
```

---

---

# PATH A: Development Mode (Skip To Here If Testing)

## 1. Run Backend Locally
```bash
cd backend
npm start
```

Expected output:
```
✓ Telegram Bot initialized and polling
✓ Bot is ready to receive messages
Server running on port 5000
```

## 2. Run Frontend Locally (New Terminal)
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.0.0 ready in 2 ms
➜  Local:   http://localhost:3000/
```

## 3. Open Browser
```
http://localhost:3000
```

## 4. Test Features
- Register a team
- Make payment
- Send photo to Telegram bot
- Check admin panel (PIN: FT001)

## 5. Stop Servers When Done
```bash
Ctrl+C in each terminal
```

**That's it!** Everything works, data is in RAM (fine for testing).

---

---

# PATH B: Production Mode (Complete Steps Below)

## Phase 1: Add SQLite Database (1-2 hours)

### Step 1.1: Install SQLite Package
```bash
cd backend
npm install sqlite3
```

**Check**: Should see `+ sqlite3@` in output

### Step 1.2: Database Module Already Created
File `backend/src/database.js` already exists!

```bash
ls -la backend/src/database.js
```

**Expected**: File exists (1.4 KB)

### Step 1.3: Create Data Directory
```bash
mkdir -p backend/data
```

### Step 1.4: Update server.js - TOP of file
Add after `require('dotenv').config()`:

```javascript
const { initializeDatabase, dbRun, dbGet, dbAll } = require('./database')

// ... then after app initialization, add:
initializeDatabase()
```

### Step 1.5: Update Endpoints (Copy-Paste from SQLITE_MIGRATION.md)

**Find and Replace These 6 Endpoints:**

1. `POST /api/registrations`
2. `GET /api/registrations`
3. `GET /api/registrations/:id`
4. `PUT /api/registrations/:id/payment`
5. Telegram user mapping (2 places)

**Guide**: Open `SQLITE_MIGRATION.md` - each endpoint has before/after code

### Step 1.6: Test Locally
```bash
# Terminal 1
cd backend
npm start

# Should see:
# ✓ SQLite database connected: ...tournament.db
# ✓ Registrations table ready
# ✓ All database tables initialized
```

### Step 1.7: Verify Data Persists
```bash
# Terminal 2
curl -X POST http://localhost:5000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{"teamName":"Test Team","playerCount":2,"fee":5}'

# Should get:
# {"message":"Registration submitted successfully","registration":{...}}
```

### Step 1.8: Check Data Survived Restart
```bash
# In Terminal 1, press Ctrl+C (stop backend)
# Wait 2 seconds
# Type: npm start (restart backend)

# In Terminal 2
curl http://localhost:5000/api/registrations

# Should still show the test team!
```

**Checkpoint 1 Complete!** ✅ Data now persists locally

---

## Phase 2: Deploy to DigitalOcean (30 minutes)

### Step 2.1: Create DigitalOcean Account
1. Go to **digitalocean.com**
2. Sign up (email or GitHub)
3. Add payment method
4. Confirm account

### Step 2.2: Create Droplet
1. Click **"Create"** → **"Droplets"**
2. Choose **Ubuntu 22.04 LTS**
3. Size: **Basic ($4/month)**
   - 1 GB RAM
   - 1 vCPU
   - 25 GB SSD
4. Region: **Choose closest to your users**
5. Authentication: **SSH Key** (or Password)
6. Hostname: `fast-tour-bot`
7. Click **"Create Droplet"**
8. **Wait 2-3 minutes** for server to start

### Step 2.3: Connect to Server (SSH)
```bash
# Get IP from DigitalOcean dashboard

ssh root@YOUR_DROPLET_IP

# First time: Accept fingerprint
# Press: yes
```

### Step 2.4: Update Server
```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2.5: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs npm

# Verify
node --version    # Should be v18.x.x
npm --version     # Should be 9.x.x
```

### Step 2.6: Install PM2
```bash
sudo npm install -g pm2

# Setup auto-restart on boot
pm2 startup
# Copy the command it shows and run it

pm2 save
```

### Step 2.7: Clone Project
```bash
cd ~
git clone https://github.com/YOUR_USERNAME/FAST-TOUR.git
cd FAST-TOUR/backend

# Install dependencies
npm install
```

### Step 2.8: Create .env File
```bash
nano .env
```

Paste (update with your values):
```
NODE_ENV=production
PORT=5000

TELEGRAM_BOT_TOKEN=8278697371:AAEXIhx_lXQDLv4uWoIZagZat-Tuxk0x5_Y
ADMIN_PHONE_1=+6285857322097
ADMIN_PHONE_2=+628972337396
ADMIN_BANK_ACCOUNT=085716941474
```

Save: `Ctrl+X` → `Y` → `Enter`

### Step 2.9: Start Bot with PM2
```bash
pm2 start src/server.js --name "fast-tour-bot"

# View logs
pm2 logs fast-tour-bot

# Should see:
# ✓ Telegram Bot initialized and polling
# ✓ SQLite database connected
# ✓ All database tables initialized
# Server running on port 5000
```

**Checkpoint 2 Complete!** ✅ Bot runs 24/7 on DigitalOcean

---

## Phase 3: Setup Frontend (Optional - If You Have Domain)

### Step 3.1: Build Frontend
```bash
cd ~/FAST-TOUR/frontend
npm install
npm run build
```

### Step 3.2: Install Nginx
```bash
sudo apt install -y nginx
```

### Step 3.3: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/default
```

Replace entire file with:
```nginx
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  
  server_name _;

  location / {
    root /root/FAST-TOUR/frontend/dist;
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Save: `Ctrl+X` → `Y` → `Enter`

### Step 3.4: Restart Nginx
```bash
sudo systemctl restart nginx
```

### Step 3.5: Get SSL Certificate (Free)
```bash
sudo apt install -y certbot python3-certbot-nginx

sudo certbot --nginx

# Follow prompts
# Enter your email
# Accept terms
# Enter domain (if you have one)
```

**Checkpoint 3 Complete!** ✅ Frontend served on HTTPS

---

## Phase 4: Monitoring & Backups (Ongoing)

### Step 4.1: Monitor Bot Health
```bash
# View all processes
pm2 list

# View logs (real-time)
pm2 logs fast-tour-bot

# Monitor CPU/Memory
pm2 monit
```

### Step 4.2: Setup Automated Backups
```bash
# Create backup directory
mkdir ~/backups

# Create backup script
nano ~/backup.sh
```

Paste:
```bash
#!/bin/bash
cp ~/FAST-TOUR/backend/data/tournament.db ~/backups/tournament_$(date +%Y%m%d_%H%M%S).db
find ~/backups -mtime +30 -delete
echo "Backup completed"
```

Save: `Ctrl+X` → `Y` → `Enter`

```bash
chmod +x ~/backup.sh

# Schedule daily backup at 2 AM
crontab -e

# Add this line:
0 2 * * * /root/backup.sh
```

### Step 4.3: Setup Uptime Monitoring (Free)
1. Go to **uptimerobot.com**
2. Sign up (free)
3. Add monitor:
   - Type: HTTP(s)
   - URL: `http://YOUR_DROPLET_IP:5000/api/health`
   - Check every: 5 minutes
4. Get email alerts if down

**Checkpoint 4 Complete!** ✅ Bot monitored 24/7

---

---

# Verification Checklist

## For Local Development (Path A)
- [ ] Backend starts: `npm start`
- [ ] Frontend loads: http://localhost:3000
- [ ] Can register team
- [ ] Can submit payment
- [ ] Telegram bot responds to `/start`
- [ ] Admin panel works (PIN: FT001)

## For Production (Path B)
- [ ] SQLite installed: `npm list sqlite3`
- [ ] Database file exists: `backend/data/tournament.db`
- [ ] All endpoints updated (6 changes)
- [ ] Local test passes (data persists after restart)
- [ ] DigitalOcean droplet created ($4/month)
- [ ] Bot running on DigitalOcean: `pm2 list`
- [ ] Bot logs show "✓ Polling active": `pm2 logs`
- [ ] Can register via remote server
- [ ] Backups configured
- [ ] Uptime monitoring enabled

---

---

# Troubleshooting

### Bot Not Starting
```bash
# Check logs
pm2 logs fast-tour-bot

# Restart
pm2 restart fast-tour-bot

# Check token in .env
cat .env | grep TELEGRAM_BOT_TOKEN
```

### Database Errors
```bash
# Check database file exists
ls -la backend/data/tournament.db

# Check database integrity
sqlite3 backend/data/tournament.db ".tables"

# View all registrations
sqlite3 backend/data/tournament.db "SELECT * FROM registrations;"
```

### Can't SSH to DigitalOcean
```bash
# Check IP is correct
# Check firewall allows SSH (port 22)
# Try with password instead of SSH key
```

### Nginx Not Working
```bash
# Check syntax
sudo nginx -t

# Restart
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/error.log
```

---

---

# Timeline

| Phase | Time | Complexity | Required |
|-------|------|-----------|----------|
| **A: Local Dev** | 10 min | ⭐ Easy | For testing |
| **B1: Add SQLite** | 1-2 hrs | ⭐⭐ Medium | For production |
| **B2: Deploy** | 30 min | ⭐⭐ Medium | For 24/7 |
| **B3: Frontend** | 20 min | ⭐⭐ Medium | If you have domain |
| **B4: Monitoring** | 10 min | ⭐ Easy | For peace of mind |

---

## Next Steps

1. **Choose Path A or B**
2. **Follow corresponding steps**
3. **Test each checkpoint**
4. **Ask if stuck on any step**

**You got this!** 🚀
