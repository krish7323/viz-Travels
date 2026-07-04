# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (React)                       │  │
│  │  ┌────────────────┐  ┌──────────────┐  ┌─────────────┐   │  │
│  │  │ BookingForm    │  │  UI Comp     │  │   Hooks     │   │  │
│  │  │ (4 steps)      │──│  (7 comps)   │──│  (2 hooks)  │   │  │
│  │  └────────────────┘  └──────────────┘  └─────────────┘   │  │
│  │         │                    │                  │         │  │
│  │         └────────────────────┼──────────────────┘         │  │
│  │                     ↓                                      │  │
│  │            ┌────────────────┐                             │  │
│  │            │ Zustand Store  │                             │  │
│  │            │  (State Mgmt)  │                             │  │
│  │            └────────────────┘                             │  │
│  │                     ↓                                      │  │
│  │            ┌────────────────┐                             │  │
│  │            │  axios API     │                             │  │
│  │            │   Client       │                             │  │
│  │            └────────────────┘                             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                │                                  │
│                   HTTP/HTTPS (JSON)                             │
│                                │                                  │
└────────────────────────────────┼──────────────────────────────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
         ┌──────▼────────┐            ┌──────────▼──────┐
         │   RAZORPAY    │            │     BACKEND     │
         │   PAYMENT     │            │   (Node.js)     │
         │   GATEWAY     │            │                 │
         └───────────────┘            └──────────────────┘
                │                            │
                │  Payment Request           │
                ├────────────────────────────┤
                │  Signature Verification    │
                ├────────────────────────────┤
                │  Response                  │
                │                            │
                └────────────────────────────┘
                         │
                         │
         ┌───────────────▼──────────────┐
         │      BACKEND ROUTES          │
         │  ┌────────────────────────┐  │
         │  │ /api/payment/create-   │  │
         │  │ order                  │  │
         │  └────────────────────────┘  │
         │  ┌────────────────────────┐  │
         │  │ /api/payment/verify    │  │
         │  └────────────────────────┘  │
         │                               │
         └───────────────┬───────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    ┌────────┐    ┌─────────────┐   ┌─────────┐
    │Payment │    │ Booking     │   │  Auth   │
    │Service │    │ Controller  │   │Service  │
    └────────┘    └─────────────┘   └─────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                    ┌────▼─────┐
                    │ Database  │
                    │ (MongoDB) │
                    │           │
                    │ ┌───────┐ │
                    │ │User   │ │
                    │ │Booking│ │
                    │ └───────┘ │
                    └───────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App.jsx
├── Navbar
├── ErrorBoundary
│   └── Routes
│       ├── Home
│       ├── Tour
│       ├── BookingForm
│       │   ├── StepIndicator
│       │   ├── Card
│       │   ├── Input
│       │   ├── Button
│       │   ├── Toast
│       │   └── LoadingOverlay
│       ├── Payment
│       └── Success

UI Components (Reusable)
├── Button
│   └── Framer Motion
├── Input
│   └── Validation
├── Card
│   └── Hover Effects
├── Toast
│   └── Notifications
├── Spinner
│   └── Loading
├── StepIndicator
│   └── Progress
└── LoadingOverlay
    └── Full Screen

State Management
├── bookingStore.js (Zustand)
│   ├── currentStep
│   ├── bookingData
│   ├── error
│   └── success

Custom Hooks
├── useBooking
│   ├── createOrder()
│   ├── verifyPayment()
│   └── isProcessing
└── useToast
    ├── success()
    ├── error()
    └── info()

Services
└── api.js (axios)
    ├── authService
    ├── paymentService
    └── healthCheck
```

### Data Flow

```
USER INTERACTION
       │
       ▼
   Component
       │
       ▼
   useBooking Hook
       │
       ▼
   API Service
       │
       ▼
   Backend
       │
       ▼
   Database
       │
       ▼
   Response
       │
       ▼
   Zustand Store
       │
       ▼
   Component Update
       │
       ▼
   UI Render
```

## Backend Architecture

### Request Flow

```
HTTP Request
    │
    ▼
Express Middleware
├── helmet() [Security Headers]
├── cors() [CORS Configuration]
├── express.json() [JSON Parsing]
└── Error Handler [Error Catching]
    │
    ▼
Routes
├── /api/payment/create-order
│   └── PaymentController.createOrder()
├── /api/payment/verify
│   └── PaymentController.verifyPayment()
└── /api/payment/booking/:id
    └── PaymentController.getBooking()
    │
    ▼
Service Layer
├── PaymentService.createOrder()
│   ├── Validate Input
│   ├── Find Tour
│   ├── Calculate Advance
│   └── Create Razorpay Order
├── PaymentService.verifyPayment()
│   ├── Verify Signature
│   ├── Create Booking
│   └── Return Success
└── PaymentService.getBooking()
    └── Find in Database
    │
    ▼
Database
├── User Collection
└── Booking Collection
    │
    ▼
