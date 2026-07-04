// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Login() {
  // New state to toggle between Login and Registration forms
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("viz_currentUser")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoginMode && !companyName) {
      alert("Please provide a Company Name to register.");
      return;
    }

    if (email && password) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        // Decide which endpoint to hit based on what the user is doing
        const endpoint = isLoginMode
          ? `${apiUrl}/vendor-auth/login`
          : `${apiUrl}/vendor-auth/register`;

        // If logging in, we only send email and password. If registering, we also send companyName.
        const payload = isLoginMode
          ? { email, password }
          : { companyName, email, password };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
          // Save the user data to browser storage
          sessionStorage.setItem("viz_currentUser", JSON.stringify(data));
          // Redirect them to the dashboard
          navigate("/");
        } else {
          // Show the exact error message from the backend (e.g., "Wrong password")
          alert(data.message);
        }
      } catch (err) {
        alert("Server error. Is the backend running?");
      }
    } else {
      alert("Please fill out all required fields.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center p-4 font-sans text-gray-100">
      <div className="w-full max-w-md bg-[#0a1522] border border-gray-800 rounded-3xl shadow-2xl p-8 md:p-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl text-white">✈</span>
          <span className="font-display text-3xl font-bold text-white tracking-wide">
            Viz <span className="text-[#00b4d8]">Travels</span>
          </span>
        </div>

        <div className="text-center mb-8">
          {/* Dynamic Title based on mode */}
          <h2 className="text-xl font-bold text-white">
            {isLoginMode ? "Vendor Portal" : "Create Vendor Account"}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {isLoginMode ? "Sign in to manage your travel packages" : "Register to start listing your packages"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Only show Company Name input if the user is registering */}
          {!isLoginMode && (
            <Input
              label="Company Name"
              name="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required={!isLoginMode}
            />
          )}

          <Input label="Email Address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <div className="mt-4 flex flex-col gap-4">
            {/* Dynamic Button Text */}
            <Button type="submit" variant="primary">
              <div className="w-full text-center text-base py-1">
                {isLoginMode ? "Sign In Securely" : "Register Account"}
              </div>
            </Button>

            {/* The Toggle Button */}
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-sm text-[#00b4d8] hover:text-white transition-colors cursor-pointer"
            >
              {isLoginMode
                ? "Don't have an account? Register here"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
