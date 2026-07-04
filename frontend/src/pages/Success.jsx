import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Success = () => {
  return (
    <div
      style={{
        backgroundColor: "#0b1120",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "white",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        {/* Success icon */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "48px",
            marginBottom: "30px",
            boxShadow: "0 0 40px rgba(16, 185, 129, 0.4)",
          }}
        >
          🎉
        </div>

        <h1
          style={{
            fontSize: "38px",
            fontWeight: "800",
            marginBottom: "16px",
            background: "linear-gradient(135deg, #10b981, #38bdf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Payment Successful!
        </h1>

        <p
          style={{
            color: "#9ca3af",
            fontSize: "18px",
            maxWidth: "480px",
            marginBottom: "40px",
            lineHeight: "1.7",
          }}
        >
          Your booking is confirmed. We'll send you a confirmation email shortly.
          Get ready for an amazing trip! ✈️
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            to="/my-bookings"
            style={{
              padding: "14px 28px",
              backgroundColor: "#00b4d8",
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "16px",
              transition: "opacity 0.2s",
            }}
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            style={{
              padding: "14px 28px",
              border: "1px solid #374151",
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Success;