// src/pages/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Dashboard.css';

const UserProfile = ({ token, onLogout }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [categories, setCategories] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('https://api.corpus.swecha.org/api/v1/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data. Please try again.');
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.corpus.swecha.org/api/v1/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.corpus.swecha.org/api/v1/corpus', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data.items || []);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`https://api.corpus.swecha.org/api/v1/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setCategories(categories.filter(cat => cat.id !== categoryId));
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const handleCreateRecord = () => {
    navigate('/create-record');
  };

  const handleTranslation = () => {
    navigate('/translation');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'categories' && categories.length === 0) {
      fetchCategories();
    } else if (tab === 'records' && records.length === 0) {
      fetchRecords();
    }
  };

  return (
    <>
      <Header token={token} onLogout={onLogout} user={user} />
      <div className="dashboard-container">
      
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => handleTabChange('records')}
        >
          Records
        </button>
        <button 
          className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => handleTabChange('categories')}
        >
          Categories
        </button>
        <button 
          className="tab translation-tab"
          onClick={handleTranslation}
        >
          Translation
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>User Profile</h2>
            {error && <p className="error">{error}</p>}
            {user ? (
              <div className="profile-info">
                <div className="profile-field">
                  <span className="field-label">Name:</span>
                  <span className="field-value">{user.username}</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Phone:</span>
                  <span className="field-value">{user.phone || 'Not provided'}</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Email:</span>
                  <span className="field-value">{user.email}</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Gender:</span>
                  <span className="field-value">{user.gender || 'Not specified'}</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Place:</span>
                  <span className="field-value">{user.place || 'Not specified'}</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Member since:</span>
                  <span className="field-value">{user.member_since || 'Not provided'}</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Last login:</span>
                  <span className="field-value">{user.last_login || 'Not provided'}</span>
                </div>
                <button className="edit-profile-btn">Edit Profile</button>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="records-section">
            <h2>Records</h2>
            <button className="create-record-btn" onClick={handleCreateRecord}>
              Create New Record
            </button>
            {loading ? (
              <p>Loading records...</p>
            ) : records.length > 0 ? (
              <div className="records-grid">
                {records.map((record) => (
                  <div key={record.id} className="record-card">
                    <h3>{record.title}</h3>
                    <p>{record.description}</p>
                    <div className="record-meta">
                      <span>Language: {record.language}</span>
                      <span>Category: {record.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No records found.</p>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="categories-section">
            <h2>Categories</h2>
            {loading ? (
              <p>Loading categories...</p>
            ) : categories.length > 0 ? (
              <div className="categories-list">
                {categories.map((category) => (
                  <div key={category.id} className="category-item">
                    <div className="category-info">
                      <h3>{category.name}</h3>
                      {category.description && <p>{category.description}</p>}
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteCategory(category.id)}
                      title="Delete category"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No categories available.</p>
            )}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default UserProfile;
