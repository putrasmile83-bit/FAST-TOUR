# FAST TOUR - Free Fire Clash Squad Tournament WebApp

A complete full-stack web application for managing Free Fire Clash Squad Tournaments with manual payment system, Telegram integration, and admin panel.

## 🎮 Features

### Frontend Features
- **Landing Page**: Welcome page with tournament information and CTA buttons
- **Dashboard**: Tournament statistics and registration overview
- **Registration Page**: Team registration with player count and fee selection
- **Payment System**: Manual payment with QRIS and Bank Transfer options
- **Tournament Rules**: Editable rules page with tournament guidelines
- **Admin Contact**: Direct admin communication with WhatsApp integration
- **Hidden Admin Panel**: PIN-protected admin dashboard with management features
- **Responsive Design**: Mobile-friendly pixel-style UI
- **Smooth Animations**: Framer Motion animations throughout the app
- **Toast Notifications**: Real-time success/error messages

### Backend Features
- **Express.js API**: RESTful API for all operations
- **Telegram Bot Integration**: Automatic registration notifications
- **WhatsApp Auto-Message Generator**: Pre-formatted payment messages
- **Payment Status Tracking**: Verified/Pending payment statuses
- **Admin Information Management**: Easy admin configuration
- **Registration Management**: Full CRUD operations

## 📁 Project Structure

```
FAST-TOUR/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── AdminContactPage.jsx
│   │   │   ├── TournamentRulesPage.jsx
│   │   │   ├── RegistrationPage.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx (Global State Management)
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── landing.css
│   │   │   ├── dashboard.css
│   │   │   ├── payment.css
│   │   │   ├── registration.css
│   │   │   ├── admin-contact.css
│   │   │   ├── rules.css
│   │   │   ├── admin-panel.css
│   │   │   └── protected-route.css
│   │   ├── utils/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── config.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── telegramService.js
│   │   │   ├── whatsappService.js
│   │   │   ├── validator.js
│   │   │   └── apiResponse.js
│   │   └── server.js
│   ├── package.json
│   └── .env (Create from .env.example)
│
├── .env.example
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Telegram Bot Token (optional, for notifications)

### Installation

1. **Clone or Extract Project**
```bash
cd FAST-TOUR
```

2. **Setup Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```
# FRONTEND
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ADMIN_PIN=FT001

# BACKEND
PORT=5000
TELEGRAM_BOT_TOKEN=8278697371:AAEXIhx_lXQDLv4uWoIZagZat-Tuxk0x5_Y
TELEGRAM_CHAT_ID=your_telegram_group_chat_id
ADMIN_PHONE_1=+6285857322097
ADMIN_PHONE_2=+628972337396
ADMIN_BANK_NAME=DANA ONLY
ADMIN_BANK_ACCOUNT=085716941474
```

3. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

4. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

### Running the Application

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```
Backend will run on: `http://localhost:5000`

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:3000`

## 📋 Configuration Guide

### Environment Variables

#### Frontend (.env or .env.local)
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000)
- `REACT_APP_ADMIN_PIN`: Admin panel PIN (default: FT001)

#### Backend (.env)
- `PORT`: Server port (default: 5000)
- `TELEGRAM_BOT_TOKEN`: Telegram bot token from BotFather
- `TELEGRAM_CHAT_ID`: Telegram group chat ID
- `ADMIN_PHONE_1`: First admin WhatsApp number (international format)
- `ADMIN_PHONE_2`: Second admin WhatsApp number
- `ADMIN_BANK_NAME`: Bank name for transfers
- `ADMIN_BANK_ACCOUNT`: Bank account number
- `ADMIN_QRIS_CODE`: QRIS payment code

### Admin Panel Access

1. Navigate to: `http://localhost:3000/admin`
2. Enter PIN: `FT001` (or your configured PIN)
3. Access admin features:
   - Payment verification
   - Admin information management
   - Tournament rules editing
   - Dashboard statistics

### Payment System

#### Manual Payment Setup
1. Go to Admin Panel → Settings
2. Update:
   - Bank account details
   - Admin phone numbers
   - QRIS code
3. Users select payment method (Bank Transfer or QRIS)
4. Admin verifies payment manually
5. Payment status changes to "Verified" (green)

### Telegram Integration

