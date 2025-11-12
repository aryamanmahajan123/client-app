// src/pages/SignupPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ResponseBox from "../components/ResponseBox";
import LoadingSpinner from "../components/LoadingSpinner"; // Import LoadingSpinner

const baseURL = "https://api.corpus.swecha.org/api/v1";

function SignupPage() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [hasGivenConsent, setHasGivenConsent] = useState(false);
  const [signupStage, setSignupStage] = useState("request_otp"); // request_otp | verify_otp
  const [signupResponse, setSignupResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const navigate = useNavigate();

  // Styles for consistency with LoginPage
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

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: "#f3f4f6",
    color: "#333",
    marginTop: "15px",
  };

  const handleSendSignupOtp = async () => {
    setSignupResponse("");
    setIsLoading(true);
    if (!phone) {
      setSignupResponse("Phone number is required.");
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`${baseURL}/auth/signup/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setSignupResponse("OTP sent to your phone number.");
        setSignupStage("verify_otp");
      } else {
        setSignupResponse(`Error: ${data.detail || "Failed to send OTP."}`);
      }
    } catch (err) {
      setSignupResponse("Error connecting to server.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySignupOtp = async () => {
    setSignupResponse("");
    setIsLoading(true);
    if (!phone || !otp || !name || !password || !confirmPassword || !hasGivenConsent) {
      setSignupResponse("All fields (including consent) are required.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setSignupResponse("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
        setSignupResponse("Password must be at least 8 characters long.");
        setIsLoading(false);
        return;
    }

    try {
      const res = await fetch(`${baseURL}/auth/signup/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
          otp_code: otp,
          name: name,
          email: email || null, // API expects null if not provided
          password: password,
          has_given_consent: hasGivenConsent,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSignupResponse("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // Redirect to login after successful signup
        }, 2000);
      } else {
        setSignupResponse(`Error: ${data.detail || "Failed to verify OTP or create account."}`);
      }
    } catch (err) {
      setSignupResponse("Error connecting to server.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>
          Sign Up
        </h2>

        {signupStage === "request_otp" ? (
          <>
            <input
              type="text"
              placeholder="Phone number (e.g., +919876543210)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              disabled={isLoading}
            />
            <input
              type="email"
              placeholder="Email (Optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              disabled={isLoading}
            />
            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <input
                type="checkbox"
                id="consent"
                checked={hasGivenConsent}
                onChange={(e) => setHasGivenConsent(e.target.checked)}
                style={{ marginRight: "8px" }}
                disabled={isLoading}
              />
              <label htmlFor="consent" style={{ fontSize: "14px", color: "#555" }}>
                I agree to the terms and conditions.
              </label>
            </div>
            <button onClick={handleSendSignupOtp} style={buttonStyle} disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : "Send OTP for Signup"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
              disabled // Phone number should not be editable after OTP is sent
            />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={inputStyle}
              disabled={isLoading}
            />
            <button onClick={handleVerifySignupOtp} style={buttonStyle} disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : "Verify OTP and Create Account"}
            </button>
            <button onClick={() => setSignupStage("request_otp")} style={secondaryButtonStyle} disabled={isLoading}>
              Back to fields
            </button>
          </>
        )}

        {signupResponse && <ResponseBox text={signupResponse} />}

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#555" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#5563DE", textDecoration: "none" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;