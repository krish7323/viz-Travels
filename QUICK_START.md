# Quick Start Guide

Get your tour booking system running in 5 minutes!

## Prerequisites

- Node.js (v14 or higher)
- MongoDB running locally or connection string
- Razorpay account for payment integration

## Step 1: Razorpay Setup (2 minutes)

1. Go to https://dashboard.razorpay.com
2. Sign up or login
3. Navigate to **Settings → API Keys**
4. Copy your **Key ID** and **Key Secret**

## Step 2: Backend Setup (2 minutes)

```bash
cd backend

# Create .env file with your values
echo 'PORT=5000
MONGODB_URI=mongodb://localhost:27017/tour-booking
JWT_SECRET=your_secure_key_here
VITE_RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
NODE_ENV=development
FRONTEND_URL=http://localhost:5173' > .env

# Start the server
npm start
```

**Server runs on**: http://localhost:5000

## Step 3: Frontend Setup (1 minute)

```bash
cd frontend

# Create .env file
echo 'VITE_API_URL=http://localhost:5000/api
VITE_VITE_RAZORPAY_KEY_ID=your_key_id_here' > .env

# Start development server
npm run dev
```

**App runs on**: http://localhost:5173

## Step 4: Test the Payment Flow

1. Open http://localhost:5173 in your browser
2. Select a tour from the form
3. Fill in your details:
   - Name: John Doe
   - Email: test@example.com
   - Phone: 9876543210
4. Click "Proceed to Payment"
5. Use Razorpay test card:
   - **Card Number**: 4111 1111 1111 1111
   - **Expiry**: 12/25
   - **CVV**: 123
6. Complete payment and see success page

## What's New in This Update

### Backend

- Service-controller architecture for maintainability
- Secure environment variable configuration
- Improved error handling middleware
- Payment signature verification
- Booking record creation

### Frontend

- Multi-step booking form with validation
- Zustand state management
- Reusable UI components with Framer Motion animations
- Tailwind CSS styling
- Toast notifications
- Error boundaries

## API Endpoints

```
POST /api/payment/create-order
- Body: { tourId, email, phone, fullName }
- Response: { success, order, tourDetails }

POST /api/payment/verify
- Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, ... }
- Response: { success, booking }
```

## Troubleshooting

| Issue                       | Solution                               |
| --------------------------- | -------------------------------------- |
| "Cannot find module"        | Run `npm install` in the folder        |
| "MongoDB connection failed" | Start MongoDB or update MONGODB_URI    |
| "Razorpay key not found"    | Check .env file and restart server     |
| "CORS error"                | Ensure backend and frontend URLs match |
| "Payment won't open"        | Check that Razorpay Key ID is correct  |

## Next Steps

1. **Customize Tours**: Update tour data in `backend/services/paymentService.js`
2. **Add Database**: Migrate tours from hardcoded to MongoDB
3. **Email Notifications**: Configure email service in `backend/utils/sendOtp.js`
4. **User Authentication**: Add JWT-based authentication
5. **Deploy**: Follow deployment guide in SETUP_GUIDE.md

## File Structure Summary

```
project/
├── backend/
│   ├── .env                    (you create this)
│   ├── server.js
│   ├── routes/payment.js
│   ├── controller/paymentController.js
│   ├── services/paymentService.js
│   └── models/BookingModel.js
└── frontend/
    ├── .env                    (you create this)
    ├── src/
    │   ├── components/BookingForm.jsx
    │   ├── hooks/useBooking.js
    │   ├── store/bookingStore.js
    │   └── services/api.js
    └── tailwind.config.js
```

## Key Features

- **Responsive Design**: Works on mobile and desktop
- **Real-time Validation**: Instant feedback on form errors
- **Smooth Animations**: Framer Motion for polished UX
- **Secure Payments**: Razorpay signature verification
- **State Management**: Zustand for predictable state
- **Error Handling**: Global error boundary component
- **Toast Notifications**: User-friendly feedback system

## Support

- Documentation: See SETUP_GUIDE.md for detailed setup
- Checklist: See IMPLEMENTATION_CHECKLIST.md for completed features
- Issues: Check console for error messages

---

**Ready to deploy?** See SETUP_GUIDE.md for production deployment instructions.
