import React, { useState, useEffect } from "react";
import { useBookingStore } from '../store/bookingStore';
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   SECTION ICONS & CONFIG
───────────────────────────────────────────── */
const SECTIONS = [
  { key: "travelClass",   label: "Travel Class",       emoji: "✈️",  color: "#3b82f6", light: "rgba(59,130,246,0.12)",  single: true  },
  { key: "dining",        label: "Dining",              emoji: "🍽️",  color: "#f59e0b", light: "rgba(245,158,11,0.12)",  single: true  },
  { key: "transport",     label: "Transport",           emoji: "🚗",  color: "#10b981", light: "rgba(16,185,129,0.12)",  single: true  },
  { key: "customOptions", label: "Add-on Extras",      emoji: "⭐",  color: "#a855f7", light: "rgba(168,85,247,0.12)",  single: false },
];

/* ─────────────────────────────────────────────
   SINGLE OPTION CARD
   single=true  → radio style  (select one per group, click again to deselect)
   single=false → checkbox style (multi-select)
───────────────────────────────────────────── */
function OptionCard({ label, price, isSelected, onClick, color, light, priceKey = "price" }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        padding: "14px 16px",
        borderRadius: "14px",
        cursor: "pointer",
        transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
        border: isSelected ? `2px solid ${color}` : "1.5px solid #1f2937",
        backgroundColor: isSelected ? light : "#0f1829",
        userSelect: "none",
        boxShadow: isSelected ? `0 0 18px ${color}30` : "none",
        transform: isSelected ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Selected checkmark badge */}
      {isSelected && (
        <div style={{
          position: "absolute", top: "-8px", right: "-8px",
          width: "22px", height: "22px", borderRadius: "50%",
          backgroundColor: color, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "12px", fontWeight: "bold", color: "#fff",
          boxShadow: `0 2px 8px ${color}60`,
        }}>
          ✓
        </div>
      )}

      <div style={{ fontWeight: 700, fontSize: "14px", color: isSelected ? "#fff" : "#d1d5db", marginBottom: "5px" }}>
        {label}
      </div>

      <div style={{
        fontSize: "13px",
        fontWeight: 600,
        color: isSelected ? color : "#6b7280",
      }}>
        {Number(price) === 0 ? "Included" : `+ ₹${Number(price).toLocaleString("en-IN")}`}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRICE BREAKDOWN ROW
