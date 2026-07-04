import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AddPackage from "../pages/AddPackage";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import MyPackages from "../pages/MyPackages"; // Assuming you added this in the previous step

// This wrapper forces users to the login page if they don't have a saved session
const PrivateRoute = ({ children }) => {
  const user = sessionStorage.getItem("viz_currentUser"); // Changed to sessionStorage
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* 1. Unprotected Public Route */}
      <Route path="/login" element={<Login />} />

      {/* 2. Protected Routes (Must be logged in to see these) */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/add-package" element={<PrivateRoute><AddPackage /></PrivateRoute>} />
      <Route path="/my-packages" element={<PrivateRoute><MyPackages /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    </Routes>
  );
}

export default AppRoutes;