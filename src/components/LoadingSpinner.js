// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={spinnerContainerStyle}>
      <div style={spinnerStyle}></div>
    </div>
  );
};

const spinnerContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // You might want to position this over content,
  // but for simple use in buttons, it's fine as is.
};

const spinnerStyle = {
  border: '4px solid rgba(255, 255, 255, 0.3)',
  borderTop: '4px solid #fff',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  animation: 'spin 1s linear infinite',
};

// Keyframes for the spinner animation (can be in a global CSS or inject dynamically)
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);


export default LoadingSpinner;