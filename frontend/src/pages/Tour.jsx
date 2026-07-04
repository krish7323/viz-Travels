import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/tour.css";
import Footer from "../components/Footer";
import toursData from "../data/toursData";

// Use env variable for packages API URL
const PACKAGES_URL = import.meta.env.VITE_PACKAGES_API_URL || 'http://localhost:5001/api';


export default function Tours() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Default to "Hotel" or "Tour"
  const [activeCategory, setActiveCategory] = useState("Hotel");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(`${PACKAGES_URL}/packages/all`);
        setTours(response.data);
      } catch (error) {
        console.error("Error fetching live tours:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search")?.toLowerCase() || "";

    // Filter logic
    let results = tours.filter(t => {
      // Safely check category, fallback to 'Tour'
      const cat = t.category || "Tour";
      return cat === activeCategory;
    });

    // If a search query exists, filter the current category results
    if (searchQuery) {
      results = results.filter(t =>
        t.location?.toLowerCase().includes(searchQuery) ||
        t.title?.toLowerCase().includes(searchQuery)
      );
    }

    setFilteredTours(results);
  }, [location.search, tours, activeCategory]); // Re-runs whenever search, data, or tab changes

  return (
    <div className="tours-page">

      {/* Category Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "100px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveCategory("Hotel")}
          style={{
            padding: "12px 30px", fontSize: "18px", fontWeight: "bold", borderRadius: "30px", cursor: "pointer",
            backgroundColor: activeCategory === "Hotel" ? "#00b4d8" : "transparent",
            color: activeCategory === "Hotel" ? "white" : "#aaa",
            border: activeCategory === "Hotel" ? "none" : "2px solid #333"
          }}
        >
          🏨 Stays & Hotels
        </button>
        <button
          onClick={() => setActiveCategory("Tour")}
          style={{
            padding: "12px 30px", fontSize: "18px", fontWeight: "bold", borderRadius: "30px", cursor: "pointer",
            backgroundColor: activeCategory === "Tour" ? "#00b4d8" : "transparent",
            color: activeCategory === "Tour" ? "white" : "#aaa",
            border: activeCategory === "Tour" ? "none" : "2px solid #333"
          }}
        >
          🎒 Tours & Experiences
        </button>
      </div>



      {isLoading ? (
        <h3 style={{ textAlign: "center", color: "white", marginTop: "50px" }}>Loading...</h3>
      ) : filteredTours.length === 0 ? (
        <h3 style={{ textAlign: "center", color: "gray", marginTop: "50px" }}>
          No {activeCategory.toLowerCase()}s found. Try a different search!
        </h3>
      ) : (
        <div className="grid">
          {filteredTours.map((tour) => (
            <div className="card" key={tour._id} onClick={() => navigate(`/tour/${tour._id}`)}>
              <div className="img-box">
                <img src={tour.images?.[0] || "https://via.placeholder.com/300"} alt={tour.title} />
              </div>
              <div className="card-body">
                <h3>{tour.title}</h3>
                <p className="desc">{tour.description}</p>
                <div className="bottom">
                  <span>📍 {tour.location}</span>
                  <span>₹{tour.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="grid">
        {toursData.map((tour, i) => (
          <div className="card"
            key={tour.id}
            onClick={() => navigate(`/tour/${tour.id}`)}>

            <div className="img-box">
              <img src={tour.img} alt="" />
              <div className="img-overlay" />
            </div>

            <div className="card-body">
              <h3>{tour.title}</h3>

              <p className="desc">
                Enjoy a complete travel package with guided tours and premium stay.
              </p>

              <div className="bottom">
                <span className="location">{tour.location}</span>
                <span className="price">{tour.price}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
