import React from "react";
import "../styles/events.css"; // Ensure your CSS path is correct
import Footer from "../components/Footer";

const eventsData = [
  {
    city: "Chandigarh",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/sukhna-lake-chandigarh-trip-hero?qlt=82&ts=1727162930537",
    description: "Modern planned city full of nightlife, music & food festivals.",
    events: ["Rock Garden Light Show", "Sukhna Lake Music Night", "Sector 17 Food Fest"],
  },
  {
    city: "Delhi",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
    description: "Capital city full of heritage + modern events.",
    events: ["India Gate Night View", "Red Fort Light Show", "Delhi Street Food Fest"],
  },
  {
    city: "Mumbai",
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7",
    description: "Entertainment capital with Bollywood & beach events.",
    events: ["Bollywood Awards Night", "Marine Drive Fest", "Gateway Music Night"],
  },
  {
    city: "Jaipur",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41",
    description: "Royal heritage city with cultural festivals.",
    events: ["Literature Fest", "Hawa Mahal Light Show", "Royal Culture Fair"],
  },
];

const sortedCities = [
  ...eventsData.filter((c) => c.city === "Chandigarh"),
  ...eventsData.filter((c) => c.city !== "Chandigarh"),
];

export default function EventsPage() {
  return (
    <div className="ev-container">

      <div className="ev-hero">
        <h1>Discover City Events</h1>
        <p>Explore trending events across India ✨</p>
      </div>

      <div className="ev-grid">
        {sortedCities.map((city, i) => (
          <div className="ev-card" key={i}>
            <div className="ev-img-wrapper">
              <img src={city.image} alt={city.city} />
              <div className="ev-overlay">
                <h2>{city.city}</h2>
              </div>
            </div>

            <p className="ev-desc">{city.description}</p>

            <div className="ev-events">
              {city.events.map((event, idx) => (
                <div key={idx} className="ev-event">
                  🎉 {event}
                </div>
              ))}
            </div>

            <button className="ev-btn">Explore More</button>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}