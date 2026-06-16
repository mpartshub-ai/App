# RouteShare App

A route-based ride-sharing and parcel delivery platform with a backend API and mobile app.

## 🎯 What is RouteShare?

- 🚗 **Ride-sharing** for pre-planned trips
- 📦 **Parcel delivery** system with QR/barcode tracking
- 🗺️ **Real-time GPS tracking** for drivers and parcels
- 🔐 **JWT Authentication** for secure access
- 📱 **React Native mobile app** with Expo
- 🔌 **Node.js Express REST API** backend

---

## 📁 Project Structure

```
App/
├── backend/              # Express REST API (Port 4000)
├── mobile/               # React Native + Expo app
├── APP_SPECIFICATION.md  # Full requirements & design
└── README_FULL.md        # Detailed documentation
```

---

## 🚀 Quick Start

### **1. Start Backend**
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:4000`

**Test it:** `http://localhost:4000/api/health`

### **2. Start Mobile App**
```bash
cd mobile
npm install
npm start
```

### **3. Connect on Your Phone**
- Download **Expo Go** app
- Open Expo Go
- Enter URL manually: `exp://[tunnel-url].exp.direct`
- App opens on your phone! 📱

---

## ✅ Available API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/health` | Server health check |
| `/api/auth` | Login & Registration |
| `/api/drivers` | Driver management |
| `/api/passengers` | Passenger management |
| `/api/parcels` | Parcel delivery |
| `/api/tracking` | Real-time tracking |

---

## 📚 Documentation

- **[APP_SPECIFICATION.md](./APP_SPECIFICATION.md)** - Full feature specs
- **[README_FULL.md](./README_FULL.md)** - Detailed setup guide

---

## 🛠️ Tech Stack

**Backend:**
- Express.js
- SQLite3
- JWT Authentication
- CORS enabled

**Mobile:**
- React Native
- Expo
- Navigation Stack

**Database:** SQLite (`backend/data/app.db`)

---

## 📋 Notes

- Authentication is JWT-based
- Parcel workflow includes barcode/QR generation and scan status updates
- Real-time GPS tracking for drivers and parcels
- Mobile app includes login and location capture
- Backend API is fully functional and ready for testing

---

## 🧪 Testing

1. **Backend health check:**
   ```bash
   curl http://localhost:4000/api/health
   ```

2. **Mobile app preview:**
   - Scan QR code in Expo Go, OR
   - Enter tunnel URL manually

3. **API endpoints:**
   - Test each endpoint in Postman or browser

---

## 🎉 Status

- ✅ Backend API running
- ✅ Mobile app scaffold ready
- ✅ Database initialized
- ✅ Authentication system ready
- 📱 Ready for Expo Go testing
