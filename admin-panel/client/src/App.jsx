import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useToast } from "./hooks/useToast";
import "./index.css";

// Placeholder components - these should be implemented based on your needs
const Login = () => {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    try {
      await login(username, password);
      showSuccess("Login successful!");
    } catch (error) {
      showError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-white text-2xl mb-4">Admin Login</h2>
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const { logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl">Admin Dashboard</h1>
        <button onClick={logout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </nav>
      <div className="p-8">
        <p className="text-gray-400">Dashboard content goes here...</p>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;