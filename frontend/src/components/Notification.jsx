import React, { useState } from "react";

const Notification = () => {
  const [open, setOpen] = useState(false);

  const notifications = [
    "🔥 Goa trip 20% OFF today only!",
    "✈️ Your Dubai booking is confirmed",
    "🏔️ New Manali packages added",
    "💰 Early bird offer on Bali tour",
    "🌍 New destinations launched!"
  ];

  return (
    <div style={{ position: "relative" }}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontSize: "20px",
          background: "transparent",
          border: "none",
          cursor: "pointer"
        }}
      >
        🔔
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            width: "280px",
            background: "#fff",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            borderRadius: "12px",
            padding: "10px",
            zIndex: 1000
          }}
        >
          <h4 style={{ margin: "10px" }}>Notifications</h4>

          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            {notifications.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  fontSize: "14px"
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <button
            onClick={() => setOpen(false)}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "8px",
              border: "none",
              background: "#0f172a",
              color: "#fff",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;