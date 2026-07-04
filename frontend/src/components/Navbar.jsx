import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaDownload,
  FaSignOutAlt,
  FaSuitcaseRolling,
} from "react-icons/fa";
import Notification from "./Notification";
import "../styles/navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const profileRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setProfileOpen(false);
    window.location.href = "/";
  };

  const getInitial = () => {
    if (!user?.name) return "U";
    return user.name.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="fl-nav-wrapper">
      <nav className="fl-navbar">
        <div className="fl-logo">
          <NavLink to="/" className="fl-logo-icon">
            ✈ VizTravels
          </NavLink>
        </div>

        <div className="fl-nav-right">
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noreferrer"
            className="fl-review-link"
          >
            Share your experience
          </a>

          {/* ADDED: My Bookings link (Desktop) */}
          {user && (
            <NavLink to="/my-bookings" className="fl-review-link">
              <FaSuitcaseRolling style={{ marginRight: "6px" }} />
              My Bookings
            </NavLink>
          )}

          <Notification />

          <div className="fl-profile" ref={profileRef}>
            <button
              className="fl-avatar-btn"
              onClick={() => setProfileOpen((p) => !p)}
              aria-label="Account menu"
            >
              {user ? (
                <span className="fl-avatar-circle">{getInitial()}</span>
              ) : (
                <span className="fl-avatar-circle fl-avatar-guest">?</span>
              )}
            </button>

            {profileOpen && (
              <div className="fl-profile-dropdown">
                {user ? (
                  <>
                    <div className="fl-profile-header">
                      <span className="fl-avatar-circle fl-avatar-lg">
                        {getInitial()}
                      </span>
                      <div className="fl-profile-info">
                        <span className="fl-profile-name">{user.name}</span>
                        <span className="fl-profile-email">{user.email}</span>
                      </div>
                    </div>
                    <button className="fl-logout-btn" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    className="fl-login-link"
                    onClick={() => setProfileOpen(false)}
                  >
                    Sign In
                  </NavLink>
                )}
              </div>
            )}
          </div>

          <div
            className={`fl-menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen((m) => !m)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className={`fl-menu-panel ${menuOpen ? "open" : ""}`} ref={menuRef}>
          <div className="fl-nav-links">
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>About Us</NavLink>
            <NavLink to="/tour" onClick={() => setMenuOpen(false)}>Tours</NavLink>
            <NavLink to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</NavLink>
            <NavLink to="/event" onClick={() => setMenuOpen(false)}>Event</NavLink>
            <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>

            {/* ADDED: My Bookings link (Mobile Panel) */}
            {user && (
              <NavLink to="/my-bookings" onClick={() => setMenuOpen(false)}>
                <FaSuitcaseRolling style={{ marginRight: "6px" }} />
                My Bookings
              </NavLink>
            )}
          </div>

          <div className="fl-social-icons">
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
          </div>

          <a
            href="/application-80c6153b-97ab-45ec-840a-930629c51db9.apk"
            download
            className="fl-download-badge"
          >
            <span className="fl-download-icon"><FaDownload /></span>
            <span className="fl-download-text">
              <small>Get it on</small>
              <strong>VizTravels App</strong>
            </span>
          </a>
        </div>
      </nav>
    </div>
  );
}