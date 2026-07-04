const PaymentService = require('../services/paymentService');
const Booking = require('../models/BookingModel');

const PACKAGES_API_URL = process.env.PACKAGES_API_URL || 'http://localhost:5001/api';

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

class PaymentController {
  // Create order
  static async createOrder(req, res, next) {
    try {
      const { tourId, email, phone, fullName, customPrice, selections, basePrice } = req.body;

      if (!tourId || !email || !phone || !fullName) {
        return res.status(400).json({
          error: 'Missing required fields: tourId, email, phone, fullName'
        });
      }

      const result = await PaymentService.createOrder(
        tourId, email, phone, fullName, customPrice, selections, basePrice
      );

      res.json({ success: true, ...result });
    } catch (error) {
      console.error('[PAYMENT ERROR]', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // Verify payment
  static async verifyPayment(req, res, next) {
    try {
      const result = await PaymentService.verifyPayment(req.body);
      res.json(result);
    } catch (error) {
      console.error('[VERIFY ERROR]', error.message);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Get booking
  static async getBooking(req, res, next) {
    try {
      const { bookingId } = req.params;
      const booking = await Booking.findById(bookingId);
      if (!booking) throw new Error('Booking not found');
      res.json({ success: true, booking });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  // Get order history by email
  static async getMyBookings(req, res, next) {
    try {
      const { email } = req.params;
      if (!email) return res.status(400).json({ success: false, error: 'Email required' });

      const bookings = await PaymentService.getBookingsByEmail(email);
      res.json({ success: true, bookings });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Test booking — skips Razorpay entirely
  static async testBooking(req, res, next) {
    try {
      const {
        tourId, tourName, email, phone, fullName,
        basePrice, selections, totalAmount, advanceAmount
      } = req.body;

      if (!tourId || !email || !phone || !fullName || !totalAmount) {
        return res.status(400).json({
          error: 'Missing required fields: tourId, email, phone, fullName, totalAmount'
        });
      }

      const total = Number(totalAmount) || 0;
      const advance = Number(advanceAmount) || Math.floor(total * 0.1);
      const vendorEmail = await getVendorEmailForTour(tourId);

      const booking = await Booking.create({
        email, phone, fullName,
        tourId, tourName, vendorEmail,
        basePrice: Number(basePrice) || total,
        selections: selections || undefined,
        totalAmount: total,
        advanceAmount: advance,
        remainingAmount: total - advance,
        razorpayOrderId: `TEST_${Date.now()}`,
        razorpayPaymentId: `TEST_PAYMENT_${Date.now()}`,
        paymentStatus: 'completed',
        advancePaid: true,
      });

      res.json({ success: true, booking });
    } catch (error) {
      console.error('[TEST BOOKING ERROR]', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // Edit an existing booking's selections and recompute totals
  static async updateBooking(req, res, next) {
    try {
      const { bookingId } = req.params;
      const { email, selections, basePrice } = req.body;

      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

      // NOTE: This checks the request's email against the booking's email.
      // It is NOT real authentication — add a JWT/session check before production use.
      if (booking.email !== email) {
        return res.status(403).json({ success: false, error: 'Not authorized to edit this booking' });
      }

      const base     = basePrice != null ? Number(basePrice) : booking.basePrice;
      const travel   = selections?.travelClass   ? Number(selections.travelClass.price)   : 0;
      const dining   = selections?.dining         ? Number(selections.dining.price)         : 0;
      const transport = selections?.transport     ? Number(selections.transport.price)     : 0;
      // Sum all custom add-ons (supports both price and extraPrice field names)
      const extras   = Array.isArray(selections?.customOptions)
        ? selections.customOptions.reduce((sum, o) => sum + Number(o.extraPrice ?? o.price ?? 0), 0)
        : 0;

      const newTotal = base + travel + dining + transport + extras;
      const remaining = Math.max(newTotal - booking.advanceAmount, 0);

      booking.basePrice  = base;
      booking.selections = selections || undefined;
      booking.totalAmount = newTotal;
      booking.remainingAmount = remaining;
      
      // If there is now a remaining balance, change status back to pending
      if (remaining > 0) {
        booking.paymentStatus = 'pending';
      } else {
        booking.paymentStatus = 'completed';
      }

      await booking.save();
      res.json({ success: true, booking });
    } catch (error) {
      console.error('[UPDATE BOOKING ERROR]', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }


  // Pay the remaining balance on a booking
  static async payRemaining(req, res, next) {
    try {
      const { bookingId } = req.params;
      const { email, amount } = req.body;

      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

      if (booking.email !== email) {
        return res.status(403).json({ success: false, error: 'Not authorized' });
      }

      const pay = Number(amount) || booking.remainingAmount;
      booking.advanceAmount += pay;
      booking.remainingAmount = Math.max(booking.totalAmount - booking.advanceAmount, 0);
      if (booking.remainingAmount === 0) booking.paymentStatus = 'completed';

      await booking.save();
      res.json({ success: true, booking });
    } catch (error) {
      console.error('[PAY REMAINING ERROR]', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = PaymentController;