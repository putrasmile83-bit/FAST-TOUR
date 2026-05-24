# Project Structure Overview

## Complete Directory Tree

```
FAST-TOUR/
│
├── 📄 .env.example                          # Environment variables template
├── 📄 .gitignore                            # Git ignore rules
├── 📄 README.md                             # Complete documentation
├── 📄 QUICK_START.md                        # 5-minute quick start
├── 📄 FEATURES.md                           # Complete feature list
├── 📄 API_DOCUMENTATION.md                  # API endpoints reference
├── 📄 DEPLOYMENT.md                         # Production deployment guide
│
├── 📁 frontend/                             # React Frontend (Vite)
│   │
│   ├── 📄 package.json                      # Frontend dependencies
│   ├── 📄 vite.config.js                    # Vite configuration
│   ├── 📄 index.html                        # HTML entry point
│   │
│   └── 📁 src/
│       │
│       ├── 📄 main.jsx                      # React app entry
│       ├── 📄 App.jsx                       # Main app component
│       │
│       ├── 📁 pages/                        # Page components
│       │   ├── LandingPage.jsx              # Home/welcome page
│       │   ├── Dashboard.jsx                # Tournament dashboard
│       │   ├── PaymentPage.jsx              # Payment gateway
│       │   ├── RegistrationPage.jsx         # Team registration
│       │   ├── TournamentRulesPage.jsx      # Rules display
│       │   ├── AdminContactPage.jsx         # Admin contact info
│       │   └── AdminPanel.jsx               # Admin dashboard
│       │
│       ├── 📁 components/                   # Reusable components
│       │   └── ProtectedRoute.jsx           # Admin PIN authentication
│       │
│       ├── 📁 context/                      # State management
│       │   └── AppContext.jsx               # Global app state
│       │
│       ├── 📁 styles/                       # CSS files
│       │   ├── global.css                   # Global styles & variables
│       │   ├── landing.css                  # Landing page styles
│       │   ├── dashboard.css                # Dashboard styles
│       │   ├── payment.css                  # Payment page styles
│       │   ├── registration.css             # Registration styles
│       │   ├── admin-contact.css            # Admin contact styles
│       │   ├── rules.css                    # Rules page styles
│       │   ├── admin-panel.css              # Admin panel styles
│       │   └── protected-route.css          # Auth styles
│       │
│       ├── 📁 utils/                        # Utility functions
│       │   └── README.md                    # Utils documentation
│       │
│       └── 📁 assets/                       # Static assets
│           └── (QRIS images, etc.)
│
├── 📁 backend/                              # Node.js Backend (Express)
│   │
│   ├── 📄 package.json                      # Backend dependencies
│   ├── 📄 .env                              # Environment config (create from .env.example)
│   │
│   └── 📁 src/
│       │
│       ├── 📄 server.js                     # Express server & main API
│       │
│       ├── 📁 config/                       # Configuration files
│       │   └── config.js                    # App configuration
│       │
│       ├── 📁 middleware/                   # Express middleware
│       │   ├── auth.js                      # Authentication/PIN validation
│       │   └── errorHandler.js              # Error handling
│       │
│       ├── 📁 routes/                       # API routes (organized by feature)
│       │   └── (routes to be added)
│       │
│       ├── 📁 controllers/                  # Request handlers (organized by feature)
│       │   └── (controllers to be added)
│       │
│       ├── 📁 models/                       # Data models
│       │   └── (models to be added)
│       │
│       └── 📁 utils/                        # Utility functions
│           ├── telegramService.js           # Telegram bot integration
│           ├── whatsappService.js           # WhatsApp link generator
│           ├── validator.js                 # Input validation
│           └── apiResponse.js               # Standardized API responses

```

## File Categories

### 🎨 Frontend Pages (7 files)
1. LandingPage.jsx - Welcome and tournament info
2. Dashboard.jsx - Registration overview
3. RegistrationPage.jsx - Team registration form
4. PaymentPage.jsx - Payment processing
5. TournamentRulesPage.jsx - Game rules
6. AdminContactPage.jsx - Admin information
7. AdminPanel.jsx - Admin management

### 🎭 Frontend Components (1 file)
1. ProtectedRoute.jsx - Admin authentication

### 🎨 Frontend Styles (9 files)
- global.css - Base styles & variables
- 8 page-specific CSS files

### 💾 Frontend Context (1 file)
- AppContext.jsx - Global state management

### 🔌 Backend API (1 main file)
- server.js - All routes and handlers

### ⚙️ Backend Utils (4 files)
- Telegram service
- WhatsApp service
- Validator
- API response helper

### 📚 Documentation (5 files)
- README.md - Complete guide
- QUICK_START.md - Fast setup
- FEATURES.md - Feature list
- API_DOCUMENTATION.md - API reference
- DEPLOYMENT.md - Production guide

---

## Key File Purposes

### Configuration
- `.env.example` - Template for environment variables
- `package.json` - Dependencies (frontend & backend)
- `vite.config.js` - Vite build configuration
- `config.js` - Backend configuration

### Entry Points
- `frontend/index.html` - HTML root
- `frontend/src/main.jsx` - React entry
- `frontend/src/App.jsx` - App routing
- `backend/src/server.js` - API server

### State & Logic
- `AppContext.jsx` - Frontend state
- `server.js` - Backend business logic
- `telegramService.js` - Telegram integration
- `whatsappService.js` - WhatsApp message generation

### Styling
- `global.css` - CSS variables and base styles
- Page-specific CSS files - Component styling
- Pixel aesthetic, white/red theme applied globally

---

## Dependencies

### Frontend Libraries
- React 18.2.0 - UI framework
- React Router DOM 6.20.0 - Routing
- Vite 5.0.0 - Build tool
- Framer Motion 10.16.0 - Animations
- React Toastify 9.1.3 - Notifications
- Axios 1.6.0 - HTTP client
- React Icons 4.12.0 - Icon library

### Backend Libraries
- Express 4.18.2 - Server framework
- CORS 2.8.5 - Cross-origin requests
- Node Telegram Bot API 0.63.0 - Telegram integration
- Axios 1.6.0 - HTTP requests
- UUID 9.0.1 - Unique IDs
- Dotenv 16.3.1 - Environment variables

---

## File Size Estimates

```
Frontend: ~150 KB (before build)
Backend: ~50 KB (node_modules not included)
Total: ~200 KB source code
```

---

## How to Navigate

1. **User Journey**: 
   - Landing → Registration → Payment → Admin Contact

2. **Admin Journey**:
   - Admin Panel (/admin) → PIN Auth → Tabs

3. **File Organization**:
   - Pages in `/pages`
   - Styles in `/styles`
   - Utilities in `/utils`
   - State in `/context`

4. **Adding Features**:
   - New page? → `/pages/FeatureName.jsx`
   - New style? → `/styles/feature.css`
   - New utility? → `/utils/feature.js`
   - New API? → Add route in `server.js`

---

**Last Updated**: 2024
**Version**: 1.0.0
