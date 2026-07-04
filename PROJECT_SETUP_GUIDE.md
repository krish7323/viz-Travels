# Tour Website - Complete Project Setup Guide

## 📋 Project Overview

This is a comprehensive tour booking system with multiple components:

- **Home**: Landing page and tour showcase (React + Vite)
- **Server**: Main backend for tours and vendors (Node.js + Express + MongoDB)
- **Backend**: Booking and payment processing backend (Node.js + Express + Razorpay)
- **Frontend**: Tour booking interface (React + Vite + Tailwind)
- **Admin Panel**: Database administration interface (React + Node.js)

## 🏗️ Architecture

```
TourWebsite-main/
├── Home/              # Landing page (Port 5174)
├── server/            # Tours & Vendors API (Port 5001)
├── backend/           # Booking & Payments API (Port 5000)
├── frontend/          # Booking Frontend (Port 5173)
├── admin-panel/       # Admin Interface
│   ├── server/        # Admin Backend (Port 5002)
│   └── client/        # Admin Frontend (Port 5175)
└── START_ALL.bat      # Start all servers at once
```

## 🚀 Quick Start

### Option 1: Start All Servers (Recommended)

Double-click `START_ALL.bat` to start all servers simultaneously.

### Option 2: Start Individual Servers

#### 1. Home (Landing Page)
```bash
cd Home
npm run dev
# Access: http://localhost:5174
```

#### 2. Server (Tours & Vendors)
```bash
cd server
npm start
# Access: http://localhost:5001
```

#### 3. Backend (Booking & Payments)
```bash
cd backend
npm start
# Access: http://localhost:5000
```

#### 4. Frontend (Booking Interface)
```bash
cd frontend
npm run dev
# Access: http://localhost:5173
```

#### 5. Admin Panel
```bash
# Terminal 1 - Admin Server
cd admin-panel/server
npm start
# Access: http://localhost:5002

# Terminal 2 - Admin Client
cd admin-panel/client
npm run dev
# Access: http://localhost:5175
```

## 🔐 Configuration

### Environment Variables

All `.env` files are already configured with MongoDB connection strings and API keys.

#### Server (.env)
```
PORT=5001
MONGO_URI=mongodb+srv://...
```

#### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

#### Admin Panel (.env)
```
PORT=5002
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@1234
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

#### Home (.env)
```
VITE_API_URL=http://localhost:5001/api
```

#### Admin Client (.env)
```
VITE_API_URL=http://localhost:5002/api
```

## 📡 API Endpoints

### Server (Port 5001)
- `POST /api/auth/register` - Vendor registration
- `POST /api/auth/login` - Vendor login
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get single package
- `POST /api/packages` - Create package
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

### Backend (Port 5000)
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/booking/:id` - Get booking details
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP

### Admin Panel (Port 5002)
- `POST /api/auth/login` - Admin login
- `GET /api/databases` - List databases
- `GET /api/collections/:dbName` - List collections
- `GET /api/data/:db/:col` - Get documents
- `POST /api/data/:db/:col` - Create document
- `PUT /api/data/:db/:col/:id` - Update document
- `DELETE /api/data/:db/:col/:id` - Delete document

## 🔧 Troubleshooting

### Port Already in Use
If you get "port already in use" error:
1. Run `STOP_ALL.bat` to stop all servers
2. Or manually kill the process using the port

### MongoDB Connection Issues
- Check your internet connection
- Verify MongoDB URI in `.env` files
- Ensure MongoDB Atlas is accessible

### Dependency Issues
```bash
# Install dependencies for all components
cd Home && npm install
cd server && npm install
cd backend && npm install
cd frontend && npm install
cd admin-panel/server && npm install
cd admin-panel/client && npm install
```

### Build Errors
- Clear node_modules and reinstall:
```bash
rd /s /q node_modules
npm install
```

## 🎯 Access Points

| Component | URL | Purpose |
|-----------|-----|---------|
| Home | http://localhost:5174 | Landing page & tour showcase |
| Frontend | http://localhost:5173 | Booking interface |
| Admin Panel (Server) | http://localhost:5002 | Admin interface (built-in) |
| Admin Panel (Client) | http://localhost:5175 | Admin interface (React) |
| Server API | http://localhost:5001 | Tours & vendors API |
| Backend API | http://localhost:5000 | Booking & payments API |

## 🔑 Default Credentials

### Admin Panel
- Username: `admin`
- Password: `Admin@1234`

### Razorpay Test Mode
- Card: `4111 1111 1111 1111`
- Expiry: `12/25`
- CVV: `123`

## 📝 Notes

1. **MongoDB**: All components share the same MongoDB Atlas database
2. **Ports**: Each component uses a different port to avoid conflicts
3. **CORS**: All backends are configured to allow requests from localhost
4. **Payments**: Razorpay is configured in test mode

## 🛠️ Development

### Adding New Features
1. Identify which component needs changes
2. Make changes in the appropriate directory
3. Restart the affected server
4. Test the changes

### Database Schema
- **Vendors**: Tour operators/service providers
- **Packages**: Tour packages with details, pricing, images
- **Bookings**: Tour bookings with payment info

## 📞 Support

For issues or questions:
1. Check the console logs for error messages
2. Verify all servers are running
3. Check environment variables
4. Ensure MongoDB is accessible

---

**Last Updated**: 2026-07-03  
**Status**: ✅ All components configured and ready to run