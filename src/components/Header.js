// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ token, onLogout, user }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (token) {
      navigate('/profile');
    }
  };

  return (
    <header className="discord-header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo-section" onClick={handleLogoClick}>
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="logo-text">Corpus Dashboard</span>
          </div>
        </div>

        <nav className="header-nav">
          <button 
            className="nav-item"
            onClick={() => navigate('/profile')}
          >
            Dashboard
          </button>
          <button 
            className="nav-item"
            onClick={() => navigate('/create-record')}
          >
            Create
          </button>
        </nav>

        <div className="header-right">
          {token && (
            <div className="user-section">
              <div className="user-info">
                <div className="user-avatar">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="username">{user?.username || 'User'}</span>
              </div>
              <button className="logout-button" onClick={onLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
