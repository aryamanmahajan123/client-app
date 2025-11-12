// src/pages/LoginPage.js
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import ResponseBox from "../components/ResponseBox";
import LoadingSpinner from "../components/LoadingSpinner"; // Import LoadingSpinner

const baseURL = "https://api.corpus.swecha.org/api/v1";

function LoginPage({ onLoginSuccess }) {
  const [tab, setTab] = useState("password");

  // password login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordResponse, setPasswordResponse] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false); // Loading state for password login

  // otp login state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStage, setOtpStage] = useState("request"); // request | verify
  const [otpResponse, setOtpResponse] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false); // Loading state for OTP login

  // Styles for consistency
  const pageContainerStyle = {
    fontFamily: "Inter, sans-serif",
    background: "linear-gradient(135deg, #74ABE2, #5563DE)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "400px",
    background: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "#5563DE",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const tabButtonStyle = (isActive) => ({
    flex: 1,
    padding: "12px",
    background: isActive ? "#5563DE" : "#f3f4f6",
    color: isActive ? "white" : "#333",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  });

  // ---- Password Login ----
  const handlePasswordLogin = async () => {
    setPasswordResponse("");
    setIsPasswordLoading(true);
    try {
      const res = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: username, password }), // API expects 'phone' not 'username'
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordResponse(" Login successful");
        onLoginSuccess(data.access_token); // pass token to parent
      } else {
        setPasswordResponse(` ${data.detail || "Login failed"}`);
      }
    } catch {
      setPasswordResponse(" Error connecting to server");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // ---- OTP Request ----
  const handleSendOtp = async () => {
    setOtpResponse("");
    setIsOtpLoading(true);
    try {
      const res = await fetch(
        `${baseURL}/auth/login/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ phone: phone }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setOtpResponse(" OTP sent successfully");
        setOtpStage("verify");
      } else {
        const errorMsg = data.detail || data.message || "Failed to send OTP";
        setOtpResponse(`❌ ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
      }
    } catch(err) {
      setOtpResponse(`❌ Error connecting to server: ${err.message}`);
    } finally {
      setIsOtpLoading(false);
    }
  };

  // ---- OTP Verify ----
  const handleVerifyOtp = async () => {
    setOtpResponse("");
    setIsOtpLoading(true);
    try {
      const payload = {
        phone: phone,
        otp_code: otp.trim(),
      };
      
      const res = await fetch(
        `${baseURL}/auth/login/verify-otp`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );
      
      const data = await res.json();
      
      if (res.ok) {
        setOtpResponse("✅ OTP verified, login successful");
        onLoginSuccess(data.access_token || data.token); // Handle different token field names
      } else {
        const errorMsg = data.detail || data.message || "OTP verification failed";
        setOtpResponse(`❌ ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
      }
    } catch(err) {
      setOtpResponse(`❌ Error verifying OTP: ${err.message}`);
    } finally {
      setIsOtpLoading(false);
    }
  };

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>
          Welcome
        </h2>

        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: "20px", borderRadius: "8px", overflow: "hidden" }}>
          <button
            onClick={() => {setTab("password"); setPasswordResponse(""); setIsPasswordLoading(false);}}
            style={tabButtonStyle(tab === "password")}
            disabled={isPasswordLoading || isOtpLoading}
          >
            Password
          </button>
          <button
            onClick={() => {setTab("otp"); setOtpResponse(""); setIsOtpLoading(false);}}
            style={tabButtonStyle(tab === "otp")}
            disabled={isPasswordLoading || isOtpLoading}
          >
            OTP
          </button>
        </div>

        {/* Password login */}
        {tab === "password" && (
          <>
            <input
              type="text"
              placeholder="Phone number"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              disabled={isPasswordLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              disabled={isPasswordLoading}
            />
            <button onClick={handlePasswordLogin} style={buttonStyle} disabled={isPasswordLoading}>
              {isPasswordLoading ? <LoadingSpinner /> : "Login"}
            </button>
            {passwordResponse && <ResponseBox text={passwordResponse} />}
          </>
        )}

        {/* OTP login */}
        {tab === "otp" && (
          <>
            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
              disabled={isOtpLoading || otpStage === "verify"} // Disable phone input when OTP is sent
            />
            {otpStage === "request" ? (
              <button onClick={handleSendOtp} style={buttonStyle} disabled={isOtpLoading}>
                {isOtpLoading ? <LoadingSpinner /> : "Send OTP"}
              </button>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={inputStyle}
                  disabled={isOtpLoading}
                />
                <button onClick={handleVerifyOtp} style={buttonStyle} disabled={isOtpLoading}>
                  {isOtpLoading ? <LoadingSpinner /> : "Verify OTP"}
                </button>
              </>
            )}
            {otpResponse && <ResponseBox text={otpResponse} />}
          </>
        )}

        {/* Signup Link */}
        <p style={{ marginTop: "20px", fontSize: "14px", color: "#555" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#5563DE", textDecoration: "none" }}>
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;