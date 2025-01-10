import "./frontend.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { UrlSummarizer, FileSummarizer, TextSummarizer } from "./summarizer";

const divsToUpdate = document.querySelectorAll(".boilerplate-update-me");

divsToUpdate.forEach((div) => {
  const data = JSON.parse(div.querySelector("pre").innerText);
  const root = ReactDOM.createRoot(div);
  root.render(<OurComponent {...data} />);
  div.classList.remove("boilerplate-update-me");
});

function OurComponent({ summarizerType }) {
  switch (summarizerType) {
    case "url":
      return <UrlSummarizer />;
    case "file":
      return <FileSummarizer />;
    case "text":
      return <TextSummarizer />;
    default:
      return <TextSummarizer />;
  }
}
