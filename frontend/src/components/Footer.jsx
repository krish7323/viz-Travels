import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#0f172a",
        color: "#fff",
        padding: "60px 20px",
        marginTop: "50px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "30px",
        }}
      >
        {/* Column 1 */}
        <div>
          <h2 style={{ fontSize: "20px", marginBottom: "15px" }}>
            TravelEase
          </h2>
          <p style={textStyle}>
            Explore the world with ease. We design unforgettable travel
            experiences with comfort, safety, and joy.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 style={headingStyle}>Quick Links</h3>

          <div style={columnStyle}>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/tour" style={linkStyle}>Tours</Link>
            <Link to="/about" style={linkStyle}>About</Link>
            <Link to="/contact" style={linkStyle}>Contact</Link>
          </div>
        </div>

        {/* Column 3 - SOCIAL */}
        <div>
          <h3 style={headingStyle}>Follow Us</h3>

          <div style={columnStyle}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={socialStyle}>
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={socialStyle}>
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={socialStyle}>
              Twitter / X
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" style={socialStyle}>
              YouTube
            </a>
          </div>
        </div>

        {/* Column 4 */}
        <div>
          <h3 style={headingStyle}>Contact</h3>
          <p style={textStyle}>📍 Haryana, India</p>
          <p style={textStyle}>📞 +91 98765 43210</p>
          <p style={textStyle}>✉️ support@travelease.com</p>
        </div>
      </div>

      {/* Bottom */}
      <div style={bottomStyle}>
        © {new Date().getFullYear()} TravelEase. All rights reserved.
      </div>
    </footer>
  );
};

/* ---------- STYLES ---------- */

const headingStyle = {
  fontSize: "16px",
  marginBottom: "15px",
};

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const textStyle = {
  color: "#cbd5e1",
  fontSize: "14px",
  lineHeight: "1.6",
};

const linkStyle = {
  color: "#cbd5e1",
  fontSize: "14px",
  textDecoration: "none",
};

const socialStyle = {
  color: "#cbd5e1",
  fontSize: "14px",
  textDecoration: "none",
};

const bottomStyle = {
  marginTop: "40px",
  borderTop: "1px solid #1e293b",
  paddingTop: "20px",
  textAlign: "center",
  color: "#94a3b8",
  fontSize: "13px",
};

export default Footer;