───────────────────────────────────────────── */
function BreakdownRow({ label, amount, color = "#9ca3af", bold = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
      <span style={{ fontSize: "13px", color: bold ? "#e5e7eb" : "#9ca3af", fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ fontSize: bold ? "15px" : "13px", color: bold ? "#fff" : color, fontWeight: bold ? 800 : 500 }}>
        ₹{Number(amount).toLocaleString("en-IN")}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function TripCustomizer({ tour }) {
  const { setBookingData } = useBookingStore();
  const navigate = useNavigate();

  // selections: { travelClass: obj|null, dining: obj|null, transport: obj|null, customOptions: [obj,...] }
  const [selections, setSelections] = useState({
    travelClass: null,
    dining: null,
    transport: null,
    customOptions: [],
  });

  // Reset when tour changes
  useEffect(() => {
    setSelections({ travelClass: null, dining: null, transport: null, customOptions: [] });
  }, [tour?._id]);

  if (!tour || !tour.price) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
        Loading customization options...
      </div>
    );
  }

  /* ── Price computation ── */
  const basePrice = typeof tour.price === "string"
    ? Number(tour.price.replace(/[^0-9.]/g, ""))
    : Number(tour.price || 0);

  const travelCost    = selections.travelClass ? Number(selections.travelClass.price || 0) : 0;
  const diningCost    = selections.dining       ? Number(selections.dining.price || 0)       : 0;
  const transportCost = selections.transport    ? Number(selections.transport.price || 0)    : 0;
  const extrasCost    = selections.customOptions.reduce((sum, o) => sum + Number(o.extraPrice || o.price || 0), 0);
  const estimatedTotal = basePrice + travelCost + diningCost + transportCost + extrasCost;
  const addedAmount    = travelCost + diningCost + transportCost + extrasCost;

  /* ── Handlers ── */
  // Single-select (toggle): click same item → deselect
  const handleSingleSelect = (category, item) => {
    setSelections(prev => ({
      ...prev,
      [category]: prev[category]?.title === item.title ? null : item,
    }));
  };

  // Multi-select: toggle in/out of array
  const handleMultiSelect = (item) => {
    setSelections(prev => {
      const exists = prev.customOptions.find(o => o.title === item.title);
      return {
        ...prev,
        customOptions: exists
          ? prev.customOptions.filter(o => o.title !== item.title)
          : [...prev.customOptions, item],
      };
    });
  };

  // Check if a custom option is selected
  const isCustomSelected = (item) => selections.customOptions.some(o => o.title === item.title);

  /* ── Confirm Booking ── */
  const handleConfirmBooking = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please Login/Register first to book your trip.");
      navigate("/login");
      return;
    }
    navigate("/bookingform", {
      state: {
        customTripDetails: {
          tourId:    tour._id,
          tourTitle: tour.title,
          basePrice,
          selections,
          totalPaid: estimatedTotal,
        },
      },
    });
  };

  /* ── Build section data ── */
  const sectionData = {
    travelClass:   tour.travelClass   || [],
    dining:        tour.dining        || [],
    transport:     tour.transport     || [],
    customOptions: tour.customOptions || [],
  };

  const hasAnyOptions = SECTIONS.some(s => sectionData[s.key]?.length > 0);

  /* ── RENDER ── */
  return (
    <div style={{
      background: "linear-gradient(145deg, #0b1120, #0f172a)",
      borderRadius: "24px",
      border: "1px solid #1f2937",
      overflow: "hidden",
      fontFamily: "'Poppins', sans-serif",
    }}>

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
        padding: "20px 24px",
      }}>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", marginBottom: "4px", fontWeight: 500 }}>
          Customize Your Trip
        </div>
        <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>
          {tour.title}
        </div>
        <div style={{
          marginTop: "10px",
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(255,255,255,0.15)", borderRadius: "20px",
          padding: "5px 14px", backdropFilter: "blur(8px)"
        }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)" }}>Base Price</span>
          <span style={{ fontSize: "15px", fontWeight: 800, color: "#fff" }}>
            ₹{basePrice.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>

        {/* ── NO OPTIONS MESSAGE ── */}
        {!hasAnyOptions && (
          <div style={{
            textAlign: "center", padding: "30px 20px",
            color: "#6b7280", fontSize: "14px",
            background: "#111827", borderRadius: "16px",
            border: "1px dashed #1f2937", marginBottom: "20px",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>📦</div>
            <div style={{ fontWeight: 600, color: "#9ca3af" }}>No add-ons available for this package yet.</div>
            <div style={{ fontSize: "12px", marginTop: "6px" }}>The vendor hasn't added options. You can still book!</div>
          </div>
        )}

        {/* ── SECTIONS ── */}
        {SECTIONS.map((section) => {
          const options = sectionData[section.key];
          if (!options || options.length === 0) return null;

          return (
            <div key={section.key} style={{ marginBottom: "22px" }}>
              {/* Section header */}
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                marginBottom: "12px",
              }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  backgroundColor: section.light,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", border: `1px solid ${section.color}40`,
                }}>
                  {section.emoji}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#e5e7eb" }}>
                    {section.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>
                    {section.single ? "Select one (click again to remove)" : "Select any number of add-ons"}
                  </div>
                </div>
                {/* Selected badge */}
                {section.single
                  ? selections[section.key] && (
                    <div style={{
                      marginLeft: "auto", fontSize: "11px", fontWeight: 700,
                      color: section.color, background: section.light,
                      borderRadius: "20px", padding: "2px 10px", border: `1px solid ${section.color}40`
                    }}>
                      1 selected
                    </div>
                  )
                  : selections.customOptions.length > 0 && (
                    <div style={{
                      marginLeft: "auto", fontSize: "11px", fontWeight: 700,
                      color: section.color, background: section.light,
                      borderRadius: "20px", padding: "2px 10px", border: `1px solid ${section.color}40`
                    }}>
                      {selections.customOptions.length} selected
                    </div>
                  )
                }
              </div>

              {/* Option cards grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))",
                gap: "10px",
              }}>
                {options.map((opt, i) => {
                  const price = opt.price ?? opt.extraPrice ?? 0;
                  const isSelected = section.single
                    ? selections[section.key]?.title === opt.title
                    : isCustomSelected(opt);

                  return (
                    <OptionCard
                      key={i}
                      label={opt.title}
                      price={price}
                      isSelected={isSelected}
                      color={section.color}
                      light={section.light}
                      onClick={() =>
                        section.single
                          ? handleSingleSelect(section.key, opt)
                          : handleMultiSelect(opt)
                      }
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ── DIVIDER ── */}
        <div style={{ height: "1px", background: "#1f2937", margin: "4px 0 18px" }} />

        {/* ── PRICE BREAKDOWN ── */}
        <div style={{
          background: "#111827", borderRadius: "16px",
          padding: "16px 18px", marginBottom: "16px",
          border: "1px solid #1f2937",
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
            Price Breakdown
          </div>

          <BreakdownRow label="Base Price" amount={basePrice} />

          {selections.travelClass && (
            <BreakdownRow
              label={`✈️ ${selections.travelClass.title}`}
              amount={travelCost}
              color="#3b82f6"
            />
          )}
          {selections.dining && (
            <BreakdownRow
              label={`🍽️ ${selections.dining.title}`}
              amount={diningCost}
              color="#f59e0b"
            />
          )}
          {selections.transport && (
            <BreakdownRow
              label={`🚗 ${selections.transport.title}`}
              amount={transportCost}
              color="#10b981"
            />
          )}
          {selections.customOptions.map((o, i) => (
            <BreakdownRow
              key={i}
              label={`⭐ ${o.title}`}
              amount={o.extraPrice ?? o.price ?? 0}
              color="#a855f7"
            />
          ))}

          {/* Divider before total */}
          <div style={{ height: "1px", background: "#1f2937", margin: "10px 0" }} />

          {/* Added so far */}
          {addedAmount > 0 && (
            <BreakdownRow label="Add-ons Total" amount={addedAmount} color="#60a5fa" />
          )}

          <BreakdownRow label="Estimated Total" amount={estimatedTotal} bold />
        </div>

        {/* ── TOTAL + CONFIRM BUTTON ── */}
        <div style={{
          background: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
          borderRadius: "16px",
          padding: "18px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 8px 24px rgba(14,165,233,0.3)",
        }}>
          <div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
              Total (incl. all add-ons)
            </div>
            <div style={{ fontSize: "26px", fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>
              ₹{estimatedTotal.toLocaleString("en-IN")}
            </div>
            {addedAmount > 0 && (
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>
                +₹{addedAmount.toLocaleString("en-IN")} add-ons
              </div>
            )}
          </div>

          <button
            onClick={handleConfirmBooking}
            style={{
              background: "rgba(255,255,255,0.18)",
              color: "#fff",
              padding: "13px 22px",
              borderRadius: "14px",
              border: "2px solid rgba(255,255,255,0.35)",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: "15px",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
          >
            Confirm Plan ›
          </button>
        </div>

        {/* ── 10% ADVANCE NOTE ── */}
        <div style={{
          textAlign: "center", marginTop: "12px",
          fontSize: "12px", color: "#6b7280",
        }}>
          🔒 Only <strong style={{ color: "#10b981" }}>10% advance</strong> needed to book • Pay rest later
        </div>

      </div>
    </div>
  );
}