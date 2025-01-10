import "./index.scss";

import { useBlockProps } from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import { useState } from "react";

registerBlockType(metadata.name, { edit: EditComponent });

function EditComponent(props) {
  const [summarizerType, setSummarizerType] = useState("url");

  function updateType(e) {
    setSummarizerType(e.target.value);
    props.setAttributes({ summarizerType: e.target.value });
  }

  return (
    <div {...useBlockProps()}>
      <div className="makeUpYourBlockTypeName">
        <h1 className="title">Select Summarizer</h1>
        <select
          className="select-summarizer"
          value={summarizerType}
          onChange={updateType}
        >
          <option value="url">URL Summarizer</option>
          <option value="file">File Summarizer</option>
          <option value="text">Text Summarizer</option>
        </select>
      </div>
    </div>
  );
}
