import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PACKAGES_URL = import.meta.env.VITE_PACKAGES_API_URL || 'http://localhost:5001/api';

// Auth API
export const authAPI = {
  signup: (data) => axios.post(`${API_URL}/auth/signup`, data),
};

// Payment API
export const paymentAPI = {
  createOrder: (data) => axios.post(`${API_URL}/payment/create-order`, data),
  verifyPayment: (data) => axios.post(`${API_URL}/payment/verify`, data),
  testBooking: (data) => axios.post(`${API_URL}/payment/test-booking`, data),
  getBooking: (bookingId) => axios.get(`${API_URL}/payment/booking/${bookingId}`),
  getMyBookings: (email) => axios.get(`${API_URL}/payment/my-bookings/${encodeURIComponent(email)}`),
  updateBooking: (bookingId, data) => axios.patch(`${API_URL}/payment/booking/${bookingId}`, data),
  payRemaining: (bookingId, data) => axios.post(`${API_URL}/payment/booking/${bookingId}/pay-remaining`, data),
};

// Packages API (server on port 5001)
export const packagesAPI = {
  getAll: () => axios.get(`${PACKAGES_URL}/packages`),
  getById: (id) => axios.get(`${PACKAGES_URL}/packages/${id}`),
};

export default { API_URL, PACKAGES_URL };
