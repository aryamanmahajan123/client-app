import React, { useState, useEffect, useCallback } from 'react';
import './TranslationPage.css';

const TranslationPage = ({ token }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('te');
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState('');
  const [translationHistory, setTranslationHistory] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

  const fetchSupportedLanguages = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/translation/supported-languages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSupportedLanguages(data.languages);
      } else {
        console.error('Failed to fetch supported languages');
      }
    } catch (error) {
      console.error('Error fetching supported languages:', error);
    }
  }, [token, API_BASE_URL]);

  useEffect(() => {
    fetchSupportedLanguages();
  }, [fetchSupportedLanguages]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/translation/translate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          source_language: sourceLanguage,
          target_language: targetLanguage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translated_text);
        setConfidence(data.confidence);
        
        // Add to history
        const historyItem = {
          id: Date.now(),
          originalText: data.original_text,
          translatedText: data.translated_text,
          sourceLanguage: data.source_language,
          targetLanguage: data.target_language,
          confidence: data.confidence,
          timestamp: new Date().toLocaleString(),
        };
        setTranslationHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Translation failed');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDetectLanguage = async () => {
    if (!sourceText.trim()) {
      setError('Please enter text for language detection');
      return;
    }

    setIsDetecting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/translation/detect-language`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDetectedLanguage(data.detected_language);
        setSourceLanguage(data.detected_language);
        setConfidence(data.confidence);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Language detection failed');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Language detection error:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSwapLanguages = () => {
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);
    
    // Swap texts if both exist
    if (sourceText && translatedText) {
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  const clearAll = () => {
    setSourceText('');
    setTranslatedText('');
    setDetectedLanguage(null);
    setConfidence(null);
    setError('');
  };

  const getLanguageName = (code) => {
    const language = supportedLanguages.find(lang => lang.code === code);
    return language ? `${language.name} (${language.native_name})` : code.toUpperCase();
  };

  return (
    <div className="translation-page">
      <div className="translation-header">
        <h1>Language Translation</h1>
        <p>Translate text between different languages using our corpus translation service</p>
      </div>

      <div className="translation-container">
        <div className="translation-controls">
          <div className="language-selectors">
            <div className="language-selector">
              <label htmlFor="source-language">From:</label>
              <select
                id="source-language"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.native_name})
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="swap-button" 
              onClick={handleSwapLanguages}
              title="Swap languages"
            >
              ⇄
            </button>

            <div className="language-selector">
              <label htmlFor="target-language">To:</label>
              <select
                id="target-language"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.native_name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {detectedLanguage && (
            <div className="detection-result">
              <span className="detection-label">Detected Language:</span>
              <span className="detected-lang">{getLanguageName(detectedLanguage)}</span>
              <span className="confidence">({(confidence * 100).toFixed(1)}% confidence)</span>
            </div>
          )}
        </div>

        <div className="translation-panels">
          <div className="input-panel">
            <div className="panel-header">
              <h3>Source Text</h3>
              <div className="panel-actions">
                <button
                  className="detect-button"
                  onClick={handleDetectLanguage}
                  disabled={isDetecting || !sourceText.trim()}
                >
                  {isDetecting ? 'Detecting...' : 'Detect Language'}
                </button>
                <button
                  className="clear-button"
                  onClick={clearAll}
                >
                  Clear All
                </button>
              </div>
            </div>
            <textarea
              className="source-textarea"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              rows={8}
            />
            <div className="character-count">
              {sourceText.length} characters
            </div>
          </div>

          <div className="output-panel">
            <div className="panel-header">
              <h3>Translation</h3>
              {confidence && (
                <div className="confidence-indicator">
                  Confidence: {(confidence * 100).toFixed(1)}%
                </div>
              )}
            </div>
            <textarea
              className="translation-textarea"
              value={translatedText}
              readOnly
              placeholder="Translation will appear here..."
              rows={8}
            />
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="translate-button"
            onClick={handleTranslate}
            disabled={isTranslating || !sourceText.trim() || sourceLanguage === targetLanguage}
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {translationHistory.length > 0 && (
          <div className="translation-history">
            <h3>Recent Translations</h3>
            <div className="history-list">
              {translationHistory.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-header">
                    <span className="history-languages">
                      {getLanguageName(item.sourceLanguage)} → {getLanguageName(item.targetLanguage)}
                    </span>
                    <span className="history-timestamp">{item.timestamp}</span>
                  </div>
                  <div className="history-content">
                    <div className="history-original">{item.originalText}</div>
                    <div className="history-translation">{item.translatedText}</div>
                  </div>
                  <div className="history-confidence">
                    Confidence: {(item.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationPage;
