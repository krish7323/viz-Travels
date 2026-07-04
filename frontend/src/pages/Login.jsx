import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/tourdetails.css";

// Fixed: Use the env variable instead of hardcoded localhost URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      setLoading(true);
      // Fixed: Now uses API_URL env variable (was hardcoded to http://localhost:5000)
      const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password });

      setMessage(res.data.message);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tourdetails-app">
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <div className="login-modal" style={{ boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}>
          <div className="modal-content">
            <h2>Create an Account</h2>
            <p className="subtitle">Sign up to get started</p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Sign Up"}
              </button>
            </form>

            {message && <p className="error-msg">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
