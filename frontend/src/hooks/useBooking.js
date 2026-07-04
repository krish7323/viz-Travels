import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useBooking = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrder = async (tourId, email, phone, fullName, totalAmount, basePrice, selections) => {
    setIsProcessing(true);
    try {
      const res = await axios.post(`${API_URL}/payment/create-order`, {
        tourId,
        email,
        phone,
        fullName,
        customPrice: totalAmount,
        basePrice,
        selections,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (paymentData) => {
    setIsProcessing(true);
    try {
      const res = await axios.post(`${API_URL}/payment/verify`, paymentData);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Payment verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return { createOrder, verifyPayment, isProcessing };
};