# RouteShare App

This repository contains a route-based ride-sharing and parcel delivery platform with a backend API and mobile app scaffold.

## Structure
- `backend/` - Node.js Express REST API
- `mobile/` - Expo React Native app scaffold
- `APP_SPECIFICATION.md` - app requirements and design document

## Backend Setup
1. `cd backend`
2. `npm install`
3. `npm run dev`

The backend runs on `http://localhost:4000` by default.

## Mobile Setup
1. `cd mobile`
2. `npm install`
3. `npm start`

Use Expo Go or emulator to run the mobile app.

## Notes
- The backend uses SQLite in `backend/data/app.db`
- Authentication is JWT-based
- Parcel workflow includes barcode/QR generation and scan status updates
