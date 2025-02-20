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
      setNewUrl(""); // Clear input after adding
    }
  }

  function handleRemoveUrl(indexToRemove) {
    const updatedUrls = youtubeUrls.filter(
      (_, index) => index !== indexToRemove
    );
    setYoutubeUrls(updatedUrls);
    props.setAttributes({ youtubeUrls: updatedUrls });
  }

  useEffect(() => {
    setSummarizerType(props.attributes.summarizerType || "url");
    setYoutubeUrls(props.attributes.youtubeUrls || []);
    setButtonName(props.attributes.buttonName || "Summarize");
    setToolTitle(props.attributes.toolTitle || "YouTube Video Summarizer");
    setPlaceholder(props.attributes.placeholder || "Paste YouTube URL here");
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
