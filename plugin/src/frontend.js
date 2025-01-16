import "./frontend.scss";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { UrlSummarizer, FileSummarizer, TextSummarizer } from "./summarizer";
import { useSummarizer } from "./summarizer/useSummarizer";
import Output from "./summarizer/output";
import { ToastContainer } from "react-toastify";
import LimitModal from "./summarizer/limit-modal";

const divsToUpdate = document.querySelectorAll(".boilerplate-update-me");

divsToUpdate.forEach((div) => {
  const data = JSON.parse(div.querySelector("pre").innerText);
  const root = ReactDOM.createRoot(div);
  root.render(<OurComponent {...data} />);
  div.classList.remove("boilerplate-update-me");
});

function OurComponent({ summarizerType }) {
  const { summary, setType, limitOpen } = useSummarizer();

  useEffect(() => {
    setType(summarizerType);
  }, [summarizerType]);

  return (
    <div className="summarizer">
      <ToastContainer />
      <div className="border rounded-lg p-4 space-y-3">
        {!summary && <Summarizer type={summarizerType} />}
        {summary && <Output />}
        <LimitModal />
      </div>
    </div>
  );
}

function Summarizer({ type }) {
  switch (type) {
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