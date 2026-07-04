import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const PACKAGES_URL = import.meta.env.VITE_PACKAGES_API_URL || "http://localhost:5001/api";

function OptionCard({ label, price, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 16px",
        borderRadius: "12px",
        cursor: "pointer",
        border: isSelected ? "2px solid #00b4d8" : "1px solid #374151",
        backgroundColor: isSelected ? "rgba(0,180,216,0.12)" : "#111827",
        color: "white",
        minWidth: "150px",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "14px" }}>{label}</div>
      <div style={{ fontSize: "12px", color: "#9ca3af" }}>
        + ₹{Number(price).toLocaleString("en-IN")}
      </div>
    </div>
  );
}

const btnPrimary = {
  padding: "10px 18px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#00b4d8",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};
const btnOutline = {
  padding: "10px 18px",
  borderRadius: "10px",
  border: "1px solid #374151",
  backgroundColor: "transparent",
  color: "white",
  cursor: "pointer",
};

function BookingCard({ booking, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [tourOptions, setTourOptions] = useState(null);
  const [selections, setSelections] = useState(booking.selections || {});
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const openEditor = async () => {
    setEditing(true);
    setError("");
    if (!tourOptions) {
      try {
        const res = await axios.get(`${PACKAGES_URL}/packages/${booking.tourId}`);
        setTourOptions(res.data);
      } catch {
        setError("Could not load customization options for this trip.");
      }
    }
  };

  const toggle = (category, item) => {
    if (category === "customOptions") {
      setSelections((prev) => {
        const list = prev.customOptions || [];
        const exists = list.find((o) => o.title === item.title);
        return {
          ...prev,
          customOptions: exists
            ? list.filter((o) => o.title !== item.title)
            : [...list, item],
        };
      });
    } else {
      setSelections((prev) => ({
        ...prev,
        [category]: prev[category]?.title === item.title ? null : item,
      }));
    }
  };

  const extrasCost = Array.isArray(selections.customOptions)
    ? selections.customOptions.reduce((sum, o) => sum + Number(o.extraPrice ?? o.price ?? 0), 0)
    : 0;

  const newTotal =
    Number(booking.basePrice || 0) +
    (selections.travelClass ? Number(selections.travelClass.price) : 0) +
    (selections.dining ? Number(selections.dining.price) : 0) +
    (selections.transport ? Number(selections.transport.price) : 0) +
    extrasCost;

  const saveChanges = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await axios.patch(`${API_URL}/payment/booking/${booking._id}`, {
        email: booking.email,
        selections,
        basePrice: booking.basePrice,
      });
      onUpdated(res.data.booking);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const payRemaining = async () => {
    setPaying(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/payment/booking/${booking._id}/pay-remaining`, {
        email: booking.email,
        amount: booking.remainingAmount,
      });
      onUpdated(res.data.booking);
    } catch (err) {
      setError(err.response?.data?.error || "Payment failed.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "18px" }}>{booking.tourName || "Custom Trip"}</h3>
          <p style={{ color: "#6b7280", fontSize: "13px", margin: "4px 0" }}>
            Booked on {new Date(booking.createdAt).toLocaleDateString("en-IN")}
          </p>
          {booking.vendorEmail && (
            <p style={{ color: "#60a5fa", fontSize: "13px", margin: "2px 0" }}>
              🏪 Sold by: {booking.vendorEmail}
            </p>
          )}
        </div>
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: booking.paymentStatus === "completed" ? "#064e3b" : "#7f1d1d",
            color: booking.paymentStatus === "completed" ? "#34d399" : "#fca5a5",
          }}
        >
          {booking.paymentStatus}
        </span>
      </div>

      {booking.selections && !editing && (
        <div style={{ marginTop: "12px", color: "#9ca3af", fontSize: "14px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {booking.selections.travelClass && <span>✈️ {booking.selections.travelClass.title}</span>}
          {booking.selections.dining && <span>🍽️ {booking.selections.dining.title}</span>}
          {booking.selections.transport && <span>🚗 {booking.selections.transport.title}</span>}
          {booking.selections.customOptions?.map((o, i) => (
            <span key={i}>⭐ {o.title}</span>
          ))}
        </div>
      )}


      <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", borderTop: "1px solid #1f2937", paddingTop: "12px" }}>
        <span style={{ color: "#9ca3af" }}>Paid so far: ₹{booking.advanceAmount}</span>
        <span style={{ fontWeight: 700 }}>Total: ₹{booking.totalAmount}</span>
      </div>

      {booking.remainingAmount > 0 && (
        <div style={{ marginTop: "8px", color: "#fbbf24", fontSize: "13px" }}>
          Remaining balance: ₹{booking.remainingAmount}
        </div>
      )}

      {error && <p style={{ color: "#f87171", fontSize: "13px", marginTop: "8px" }}>{error}</p>}

      <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {!editing && (
          <button onClick={openEditor} style={btnOutline}>
            Edit selections
          </button>
        )}
        {booking.remainingAmount > 0 && (
          <button onClick={payRemaining} disabled={paying} style={btnPrimary}>
            {paying ? "Processing..." : `Pay remaining ₹${booking.remainingAmount}`}
          </button>
        )}
      </div>

      {editing && (
        <div style={{ marginTop: "18px", borderTop: "1px solid #1f2937", paddingTop: "16px" }}>
          {!tourOptions ? (
            <p style={{ color: "#9ca3af" }}>Loading options...</p>
          ) : (
            <>
              {["travelClass", "dining", "transport", "customOptions"].map(
                (cat) =>
                  tourOptions[cat]?.length > 0 && (
                    <div key={cat} style={{ marginBottom: "16px" }}>
                      <h4 style={{ color: "white", fontSize: "14px", marginBottom: "8px", textTransform: "capitalize" }}>
                        {cat === "customOptions" ? "Add-on Extras" : cat}
                      </h4>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {tourOptions[cat].map((opt, i) => (
                          <OptionCard
                            key={i}
                            label={opt.title}
                            price={opt.price ?? opt.extraPrice}
                            isSelected={
                              cat === "customOptions"
                                ? selections.customOptions?.some((o) => o.title === opt.title)
                                : selections[cat]?.title === opt.title
                            }
                            onClick={() => toggle(cat, opt)}
                          />
                        ))}
                      </div>
                    </div>
                  )
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", flexWrap: "wrap", gap: "10px" }}>
                <span style={{ color: "white", fontWeight: 700 }}>
                  New total: ₹{newTotal.toLocaleString("en-IN")}
                </span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setEditing(false)} style={btnOutline}>
                    Cancel
                  </button>
                  <button onClick={saveChanges} disabled={saving} style={btnPrimary}>
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) {
      setError("Please log in to see your bookings.");
      setLoading(false);
      return;
    }
    axios
      .get(`${API_URL}/payment/my-bookings/${encodeURIComponent(user.email)}`)
      .then((res) => setBookings(res.data.bookings || []))
      .catch(() => setError("Could not load your bookings."))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdated = (updated) => {
    setBookings((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
  };

  return (
    <div style={{ backgroundColor: "#0b1120", minHeight: "100vh", color: "white" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 20px 60px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "30px" }}>My Bookings</h1>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "#f87171" }}>{error}</p>}
        {!loading && !error && bookings.length === 0 && (
          <p style={{ color: "#9ca3af" }}>No bookings yet.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {bookings.map((b) => (
            <BookingCard key={b._id} booking={b} onUpdated={handleUpdated} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}