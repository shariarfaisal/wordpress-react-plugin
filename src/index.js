import "./index.scss";

import { useBlockProps } from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import { useEffect, useState } from "react";

registerBlockType(metadata.name, { edit: EditComponent });

function EditComponent(props) {
  const [summarizerType, setSummarizerType] = useState("url");
  const [youtubeUrls, setYoutubeUrls] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [buttonName, setButtonName] = useState("Summarize");
  const [toolTitle, setToolTitle] = useState("YouTube Video Summarizer");
  const [placeholder, setPlaceholder] = useState("Paste YouTube URL here");

  // Helper function to get localStorage key based on current pathname
  const getLocalStorageKey = () => {
    const pathname = window.location.pathname;
    return `tubeonai_youtube_urls_${pathname.replace(/[^a-zA-Z0-9]/g, '_')}`;
  };

  // Helper function to save URLs to localStorage
  const saveUrlsToLocalStorage = (urls) => {
    try {
      const key = getLocalStorageKey();
      localStorage.setItem(key, JSON.stringify(urls));
    } catch (error) {
      console.warn('Failed to save URLs to localStorage:', error);
    }
  };

  // Helper function to load URLs from localStorage
  const loadUrlsFromLocalStorage = () => {
    try {
      const key = getLocalStorageKey();
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load URLs from localStorage:', error);
      return [];
    }
  };

  function updateType(e) {
    setSummarizerType(e.target.value);
    props.setAttributes({ summarizerType: e.target.value });
  }

  function updateButtonName(e) {
    setButtonName(e.target.value);
    props.setAttributes({ buttonName: e.target.value });
  }

  function updateToolTitle(e) {
    setToolTitle(e.target.value);
    props.setAttributes({ toolTitle: e.target.value });
  }

  function updatePlaceholder(e) {
    setPlaceholder(e.target.value);
    props.setAttributes({ placeholder: e.target.value });
  }

  function handleAddUrl(e) {
    e.preventDefault();
    if (newUrl.trim()) {
      const updatedUrls = [...youtubeUrls, newUrl.trim()];
      setYoutubeUrls(updatedUrls);
      props.setAttributes({ youtubeUrls: updatedUrls });
      // Save to localStorage as well
      saveUrlsToLocalStorage(updatedUrls);
      setNewUrl(""); // Clear input after adding
    }
  }

  function handleRemoveUrl(indexToRemove) {
    const updatedUrls = youtubeUrls.filter(
      (_, index) => index !== indexToRemove
    );
    setYoutubeUrls(updatedUrls);
    props.setAttributes({ youtubeUrls: updatedUrls });
    // Remove from localStorage as well
    saveUrlsToLocalStorage(updatedUrls);
  }

  useEffect(() => {
    setSummarizerType(props.attributes.summarizerType || "url");
    setButtonName(props.attributes.buttonName || "Summarize");
    setToolTitle(props.attributes.toolTitle || "YouTube Video Summarizer");
    setPlaceholder(props.attributes.placeholder || "Paste YouTube URL here");
    
    // Handle YouTube URLs with localStorage recovery
    let urlsToUse = [];
    
    if (props.attributes.youtubeUrls && props.attributes.youtubeUrls.length > 0) {
      // If attributes exist, use them
      urlsToUse = props.attributes.youtubeUrls;
    } else {
      // If attributes don't exist, try to recover from localStorage
      const storedUrls = loadUrlsFromLocalStorage();
      if (storedUrls.length > 0) {
        urlsToUse = storedUrls;
        // Also update the attributes with recovered data
        props.setAttributes({ youtubeUrls: storedUrls });
      }
    }
    
    setYoutubeUrls(urlsToUse);
  }, []);

  return (
    <div {...useBlockProps()}>
      <div className="makeUpYourBlockTypeName">
        <div className="tool-title-control">
          <label htmlFor="tool-title">Tool Title:</label>
          <input
            id="tool-title"
            type="text"
            value={toolTitle}
            onChange={updateToolTitle}
            placeholder="Enter tool title"
            className="tool-title-input"
          />
        </div>

        <div className="controls-row">
          <label htmlFor="summarizer-type">Type:</label>
          <select
            id="summarizer-type"
            className="select-summarizer"
            value={summarizerType}
            onChange={updateType}
          >
            <option value="url">URL Summarizer</option>
            <option value="file">File Summarizer</option>
            <option value="text">Text Summarizer</option>
          </select>

          <div className="button-name-control">
            <label htmlFor="button-name">Button Label:</label>
            <input
              id="button-name"
              type="text"
              value={buttonName}
              onChange={updateButtonName}
              placeholder="Button Name"
              className="button-name-input"
            />
          </div>
        </div>

        <div className="placeholder-control">
          <label htmlFor="placeholder-text">Placeholder Text:</label>
          <input
            id="placeholder-text"
            type="text"
            value={placeholder}
            onChange={updatePlaceholder}
            placeholder="Enter placeholder text"
            className="placeholder-input"
          />
        </div>

        <div className="youtube-urls-section">
          <p>Suggested YouTube Videos</p>
          <form onSubmit={handleAddUrl} className="url-input-form">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder={placeholder}
              className="youtube-url-input"
            />
            <button type="submit" className="add-url-button">
              Add URL
            </button>
          </form>

          {youtubeUrls.length > 0 && (
            <ul className="youtube-urls-list">
              {youtubeUrls.map((url, index) => (
                <li key={index} className="url-item">
                  <span>{url}</span>
                  <button
                    onClick={() => handleRemoveUrl(index)}
                    className="remove-url-button"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
