import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import AdvancedSearchBar from '../components/AdvancedSearchBar';
import travelImg from "../assets/pic.png";
import "../styles/home.css";
import toursData from "../data/toursData";

// Use env variable for packages API URL
const PACKAGES_URL = import.meta.env.VITE_PACKAGES_API_URL || 'http://localhost:5001/api';

export default function Home() {
  // 1. All state variables properly initialized
  const [activeTab, setActiveTab] = useState("Tour");
  const [toursList, setToursList] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchToursAndHotels = async () => {
      try {
        // Ask the backend for the packages (Trying the standard route first)
        const response = await axios.get(`${PACKAGES_URL}/packages`);
        console.log("BACKEND DATA:", response.data);

        const formattedItems = response.data.map(item => ({
          id: item._id,
          title: item.title,
          price: `₹${item.price}`,
          location: item.location,
          category: item.category || "Tour", // Fallback if empty
          img: item.images && item.images.length > 0 ? item.images[0] : "https://via.placeholder.com/300"
        }));

        // Filter case-insensitive
        setToursList(formattedItems.filter(item => item.category.toLowerCase().includes("tour")));
        setHotelsList(formattedItems.filter(item =>
          item.category.toLowerCase().includes("hotel") ||
          item.category.toLowerCase().includes("stay")
        ));

      } catch (error) {
        console.error("Standard fetch failed, trying fallback /all...", error);

        // FALLBACK: If the standard route fails, try the /all route
        try {
          const backupResponse = await axios.get(`${PACKAGES_URL}/packages/all`);
          const formattedItems = backupResponse.data.map(item => ({
            id: item._id,
            title: item.title,
            price: `₹${item.price}`,
            location: item.location,
            category: item.category || "Tour",
            img: item.images && item.images.length > 0 ? item.images[0] : "https://via.placeholder.com/300"
          }));

          setToursList(formattedItems.filter(item => item.category.toLowerCase().includes("tour")));
          setHotelsList(formattedItems.filter(item => item.category.toLowerCase().includes("hotel") || item.category.toLowerCase().includes("stay")));
        } catch (backupErr) {
          console.error("Could not fetch packages from any URL.", backupErr);
        }
      }
    };

    fetchToursAndHotels();
  }, []);

  // 2. The return statement correctly placed inside the Home function
  return (
    <div className="fl-home-app">
      <section className="fl-home-hero">
        <div className="fl-home-hero-text">
          <p className="fl-home-hero-tag">Curated Travel Experiences</p>

          <h1>
            Travel Simplified.  <br />
            <span>Memories Amplified.</span>
          </h1>

          <p className="fl-home-hero-subtext">
            Handpicked destinations, seamless booking, and unforgettable
            journeys.
          </p>

          <div className="fl-home-hero-actions">
            <Link to="/tour" className="btn primary home-btn">
              Explore Trips
            </Link>

            <Link to="/contact" className="btn secondary home-btn">
              Customized Package
            </Link>
          </div>
        </div>

        <div className="fl-home-hero-image-style">
          <img src={travelImg} alt="travel" />
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "70px", marginBottom: "30px" }}>
        <button
          onClick={() => setActiveTab("Tour")}
          style={{
            padding: "12px 30px", fontSize: "18px", fontWeight: "bold", borderRadius: "30px", cursor: "pointer", transition: "all 0.3s",
            backgroundColor: activeTab === "Tour" ? "#00b4d8" : "transparent",
            color: activeTab === "Tour" ? "white" : "#aaa",
            border: activeTab === "Tour" ? "none" : "2px solid #333",
            boxShadow: activeTab === "Tour" ? "0 4px 15px rgba(0, 180, 216, 0.4)" : "none"
          }}
        >
          🎒 Top Tours
        </button>

        <button
          onClick={() => setActiveTab("Hotel")}
          style={{
            padding: "12px 30px", fontSize: "18px", fontWeight: "bold", borderRadius: "30px", cursor: "pointer", transition: "all 0.3s",
            backgroundColor: activeTab === "Hotel" ? "#10b981" : "transparent",
            color: activeTab === "Hotel" ? "white" : "#aaa",
            border: activeTab === "Hotel" ? "none" : "2px solid #333",
            boxShadow: activeTab === "Hotel" ? "0 4px 15px rgba(16, 185, 129, 0.4)" : "none"
          }}
        >
          🏨 Featured Hotels
        </button>

      </div>



      {/* SEARCH SECTION */}
      <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
        <AdvancedSearchBar tours={toursList} hotels={hotelsList} />
      </div>


      {/* DYNAMIC GRID */}
      <section className="fl-home-section" style={{ maxWidth: "1200px", margin: "0 auto 50px", padding: "0 20px" }}>
        {activeTab === "Tour" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
            {toursList.length > 0 ? toursList.slice(0, 6).map((tour) => (
              <div
                key={`tour-${tour.id}`}
                onClick={() => navigate(`/tour/${tour.id}`)}
                style={{ cursor: "pointer", textAlign: "left", backgroundColor: "#111827", borderRadius: "16px", paddingBottom: "15px", overflow: "hidden", border: "1px solid #374151", transition: "transform 0.3s, box-shadow 0.3s", display: "flex", flexDirection: "column", height: "100%" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <img src={tour.img} alt={tour.location} style={{ width: "100%", height: "220px", objectFit: "cover", borderBottom: "3px solid #00b4d8" }} />
                <div style={{ padding: "15px 20px 5px" }}>
                  <h4 style={{ margin: "0", color: "white", fontSize: "1.2rem", display: "-webkit-box", WebkitLineClamp: "1", WebkitBoxOrient: "vertical", overflow: "hidden" }}>{tour.title}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                    <p style={{ color: "#00b4d8", fontSize: "14px", margin: 0, textTransform: "capitalize" }}>📍 {tour.location}</p>
                    <p style={{ color: "white", fontWeight: "bold", fontSize: "1.1rem", margin: 0 }}>{tour.price}</p>
                  </div>
                </div>
              </div>
            )) : <p style={{ color: "gray", textAlign: "center", width: "100%" }}>No tours available right now.</p>}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
            {hotelsList.length > 0 ? hotelsList.slice(0, 6).map((hotel) => (
              <div
                key={`hotel-${hotel.id}`}
                onClick={() => navigate(`/tour/${hotel.id}`)}
                style={{ cursor: "pointer", textAlign: "left", backgroundColor: "#111827", borderRadius: "16px", paddingBottom: "15px", overflow: "hidden", border: "1px solid #374151", transition: "transform 0.3s, box-shadow 0.3s", display: "flex", flexDirection: "column", height: "100%" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <img src={hotel.img} alt={hotel.location} style={{ width: "100%", height: "220px", objectFit: "cover", borderBottom: "3px solid #10b981" }} />
                <div style={{ padding: "15px 20px 5px" }}>
                  <h4 style={{ margin: "0", color: "white", fontSize: "1.2rem", display: "-webkit-box", WebkitLineClamp: "1", WebkitBoxOrient: "vertical", overflow: "hidden" }}>{hotel.title}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                    <p style={{ color: "#10b981", fontSize: "14px", margin: 0, textTransform: "capitalize" }}>📍 {hotel.location}</p>
                    <p style={{ color: "white", fontWeight: "bold", fontSize: "1.1rem", margin: 0 }}>{hotel.price}</p>
                  </div>
                </div>
              </div>
            )) : <p style={{ color: "gray", textAlign: "center", width: "100%" }}>No hotels available right now.</p>}
          </div>
        )}
      </section>
      <section className="fl-home-section">
        <h2>Popular Now</h2>

        <div className="fl-home-grid">
          {toursData.map((tour) => (
            <Link
              key={tour.id}
              to={`/tour/${tour.id}`}
              className="fl-home-card"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              {tour.location}
            </Link>
          ))}
        </div>
      </section>
      <section className="fl-home-section">
        <h2>Top Destinations</h2>

        <div className="fl-home-grid">
          {toursData.slice(0, 6).map((tour) => (
            <div
              key={tour.id}
              className="fl-home-dest"
              onClick={() => navigate(`/tour/${tour.id}`)}
              style={{
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <img
                src={tour.img}
                alt={tour.location}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />

              <h4 style={{ marginTop: "10px" }}>{tour.location}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="fl-home-section fl-home-grid" style={{ marginTop: "60px", borderTop: "1px solid #1b263b", paddingTop: "40px" }}>
        <div className="fl-home-feature">💎<h3 style={{ color: "white" }}>Curated Quality</h3><p style={{ color: "#aaa" }}>Only trips we’d take ourselves.</p></div>
        <div className="fl-home-feature">🧭<h3 style={{ color: "white" }}>Easy Planning</h3><p style={{ color: "#aaa" }}>Simple itineraries & bookings.</p></div>
        <div className="fl-home-feature">💰<h3 style={{ color: "white" }}>Honest Pricing</h3><p style={{ color: "#aaa" }}>No hidden charges.</p></div>
      </section>

      <Footer />
    </div>
  );
}
