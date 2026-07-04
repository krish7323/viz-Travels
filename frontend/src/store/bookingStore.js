import { create }from 'zustand';

export const useBookingStore = create((set) => ({
  // State
  currentStep: 1,
  bookingData: {
  fullName: '',
  email: '',
  phone: '',
  tourId: null,
  tourName: '',
  basePrice: 0,
  selections: null,
  totalAmount: 0,
  advanceAmount: 0,
  remainingAmount: 0,
  numberOfPeople: 1,
  travelDate: '',
  specialRequests: '',
},
  isLoading: false,
  error: null,
  successMessage: null,
  orderId: null,
  paymentDetails: null,

  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setBookingData: (data) => set((state) => ({
    bookingData: { ...state.bookingData, ...data },
  })),

  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setSuccessMessage: (message) => set({ successMessage: message }),

  setOrderId: (orderId) => set({ orderId }),

  setPaymentDetails: (details) => set({ paymentDetails: details }),

  resetBooking: () => set({
    currentStep: 1,
    bookingData: {
  fullName: '',
  email: '',
  phone: '',
  tourId: null,
  tourName: '',
  basePrice: 0,
  selections: null,
  totalAmount: 0,
  advanceAmount: 0,
  remainingAmount: 0,
  numberOfPeople: 1,
  travelDate: '',
  specialRequests: '',
},
    isLoading: false,
    error: null,
    successMessage: null,
    orderId: null,
    paymentDetails: null,
  }),

  clearError: () => set({ error: null }),
  clearSuccess: () => set({ successMessage: null }),
}));