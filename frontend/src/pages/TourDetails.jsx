
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import TripCustomizer from "../components/TripCustomizer";

// Use env variable for packages API URL
const PACKAGES_URL = import.meta.env.VITE_PACKAGES_API_URL || 'http://localhost:5001/api';

export default function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  // Current Image Index state
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`${PACKAGES_URL}/packages/${id}`);
        setTour(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };
    if (id) fetchTour();
  }, [id]);

  if (loading) {
    return <div style={{ backgroundColor: "#0b1120", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}><h2>Loading...</h2></div>;
  }

  if (!tour) {
    return <div style={{ backgroundColor: "#0b1120", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}><h2>Package not found!</h2></div>;
  }

  return (
    <div style={{ backgroundColor: "#0b1120", minHeight: "100vh", color: "white" }}>

      <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>

        {/* HERO IMAGE GALLERY */}
        <div className="w-full mb-8">
          <div style={{ width: "100%", height: "400px", borderRadius: "24px", overflow: "hidden", marginBottom: "15px" }}>
            <img
              src={tour.images?.[currentIdx] || "https://via.placeholder.com/1200x400"}
              alt={tour.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Thumbnails to see all photos */}
          <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
            {tour.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                style={{
                  border: currentIdx === idx ? "2px solid #00b4d8" : "none",
                  borderRadius: "8px", overflow: "hidden", width: "80px", height: "80px"
                }}
              >
                <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", paddingBottom: "60px" }}>
          {/* LEFT COLUMN: Details */}
          <div style={{ flex: "1 1 55%" }}>
            <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "10px" }}>{tour.title}</h1>
            <p style={{ color: "#00b4d8", fontSize: "18px", marginBottom: "30px" }}>📍 {tour.location}</p>
            <h3 style={{ fontSize: "24px", marginBottom: "15px", borderBottom: "1px solid #1f2937", paddingBottom: "10px" }}>Overview</h3>
            <p style={{ color: "#9ca3af", lineHeight: "1.8", fontSize: "16px", whiteSpace: "pre-line" }}>{tour.description}</p>
          </div>

          {/* RIGHT COLUMN: Customizer */}
          <div style={{ flex: "1 1 40%", minWidth: "340px" }}>
            <TripCustomizer tour={tour} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