Response (JSON)
```

### Layer Responsibilities

#### Routes Layer (`/routes/payment.js`)

- Define API endpoints
- Map HTTP methods to controllers
- Basic path handling

#### Controller Layer (`/controller/paymentController.js`)

- Parse request data
- Validate input format
- Call appropriate service
- Format response
- Handle errors

#### Service Layer (`/services/paymentService.js`)

- Implement business logic
- Interact with external APIs (Razorpay)
- Database operations
- Error handling

#### Model Layer (`/models/BookingModel.js`)

- Define database schema
- Validation rules
- Timestamps

## Technology Stack

### Frontend Stack

```
┌─────────────────────────────────┐
│      React 18+ (UI Library)     │
└──────────────────┬──────────────┘
                   │
        ┌──────────┴──────────┬──────────────┐
        │                     │              │
   ┌────▼────────┐  ┌────────▼───┐  ┌──────▼──┐
   │ Tailwind    │  │ Framer     │  │ Zustand │
   │ CSS         │  │ Motion     │  │ State   │
   └─────────────┘  └────────────┘  └─────────┘
        │                     │              │
        └──────────────────┬──┴──┬───────────┘
                           │    │
                      ┌────▼────▼───┐
                      │   Axios     │
                      │ HTTP Client │
                      └─────────────┘
```

### Backend Stack

```
┌─────────────────────────────────┐
│  Node.js (JavaScript Runtime)   │
└──────────────────┬──────────────┘
                   │
   ┌───────────────┼────────────────┬──────────────┐
   │               │                │              │
┌──▼──────┐ ┌─────▼────┐ ┌────────▼──┐ ┌──────────▼──┐
│Express  │ │ MongoDB  │ │ Razorpay  │ │  Helmet    │
│Framework│ │ Database │ │  Payment  │ │ Security   │
└─────────┘ └──────────┘ └───────────┘ └────────────┘
```

## Data Models

### User Schema

```javascript
{
  _id: ObjectId,
  contact: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Schema

```javascript
{
  _id: ObjectId,
  email: String,
  phone: String,
  fullName: String,
  tourId: Number,
  tourName: String,
  totalAmount: Number,
  advanceAmount: Number,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paymentStatus: 'pending' | 'completed' | 'failed',
  advancePaid: Boolean,
  bookingStatus: 'pending' | 'confirmed' | 'cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Configuration

### Backend .env Variables

```
PORT: Server port (default: 5000)
MONGODB_URI: Database connection string
JWT_SECRET: Secret for JWT tokens
VITE_RAZORPAY_KEY_ID: Razorpay public key
RAZORPAY_KEY_SECRET: Razorpay secret key
NODE_ENV: Environment type
FRONTEND_URL: Frontend origin for CORS
```

### Frontend .env Variables

```
VITE_API_URL: Backend API base URL
VITE_VITE_RAZORPAY_KEY_ID: Razorpay public key
```

## State Management Flow

### Zustand Store (bookingStore.js)

```
Current Step: 1 → 2 → 3 → 4
     │         │    │   │
     ├─────────────────┘
     │
Booking Data
├─ fullName
├─ email
├─ phone
├─ tourId
├─ totalAmount
├─ advanceAmount
└─ remainingAmount

UI State
├─ error (message)
├─ successMessage
├─ isLoading
├─ orderId
└─ paymentDetails
```

## Security Flow

### Payment Verification Process

```
1. Frontend sends payment details to backend
   ├─ razorpay_order_id
   ├─ razorpay_payment_id
   ├─ razorpay_signature
   └─ booking details

2. Backend verifies signature
   ├─ Create hash: order_id + "|" + payment_id
   ├─ Create HMAC with secret key
   ├─ Compare with signature from frontend
   └─ Return success/failure

3. Backend creates booking record
   ├─ Save to database
   ├─ Return booking confirmation
   └─ Frontend shows success

4. No secrets exposed
   ├─ Razorpay keys only in backend
   ├─ Frontend only has public key
   └─ Signature verified server-side
```

## Deployment Architecture

### Production Setup

```
┌──────────────────────────────────────┐
│      CloudFlare / CDN (Optional)     │
└──────────────────┬───────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼────────┐
│  Vercel/       │   │  Heroku/        │
│  Netlify       │   │  Railway        │
│  (Frontend)    │   │  (Backend)      │
└───────┬────────┘   └────────┬────────┘
        │                     │
        └──────────────┬──────┘
                       │
              HTTP/HTTPS
                       │
            ┌──────────┴──────────┐
            │                     │
      ┌─────▼─────┐        ┌──────▼──────┐
      │ Razorpay  │        │ MongoDB     │
      │ Gateway   │        │ Atlas       │
      └───────────┘        └─────────────┘
```

## Performance Optimization

### Frontend Optimizations

- Component code splitting (React.lazy)
- Image lazy loading
- CSS-in-JS optimization (Tailwind)
- State management prevents prop drilling
- Memoization with useMemo/useCallback

### Backend Optimizations

- Service layer reduces code duplication
- Controller caching responses
- Database indexing on frequently queried fields
- Connection pooling with MongoDB

## Error Handling Strategy

```
Frontend
├─ Input Validation
│  └─ Show inline errors
├─ API Errors
│  └─ Display toast notifications
├─ Component Errors
│  └─ Error Boundary catches crashes
└─ Payment Errors
   └─ Retry or fallback

Backend
├─ Request Validation
│  └─ Return 400 Bad Request
├─ Business Logic Errors
│  └─ Return 400/404 with message
├─ Server Errors
│  └─ Return 500 with generic message
└─ Database Errors
   └─ Log and return error response
```

## Scaling Considerations

### Current Architecture Supports

- Up to 1000s of concurrent users
- Horizontal scaling of backend instances
- Database sharding if needed
- CDN for static assets

### Future Scaling Options

- Implement caching layer (Redis)
- Add message queue (Bull/RabbitMQ)
- Implement rate limiting
- Add load balancing
- Database replication

---

This architecture is production-ready and designed for scalability, security, and maintainability.
