// src/pages/CreateRecord.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Dashboard.css';

const CreateRecord = ({ token }) => {
  const [activeTab, setActiveTab] = useState('record');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'Document',
    language: 'Hindi',
    releaseRights: 'Family or Friend',
    category: 'Flora & Fauna'
  });
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('media_type', formData.mediaType);
      submitData.append('language', formData.language);
      submitData.append('release_rights', formData.releaseRights);
      submitData.append('category', formData.category);
      
      if (file) {
        submitData.append('file', file);
      }

      const res = await fetch('https://api.corpus.swecha.org/api/v1/corpus/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!res.ok) {
        throw new Error('Record creation failed');
      }

      const data = await res.json();
      setResponse(data);
      setError('');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        mediaType: 'Document',
        language: 'Hindi',
        releaseRights: 'Family or Friend',
        category: 'Flora & Fauna'
      });
      setFile(null);
      
    } catch (err) {
      setError(err.message);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://api.corpus.swecha.org/api/v1/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!res.ok) {
        throw new Error('Category creation failed');
      }

      const data = await res.json();
      setResponse(data);
      setError('');
      
      // Reset form
      setCategoryData({
        name: '',
        description: ''
      });
      
    } catch (err) {
      setError(err.message);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <>
      <Header token={token} onLogout={() => navigate('/profile')} />
      <div className="create-record-container">
        <div className="create-record-header">
          <h1>Create New {activeTab === 'record' ? 'Record' : 'Category'}</h1>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'record' ? 'active' : ''}`}
            onClick={() => setActiveTab('record')}
          >
            Record
          </button>
          <button 
            className={`tab ${activeTab === 'category' ? 'active' : ''}`}
            onClick={() => setActiveTab('category')}
          >
            Category
          </button>
        </div>

      {activeTab === 'record' && (
        <form onSubmit={handleRecordSubmit} className="create-record-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Enter description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="mediaType">Media Type:</label>
          <select
            id="mediaType"
            name="mediaType"
            value={formData.mediaType}
            onChange={handleInputChange}
          >
            <option value="Document">Document</option>
            <option value="Audio">Audio</option>
            <option value="Video">Video</option>
            <option value="Image">Image</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
          >
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Bengali">Bengali</option>
            <option value="Telugu">Telugu</option>
            <option value="Tamil">Tamil</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Marathi">Marathi</option>
            <option value="Kannada">Kannada</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Punjabi">Punjabi</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="releaseRights">Release Rights:</label>
          <select
            id="releaseRights"
            name="releaseRights"
            value={formData.releaseRights}
            onChange={handleInputChange}
          >
            <option value="Family or Friend">Family or Friend</option>
            <option value="Public Domain">Public Domain</option>
            <option value="Creative Commons">Creative Commons</option>
            <option value="All Rights Reserved">All Rights Reserved</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="Flora & Fauna">Flora & Fauna</option>
            <option value="Culture">Culture</option>
            <option value="History">History</option>
            <option value="Literature">Literature</option>
            <option value="Music">Music</option>
            <option value="Art">Art</option>
            <option value="Science">Science</option>
            <option value="Technology">Technology</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="file">File (optional):</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.mp3,.wav,.mp4,.avi,.jpg,.jpeg,.png,.gif"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Record'}
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
        </form>
      )}

      {activeTab === 'category' && (
        <form onSubmit={handleCategorySubmit} className="create-record-form">
          <div className="form-group">
            <label htmlFor="categoryName">Category Name:</label>
            <input
              type="text"
              id="categoryName"
              name="name"
              value={categoryData.name}
              onChange={handleCategoryInputChange}
              required
              placeholder="Enter category name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryDescription">Description:</label>
            <textarea
              id="categoryDescription"
              name="description"
              value={categoryData.description}
              onChange={handleCategoryInputChange}
              rows="4"
              placeholder="Enter category description"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Category'}
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}
      {response && (
        <div className="success-message">
          <h3>{activeTab === 'record' ? 'Record' : 'Category'} Created Successfully!</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      </div>
    </>
  );
};

export default CreateRecord;
