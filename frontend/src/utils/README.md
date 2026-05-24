# FAST TOUR - Frontend API Utilities

This directory contains utility functions for API communication and data handling.

## Available Utilities

### API Client

Example usage in components:
```javascript
import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

// Get admin info
axios.get(`${API_BASE_URL}/api/admin-info`)

// Create registration
axios.post(`${API_BASE_URL}/api/registrations`, {
  teamName: 'Team Name',
  playerCount: '4',
  fee: '5'
})

// Update payment status
axios.put(`${API_BASE_URL}/api/registrations/{id}/payment`, {
  status: 'verified'
})

// Send Telegram notification
axios.post(`${API_BASE_URL}/api/telegram/notify`, {
  teamName: 'Team Name',
  playerCount: '4',
  fee: '5',
  tournamentId: 'FT-001'
})

// Generate WhatsApp message
axios.post(`${API_BASE_URL}/api/whatsapp/message`, {
  teamName: 'Team Name',
  amount: '5',
  adminPhone: '+626285857322097'
})
```

### Storage

- Uses `localStorage` for persistent data
- Stores registrations, payment status, admin info
- Automatically syncs with context

### State Management

Global state managed via React Context (AppContext.jsx):
- registrations
- rules
- adminInfo
- paymentStatus
- Update functions

## Create Your Own Utility

Example template:
```javascript
// utils/yourUtil.js
export const yourFunction = (data) => {
  // Your logic here
  return result
}

export default {
  yourFunction
}
```

Then import in components:
```javascript
import { yourFunction } from '../utils/yourUtil'
```
