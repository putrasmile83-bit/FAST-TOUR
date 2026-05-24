# FAST TOUR - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Health Check
```
GET /health
Response: { status: "Server is running", timestamp: "2024-..." }
```

### 2. Get Admin Information
```
GET /admin-info
Response:
{
  "phone1": "085857322097",
  "phone2": "088972337396",
  "bankName": "Bank Name",
  "bankAccount": "1234567890",
  "qrisCode": "qris_code"
}
```

### 3. Register Team
```
POST /registrations
Body:
{
  "teamName": "Team Name",
  "playerCount": "4",
  "fee": "5",
  "registrationId": 1234567890
}

Response:
{
  "message": "Registration submitted successfully",
  "registration": {
    "id": 1234567890,
    "teamName": "Team Name",
    "playerCount": "4",
    "fee": "5",
    "status": "pending",
    "paymentStatus": "pending",
    "createdAt": "2024-..."
  }
}
```

### 4. Get All Registrations
```
GET /registrations
Response: Array of registration objects
```

### 5. Get Registration by ID
```
GET /registrations/:id
Response: Single registration object
```

### 6. Update Payment Status
```
PUT /registrations/:id/payment
Body:
{
  "status": "verified",
  "proofImage": "image_url_optional"
}

Response:
{
  "message": "Payment status updated",
  "registration": { ... }
}
```

### 7. Send Telegram Notification
```
POST /telegram/notify
Body:
{
  "teamName": "Team Name",
  "playerCount": "4",
  "fee": "5",
  "tournamentId": "FT-001"
}

Response:
{
  "message": "Telegram notification sent"
}
```

### 8. Generate WhatsApp Message
```
POST /whatsapp/message
Body:
{
  "teamName": "Team Name",
  "amount": "5",
  "adminPhone": "+6285857322097"
}

Response:
{
  "message": "Hello Admin, I have completed the payment...",
  "whatsappUrl": "https://wa.me/62812345678?text=..."
}
```

### 9. Update Admin Information
```
POST /admin/update-info
Headers:
{
  "x-admin-pin": "FT001"
}

Body:
{
  "adminPin": "FT001",
  "phone1": "+62812345678",
  "phone2": "+62887654321",
  "bankName": "Bank Name",
  "bankAccount": "1234567890"
}

Response:
{
  "message": "Admin info updated",
  "admins": { ... }
}
```

### 10. Get Payment Statistics
```
GET /stats/payments
Response:
{
  "totalRegistrations": 10,
  "verifiedPayments": 7,
  "pendingPayments": 3,
  "totalFeesCollected": "35K",
  "totalPlayers": 35
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 403 | Forbidden (Invalid PIN) |
| 404 | Not Found |
| 500 | Server Error |

## Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

## Authentication

Some endpoints require admin PIN:
- Header: `x-admin-pin: FT001`
- Body: `"adminPin": "FT001"`

## Rate Limiting

Currently no rate limiting. Add in production:
```javascript
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)
```

## CORS Configuration

Currently allows all origins. Update in production:
```javascript
const cors = require('cors')
app.use(cors({
  origin: 'https://yourdomain.com'
}))
```

## Data Persistence

Current implementation uses in-memory storage. For production, replace with:
- MongoDB
- PostgreSQL
- Firebase Firestore
- MySQL

---

**Last Updated**: 2024
