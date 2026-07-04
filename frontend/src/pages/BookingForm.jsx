import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ── Tiny styled helpers ── */
const styles = {
  wrap: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0b1120 0%, #0f172a 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 16px',
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: '520px',
    background: 'linear-gradient(145deg, #0f172a, #1a2540)',
    border: '1px solid #1f2937',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  header: {
    background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
    padding: '24px 28px',
  },
  body: {
    padding: '28px',
  },
  label: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '6px',
  },
  value: {
    fontSize: '15px',
    color: '#e5e7eb',
    fontWeight: 600,
  },
  divider: {
    height: '1px',
    background: '#1f2937',
    margin: '20px 0',
  },
  phoneInput: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1.5px solid #1f2937',
    background: '#0b1120',
    color: '#fff',
    fontSize: '15px',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '16px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 800,
    cursor: 'pointer',
    marginTop: '20px',
    boxShadow: '0 8px 24px rgba(14,165,233,0.3)',
    transition: 'opacity 0.2s',
  },
  errMsg: {
    color: '#f87171',
    fontSize: '13px',
    marginTop: '6px',
  },
  rowBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
  },
};

/* ── Step progress bar ── */
function StepBar({ step }) {
  const steps = ['Review', 'Phone', 'Pay', 'Done'];
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', width: '100%', maxWidth: '520px' }}>
      {steps.map((label, i) => {
        const num = i + 1;
        const active = step >= num;
        const current = step === num;
        return (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: '4px',
              borderRadius: '4px',
              background: active ? '#0ea5e9' : '#1f2937',
              marginBottom: '6px',
              transition: 'background 0.3s',
            }} />
            <span style={{
              fontSize: '11px',
              fontWeight: current ? 700 : 500,
              color: active ? '#0ea5e9' : '#4b5563',
            }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Row for price breakdown ── */
function PriceRow({ label, amount, highlight }) {
  return (
    <div style={styles.rowBetween}>
      <span style={{ fontSize: '13px', color: highlight ? '#e5e7eb' : '#9ca3af', fontWeight: highlight ? 700 : 400 }}>
        {label}
      </span>
      <span style={{ fontSize: highlight ? '16px' : '13px', color: highlight ? '#fff' : '#d1d5db', fontWeight: highlight ? 800 : 500 }}>
        ₹{Number(amount).toLocaleString('en-IN')}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export const BookingForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookingData, setBookingData, currentStep, setCurrentStep } = useBookingStore();

  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const tripDetails = state?.customTripDetails;

  /* ── On mount: pull logged-in user from localStorage + set booking data ── */
  useEffect(() => {
    // Reset to step 1 every time this page opens fresh
    setCurrentStep(1);

    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (tripDetails) {
      setBookingData({
        tourId:        tripDetails.tourId,
        tourName:      tripDetails.tourTitle,
        basePrice:     tripDetails.basePrice,
        selections:    tripDetails.selections,
        totalAmount:   tripDetails.totalPaid,
        advanceAmount: Math.floor(tripDetails.totalPaid * 0.1),
        // Auto-fill from logged-in user — no need to type again
        fullName: user?.name  || user?.fullName || '',
        email:    user?.email || '',
        phone:    user?.phone || '',
      });

      // If user already has phone saved, pre-fill the phone input
      if (user?.phone) setPhone(user.phone);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Validate phone ── */
  const validatePhone = () => {
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  /* ── Go to payment after phone confirmed ── */
  const handlePhoneNext = () => {
    if (!validatePhone()) return;
    setBookingData({ ...bookingData, phone: phone.replace(/\D/g, '') });
    setCurrentStep(3);
  };

  /* ── Submit booking ── */
  const handlePayment = async () => {
    setLoading(true);
    setBookingError('');
    try {
      const res = await fetch(`${API_URL}/payment/test-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId:        bookingData.tourId,
          tourName:      bookingData.tourName,
          email:         bookingData.email,
          phone:         bookingData.phone || phone,
          fullName:      bookingData.fullName,
          basePrice:     bookingData.basePrice,
          selections:    bookingData.selections,
          totalAmount:   bookingData.totalAmount,
          advanceAmount: bookingData.advanceAmount,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCurrentStep(4);
      } else {
        setBookingError(data.error || 'Booking failed. Please try again.');
      }
    } catch (err) {
      setBookingError(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Guard: if somehow no user is logged in ── */
  const loggedUser = JSON.parse(localStorage.getItem('user') || 'null');
  if (!loggedUser) {
    return (
      <div style={styles.wrap}>
        <div style={{ ...styles.card, textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ color: '#fff', marginBottom: '12px' }}>Please Log In First</h2>
          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>You need to be logged in to book a trip.</p>
          <button style={styles.btn} onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  const advancePct = bookingData.totalAmount
    ? Math.round((bookingData.advanceAmount / bookingData.totalAmount) * 100)
    : 10;

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div style={styles.wrap}>

      <StepBar step={currentStep} />

      <div style={styles.card}>

        {/* ── STEP 1: Review booking ── */}
        {currentStep === 1 && (
          <>
            <div style={styles.header}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Step 1 of 3 · Review</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Your Trip Summary</div>
            </div>

            <div style={styles.body}>
              {/* Booked as */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                background: '#111827', borderRadius: '14px',
                padding: '14px 18px', marginBottom: '22px',
                border: '1px solid #1f2937',
              }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: 800, color: '#fff', flexShrink: 0,
                }}>
                  {(bookingData.fullName || loggedUser.name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                    {bookingData.fullName || loggedUser.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{bookingData.email || loggedUser.email}</div>
                </div>
                <div style={{
                  marginLeft: 'auto', fontSize: '11px', color: '#10b981',
                  background: 'rgba(16,185,129,0.12)', borderRadius: '20px',
                  padding: '3px 10px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 700,
                }}>
                  ✓ Logged in
                </div>
              </div>

              {/* Tour name */}
              <div style={{ marginBottom: '16px' }}>
                <div style={styles.label}>Package</div>
                <div style={styles.value}>{bookingData.tourName || '—'}</div>
              </div>

              {/* Selections */}
              {bookingData.selections && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={styles.label}>Your Selections</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                    {bookingData.selections.travelClass && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#93c5fd', fontSize: '13px' }}>✈️ {bookingData.selections.travelClass.title}</span>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>+₹{Number(bookingData.selections.travelClass.price || 0).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {bookingData.selections.dining && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#fcd34d', fontSize: '13px' }}>🍽️ {bookingData.selections.dining.title}</span>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>+₹{Number(bookingData.selections.dining.price || 0).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {bookingData.selections.transport && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6ee7b7', fontSize: '13px' }}>🚗 {bookingData.selections.transport.title}</span>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>+₹{Number(bookingData.selections.transport.price || 0).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {bookingData.selections.customOptions?.map((o, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#c4b5fd', fontSize: '13px' }}>⭐ {o.title}</span>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>+₹{Number(o.extraPrice ?? o.price ?? 0).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={styles.divider} />

              {/* Price breakdown */}
              <PriceRow label="Base Price" amount={bookingData.basePrice || 0} />
              <PriceRow label="Add-ons" amount={
                (bookingData.totalAmount || 0) - (bookingData.basePrice || 0)
              } />
              <div style={{ height: '8px' }} />
              <PriceRow label="Total Package Price" amount={bookingData.totalAmount || 0} highlight />

              <div style={styles.divider} />

              {/* Advance info */}
              <div style={{
                background: 'rgba(16,185,129,0.08)', borderRadius: '12px',
                padding: '14px 16px', border: '1px solid rgba(16,185,129,0.2)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Advance to pay now ({advancePct}%)</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981' }}>
                      ₹{Number(bookingData.advanceAmount || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Remaining later</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#9ca3af' }}>
                      ₹{Number((bookingData.totalAmount || 0) - (bookingData.advanceAmount || 0)).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              <button
                style={styles.btn}
                onClick={() => setCurrentStep(2)}
              >
                Continue to Book →
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: Phone number only ── */}
        {currentStep === 2 && (
          <>
            <div style={styles.header}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Step 2 of 3 · Contact</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Just your phone number</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                We'll use your account details automatically
              </div>
            </div>

            <div style={styles.body}>
              {/* Show pre-filled account info (read-only) */}
              <div style={{
                background: '#111827', borderRadius: '14px',
                padding: '16px 18px', marginBottom: '24px',
                border: '1px solid #1f2937',
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <div style={styles.label}>Name</div>
                  <div style={styles.value}>{bookingData.fullName || loggedUser.name}</div>
                </div>
                <div>
                  <div style={styles.label}>Email</div>
                  <div style={styles.value}>{bookingData.email || loggedUser.email}</div>
                </div>
              </div>

              {/* Phone input */}
              <div>
                <div style={styles.label}>Phone Number *</div>
                <input
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={phone}
                  maxLength={15}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError('');
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#0ea5e9'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#1f2937'; }}
                  style={styles.phoneInput}
                />
                {phoneError && <div style={styles.errMsg}>{phoneError}</div>}
              </div>

              <button
                style={styles.btn}
                onClick={handlePhoneNext}
              >
                Confirm & Pay →
              </button>

              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  width: '100%', marginTop: '10px', padding: '10px',
                  background: 'transparent', border: '1px solid #1f2937',
                  color: '#6b7280', borderRadius: '10px', cursor: 'pointer',
                  fontSize: '14px', fontFamily: "'Poppins', sans-serif",
                }}
              >
                ← Back
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Pay ── */}
        {currentStep === 3 && (
          <>
            <div style={styles.header}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Step 3 of 3 · Payment</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Complete Your Booking</div>
            </div>

            <div style={styles.body}>
              {/* Summary recap */}
              <div style={{ marginBottom: '20px' }}>
                <div style={styles.label}>Booking For</div>
                <div style={styles.value}>{bookingData.tourName}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={styles.label}>Passenger</div>
                <div style={styles.value}>{bookingData.fullName}</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                  {bookingData.email} · {bookingData.phone}
                </div>
              </div>

              <div style={styles.divider} />

              <PriceRow label="Total Package" amount={bookingData.totalAmount || 0} />
              <PriceRow label={`Advance (${advancePct}%) — Pay now`} amount={bookingData.advanceAmount || 0} highlight />

              {bookingError && (
                <div style={{
                  marginTop: '16px', padding: '12px 16px',
                  background: 'rgba(239,68,68,0.1)', borderRadius: '10px',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171', fontSize: '13px',
                }}>
                  ⚠️ {bookingError}
                </div>
              )}

              <button
                style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? '⏳ Processing...' : `Pay ₹${Number(bookingData.advanceAmount || 0).toLocaleString('en-IN')} Now`}
              </button>

              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  width: '100%', marginTop: '10px', padding: '10px',
                  background: 'transparent', border: '1px solid #1f2937',
                  color: '#6b7280', borderRadius: '10px', cursor: 'pointer',
                  fontSize: '14px', fontFamily: "'Poppins', sans-serif",
                }}
              >
                ← Back
              </button>

              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '12px', color: '#4b5563' }}>
                🔒 Secure payment · Remaining ₹{Number((bookingData.totalAmount || 0) - (bookingData.advanceAmount || 0)).toLocaleString('en-IN')} payable later
              </div>
            </div>
          </>
        )}

        {/* ── STEP 4: Confirmed ── */}
        {currentStep === 4 && (
          <>
            <div style={{
              background: 'linear-gradient(135deg, #065f46, #047857)',
              padding: '32px 28px', textAlign: 'center',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', margin: '0 auto 14px',
              }}>🎉</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>Booking Confirmed!</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '6px' }}>
                We'll send details to {bookingData.email}
              </div>
            </div>

            <div style={styles.body}>
              <div style={{ marginBottom: '16px' }}>
                <div style={styles.label}>Package</div>
                <div style={styles.value}>{bookingData.tourName}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={styles.label}>Booked by</div>
                <div style={styles.value}>{bookingData.fullName}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{bookingData.email} · {bookingData.phone}</div>
              </div>

              {bookingData.selections && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={styles.label}>Selections</div>
                  <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {bookingData.selections.travelClass && <span style={{ color: '#93c5fd', fontSize: '13px' }}>✈️ {bookingData.selections.travelClass.title}</span>}
                    {bookingData.selections.dining && <span style={{ color: '#fcd34d', fontSize: '13px' }}>🍽️ {bookingData.selections.dining.title}</span>}
                    {bookingData.selections.transport && <span style={{ color: '#6ee7b7', fontSize: '13px' }}>🚗 {bookingData.selections.transport.title}</span>}
                    {bookingData.selections.customOptions?.map((o, i) => (
                      <span key={i} style={{ color: '#c4b5fd', fontSize: '13px' }}>⭐ {o.title}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={styles.divider} />

              <div style={styles.rowBetween}>
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>Advance Paid</span>
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: '16px' }}>₹{Number(bookingData.advanceAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={styles.rowBetween}>
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>Total Package</span>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px' }}>₹{Number(bookingData.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  style={{ ...styles.btn, marginTop: 0, flex: 1 }}
                  onClick={() => navigate('/my-bookings')}
                >
                  My Bookings
                </button>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    flex: 1, padding: '16px', borderRadius: '14px',
                    border: '1px solid #1f2937', background: 'transparent',
                    color: '#9ca3af', fontSize: '15px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Home
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};