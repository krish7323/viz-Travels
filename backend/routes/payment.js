const express = require("express");
const router = express.Router();
const PaymentController = require("../controller/paymentController");

router.post('/create-order', PaymentController.createOrder);
router.post("/verify", PaymentController.verifyPayment);
router.get("/booking/:bookingId", PaymentController.getBooking);
router.get("/my-bookings/:email", PaymentController.getMyBookings);
router.post("/test-booking", PaymentController.testBooking);
router.patch("/booking/:bookingId", PaymentController.updateBooking);       // NEW
router.post("/booking/:bookingId/pay-remaining", PaymentController.payRemaining); // NEW

module.exports = router;