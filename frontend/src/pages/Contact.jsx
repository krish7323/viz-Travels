import React, { useState } from "react";
import "../styles/contact.css";
import Footer from "../components/Footer";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendWhatsApp = () => {
    const { name, email, phone, subject, message } = form;

    const text = `Hello VizTravels 👋

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}`;

    // Fixed: Correct WhatsApp wa.me URL format (country code + 10 digit number)
    window.open(
      `https://wa.me/916284961698?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div className="fl-contact-app">
      <div className="contact-page">
        {/* Fixed: Only one <h1> per page (SEO best practice) */}
        <h1>Let's Plan Your Trip ✈️</h1>
        <p>Tell us your dream destination — we'll handle the rest.</p>
        <p style={{ color: "#00b4d8", marginTop: "8px", fontSize: "15px" }}>
          Contact us for custom package deals too.
        </p>

        <div className="contact-card">

          {/* LEFT: FORM SECTION */}
          <div className="form-section">
            <div className="row">
              <input name="name" placeholder="Full Name" onChange={handleChange} />
              <input name="email" placeholder="Email" onChange={handleChange} />
            </div>

            <div className="row">
              <input name="phone" placeholder="Phone" onChange={handleChange} />
              <input name="subject" placeholder="Subject" onChange={handleChange} />
            </div>

            <textarea
              name="message"
              placeholder="Tell us about your trip..."
              rows="5"
              onChange={handleChange}
            />

            <button onClick={sendWhatsApp}>
              🚀 Send on WhatsApp
            </button>
          </div>

          {/* RIGHT: INFO SECTION */}
          <div className="info-section">
            <div className="overlay">
              <h2>Travel With Us 🌍</h2>
              <p>Best deals • Easy booking • 24/7 support</p>

              <div className="info">
                <p>📞 +91 62849616984</p>
                <p>📧 admin@viztravels.com</p>
                <p>📍 Haryana, India</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}