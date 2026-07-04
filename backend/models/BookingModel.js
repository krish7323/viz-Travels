const mongoose = require("mongoose");

// Single item schema (used for travelClass, dining, transport)
const selectionSchema = new mongoose.Schema(
  {
    title: { type: String },
    price: { type: Number },
  },
  { _id: false }
);

// Multi-item schema (used for customOptions / add-on extras)
const customOptionSchema = new mongoose.Schema(
  {
    title: { type: String },
    price: { type: Number },
    extraPrice: { type: Number }, // vendor may use either field name
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    tourId: { type: String, required: true },
    tourName: { type: String },
    vendorEmail: { type: String }, // which vendor this booking belongs to

    basePrice: { type: Number, default: 0 },

    // Selections from TripCustomizer
    selections: {
      travelClass:   selectionSchema,
      dining:        selectionSchema,
      transport:     selectionSchema,
      customOptions: { type: [customOptionSchema], default: [] }, // NEW: add-on extras (multi-select)
    },

    totalAmount:     { type: Number, required: true },
    advanceAmount:   { type: Number, required: true },
    remainingAmount: { type: Number, required: true },

    razorpayOrderId:  { type: String, required: true },
    razorpayPaymentId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    advancePaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookingSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema, "travel_bookings");