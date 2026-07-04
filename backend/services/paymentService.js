require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/BookingModel');

// Fixed: Use RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET (no VITE_ prefix — that's frontend only)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PACKAGES_API_URL = process.env.PACKAGES_API_URL || 'http://localhost:5001/api';

const tours = [
  { id: 1, name: "Paris Tour", price: 27000 },
  { id: 2, name: "London Tour", price: 15000 },
  { id: 3, name: "Tokyo Tour", price: 32000 },
];

const Package = require('../models/PackageModel');

async function getVendorEmailForTour(tourId) {
  try {
    const pkg = await Package.findById(tourId);
    return pkg?.vendorEmail || null;
  } catch (err) {
    console.error('[VENDOR LOOKUP FAILED]', err.message);
    return null;
  }
}

class PaymentService {
  static async createOrder(tourId, email, phone, fullName, customPrice = null, selections = null, basePrice = null) {
    try {
      let tourDetails;
      const staticTour = tours.find(t => t.id === Number(tourId));

      if (staticTour) {
        tourDetails = {
          id: staticTour.id,
          name: staticTour.name,
          totalAmount: staticTour.price,
          advanceAmount: Math.floor(staticTour.price * 0.1)
        };
      } else if (customPrice) {
        tourDetails = {
          id: tourId,
          name: "Custom Trip Package",
          totalAmount: Number(customPrice),
          advanceAmount: Math.floor(Number(customPrice) * 0.1)
        };
      } else {
        throw new Error('Tour not found and no custom price provided');
      }

      const options = {
        amount: tourDetails.advanceAmount * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: { tourId: tourId.toString(), email, phone, fullName }
      };

      const order = await razorpay.orders.create(options);

      return {
        order: { id: order.id, amount: order.amount, currency: order.currency },
        tourDetails: {
          ...tourDetails,
          basePrice: basePrice ?? tourDetails.totalAmount,
          selections: selections || null,
          remainingAmount: tourDetails.totalAmount - tourDetails.advanceAmount
        }
      };
    } catch (error) {
      throw new Error(`Order creation failed: ${error.message}`);
    }
  }

  static async verifyPayment(paymentData) {
    try {
      const {
        razorpay_order_id, razorpay_payment_id, razorpay_signature,
        email, phone, fullName, tourId, tourName,
        totalAmount, advanceAmount, basePrice, selections
      } = paymentData;

      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) throw new Error('Invalid signature');

      const total = Number(totalAmount) || 0;
      const advance = Number(advanceAmount) || 0;
      const vendorEmail = await getVendorEmailForTour(tourId);

      const booking = await Booking.create({
        email, phone, fullName,
        tourId, tourName, vendorEmail,
        basePrice: Number(basePrice) || total,
        selections: selections || undefined,
        totalAmount: total,
        advanceAmount: advance,
        remainingAmount: total - advance,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: 'completed',
        advancePaid: true,
      });

      return { success: true, booking };
    } catch (error) {
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }

  static async getBookingsByEmail(email) {
    return Booking.find({ email }).sort({ createdAt: -1 });
  }
}

module.exports = PaymentService;