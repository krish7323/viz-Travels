import React from "react";
import "../styles/about.css"; // Check karein ki ye file path sahi hai

const About = () => {
  return (
    <div className="about-page">
      {/* HERO SECTION */}
      <section className="about-hero">
        <h1>About VizTravels</h1>
        <p>
          We are a passionate travel company helping people explore the world
          with comfort, safety, and unforgettable experiences.
        </p>
      </section>

      {/* COMPANY STORY */}
      <section className="about-story">
        <div className="story-text">
          <h2>Our Story</h2>
          <p>
            VizTravels started with a simple idea — make travel easy and
            affordable for everyone. Today, we help thousands of travelers
            discover amazing destinations every year.
          </p>
          <p>
            From mountain adventures to beach vacations, we handle everything
            so you can just enjoy your journey.
          </p>
        </div>

        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b"
            alt="Travel"
          />
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="team-section">
        <h2>Meet Our Team</h2>

        <div className="team-grid">
          <div className="team-card">
            <img src="https://i.pravatar.cc/300?img=12" alt="member" />
            <h3>Rahul Sharma</h3>
            <p>Founder & CEO</p>
          </div>

          <div className="team-card">
            <img src="https://i.pravatar.cc/300?img=5" alt="member" />
            <h3>Anjali Verma</h3>
            <p>Travel Consultant</p>
          </div>

          <div className="team-card">
            <img src="https://i.pravatar.cc/300?img=32" alt="member" />
            <h3>Vikram Singh</h3>
            <p>Operations Manager</p>
          </div>

          <div className="team-card">
            <img src="https://i.pravatar.cc/300?img=47" alt="member" />
            <h3>Neha Gupta</h3>
            <p>Customer Support</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;