// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; // Import SignupPage
import UserProfile from "./pages/UserProfile";
import CreateRecord from "./pages/CreateRecord";
import TranslationPage from "./pages/TranslationPage";
import "./App.css"; // Keep this if you have global styles

function App() {
  // Initialize token from localStorage if available
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || null);

  // Effect to update localStorage whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    // Force navigation to profile after login
    window.location.href = '/profile';
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Router>
      <div className="App"> {/* You can remove this div if it's not strictly needed */}
        <Routes>
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<SignupPage />} /> {/* New Signup Route */}
          <Route
            path="/profile"
            element={token ? <UserProfile token={token} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/create-record"
            element={token ? <CreateRecord token={token} /> : <Navigate to="/login" />}
          />
          <Route
            path="/translation"
            element={token ? <TranslationPage token={token} /> : <Navigate to="/login" />}
          />
          {/* Default route to UserProfile if token exists, otherwise to /login */}
          <Route path="/" element={<Navigate to={token ? "/profile" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;