1. Create a bot using [@BotFather](https://t.me/botfather)
2. Get bot token from BotFather
3. Add bot to your group
4. Get group chat ID using [@userinfobot](https://t.me/userinfobot)
5. Add to .env:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=your_group_chat_id
   ```

### WhatsApp Integration

- Links auto-generate for:
  - Contacting admins
  - Payment confirmations
- Admin numbers configured in Settings

## 🎯 Workflow Explanation

### 1. User Registration Flow

```
Landing Page
    ↓
Join Tournament Button
    ↓
Registration Page
    ├─ Enter Team Name
    ├─ Select Player Count (1-4)
    ├─ Select Fee (1-5K)
    └─ Submit
    ↓
Payment Page
```

### 2. Payment Flow

```
Payment Page
    ├─ Select Payment Method
    │  ├─ Bank Transfer
    │  │   └─ Show Admin Bank Details
    │  └─ QRIS
    │      └─ Generate QR Code
    ├─ Select/Enter Amount
    ├─ Confirm Payment
    └─ Redirect to Admin Contact Page
        ├─ Show Admin Numbers
        └─ Option to Join WhatsApp/Telegram
```

### 3. Admin Verification Flow

```
Admin Panel (PIN Protected: FT001)
    ↓
Payment Verification Tab
    ├─ View All Registrations
    ├─ See Payment Status
    │  ├─ Pending (Yellow)
    │  └─ Verified (Green ✓)
    └─ Verify/Reject Payments
        ↓
        Telegram Notification Sent
        ↓
        User WhatsApp Confirmation
```

### 4. Telegram Integration Flow

```
User Registers
    ↓
Registration Data Sent to Backend
    ↓
Backend Sends Telegram Notification
    ↓
Admin Group Receives:
    - Team Name
    - Player Count
    - Registration Fee
    - Timestamp
```

### 5. WhatsApp Auto-Message Flow

```
User Clicks "Message Admin"
    ↓
Pre-formatted Message Generated:
    "Hello Admin, I have completed the payment.
     Team: [Team Name]
     Amount: [Amount]K"
    ↓
WhatsApp Opens with Message
    ↓
Admin Receives & Confirms
```

## 🔐 Admin Features

### Dashboard Tab
- Total registrations count
- Verified teams count
- Pending payments count
- Total players count

### Payment Verification Tab
- List all registrations
- View payment status
- Verify or reject payments
- Telegram notifications on action

### Settings Tab
- Update admin phone numbers
- Modify bank details
- Configure payment information

### Rules Tab
- Edit tournament rules
- Update guidelines
- Changes apply to all users

## 🎨 UI/UX Design

### Color Scheme
- **Primary**: White (#ffffff)
- **Secondary**: Red (#ff0000) - Action buttons, highlights
- **Accent**: Green (#00ff00) - Success indicators
- **Text**: Black (#000000)

### Design Features
- Pixel-style font (Press Start 2P)
- Smooth animations with Framer Motion
- Responsive grid layouts
- 3px border style for pixel aesthetic
- Shadow effects for depth
- Hover animations on interactive elements
- Mobile-optimized breakpoints

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1200px
- **Mobile**: Below 768px

## 🛠️ Build for Production

### Frontend Build
```bash
cd frontend
npm run build
# Output in: frontend/dist/
```

### Backend Deployment
```bash
cd backend
npm start
# Set NODE_ENV=production
```

## 📝 File Naming & Configuration

### Frontend Files
- Page files: `{Page}Page.jsx` (e.g., LandingPage.jsx)
- Component files: `{Component}.jsx`
- Style files: `{page/component}.css`
- Context files: `{Feature}Context.jsx`

### Backend Files
- Routes: `{Feature}.js`
- Controllers: `{Feature}Controller.js`
- Models: `{Feature}Model.js`
- Services: `{Service}Service.js`

### Environment File Naming
- Development: `.env.local`
- Production: `.env`
- Example: `.env.example`

## 🔑 Important Configuration Points

### QRIS Image
1. Place QRIS image at: `frontend/public/assets/qris-placeholder.png`
2. Update admin panel to upload/change QRIS
3. Image displayed on payment page when QRIS selected

### Telegram Bot Token
1. Create bot: [@BotFather](https://t.me/botfather)
2. Add to .env as `TELEGRAM_BOT_TOKEN`
3. Add bot to group chat
4. Get group ID and add as `TELEGRAM_CHAT_ID`

### Admin Numbers
1. Configure in `.env` or Admin Panel Settings
2. Format: International (e.g., +62812345678)
3. Used for WhatsApp and Telegram messages

### Bank Account
1. Set in `.env` or Admin Panel Settings
2. Displayed on payment page
3. Update anytime from admin panel

## 🚨 Troubleshooting

### CORS Issues
- Ensure frontend URL matches `REACT_APP_API_URL`
- Backend has CORS enabled for all origins

### Telegram Not Working
- Verify bot token is correct
- Check chat ID is valid
- Ensure bot has send message permissions

### Payment Not Verifying
- Admin PIN must be correct (FT001)
- Check admin panel access
- Verify payment status updating

### WhatsApp Links Not Opening
- Ensure phone numbers include country code
- Format: +{country_code}{number}

## 📦 Dependencies

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.0
- Framer Motion 10.16.0
- React Toastify 9.1.3
- React Icons 4.12.0
- Vite 5.0.0

### Backend
- Express 4.18.2
- CORS 2.8.5
- Dotenv 16.3.1
- Node Telegram Bot API 0.63.0
- UUID 9.0.1
- Nodemon (dev)

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review environment variables configuration
3. Check browser console for frontend errors
4. Check server logs for backend errors
5. Verify all dependencies are installed

## 📜 License

This project is created for Free Fire Clash Squad Tournament management.

---

**Version**: 1.0.0  
**Last Updated**: 2024
