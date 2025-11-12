// src/components/ResponseBox.js
import React from "react";

function ResponseBox({ text }) {
  return (
    <pre
      style={{
        background: "#f3f4f6", // Changed background for better contrast
        padding: "12px",
        marginTop: "15px",
        borderRadius: "8px",
        fontSize: "13px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        textAlign: "left",
        color: "#333", // Added text color
        border: "1px solid #e2e8f0", // Added a subtle border
      }}
    >
      {text}
    </pre>
  );
}

export default ResponseBox;