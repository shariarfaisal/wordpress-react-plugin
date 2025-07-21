import "./frontend.scss";
import React, { useEffect, forwardRef } from "react";
import ReactDOM from "react-dom/client";
import { UrlSummarizer, FileSummarizer, TextSummarizer } from "./summarizer";
import { useSummarizer } from "./summarizer/useSummarizer";
import Output from "./summarizer/output";
import { ToastContainer } from "react-toastify";
import LimitModal from "./summarizer/limit-modal";
import SuggestedVideos from "./components/SuggestedVideos";
import { BiCheck } from "react-icons/bi";
import { GoCheckCircleFill } from "react-icons/go";

const divsToUpdate = document.querySelectorAll(".boilerplate-update-me");

divsToUpdate.forEach((div) => {
  const data = JSON.parse(div.querySelector("pre").innerText);
  const root = ReactDOM.createRoot(div);
  root.render(<OurComponent {...data} />);
  div.classList.remove("boilerplate-update-me");
});

function OurComponent({
  summarizerType,
  youtubeUrls,
  buttonName,
  toolTitle,
  placeholder,
}) {
  const { summary, setSummary, setType, setPromptType } = useSummarizer();
  const urlSummarizerRef = React.useRef();
  const url = new URL(window.location.href);

  useEffect(() => {
    const pathname = url.pathname.replaceAll("/", "");
    if (pathname) {
      setPromptType(pathname);
    }
  }, []);

  useEffect(() => {
    setType(summarizerType);
  }, [summarizerType]);

  const handleVideoClick = (videoUrl) => {
    if (urlSummarizerRef.current) {
      urlSummarizerRef.current.summarizeUrl(videoUrl);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className="summarizer">
      <ToastContainer />
      <div>
        <div className="!border rounded-lg p-4 pr-1  space-y-3 bg-white">
          {!summary && (
            <>
              <p className="text-lg font-medium text-gray-800 mb-3">
                {toolTitle}
              </p>
              <Summarizer
                type={summarizerType}
                ref={urlSummarizerRef}
                buttonName={buttonName}
                placeholder={placeholder}
              />
            </>
          )}
          {summary && summary.captions && <Output />}
          {summary && !summary.captions && summary.error_text && (
            <div className="flex justify-between items-center gap-4 pr-3">
              <div className="text-red-500">{summary.error_text}</div>
              <button 
              onClick={() => {
                setSummary(null);
              }} className="bg-sky-500 text-white hover:bg-sky-600 transition-all duration-300 px-4 py-2 rounded-md whitespace-nowrap text-sm">
                Try Another
              </button>
            </div>
          )}
          <LimitModal />
        </div>
        {/* <div className="rounded-t-none rounded-b-lg w-full flex flex-col sm:!flex-row sm:items-center sm:justify-between gap-4 bg-[#222222] text-white p-4">
          <div className="space-y-2 sm:max-w-[calc(100%-200px)]">
            <p className="text-base font-medium">Generate Unlimited Summaries & Content For Free</p>
            <div className="flex items-center flex-row overflow-scroll no-scrollbar gap-3 text-xs md:!text-sm">
              <div className="flex items-center gap-2">
                <GoCheckCircleFill className="text-green-500" />
                <p className="whitespace-nowrap">Summarize Anything</p>
              </div>
              <div className="flex items-center gap-2">
                <GoCheckCircleFill className="text-green-500" />
                <p className="whitespace-nowrap">Unlimited Transcription</p>
              </div>
              <div className="flex items-center gap-2">
                <GoCheckCircleFill className="text-green-500" />
                <p className="whitespace-nowrap">Unlimited Content Generation</p>
              </div>
            </div>  
          </div>
          <a className="mx-auto sm:!mx-0 sm:!ml-auto" href="https://web.tubeonai.com/summary?buy_now_package=48">
            <button className="bg-white text-black hover:bg-gray-200 transition-all duration-300 px-4 py-2 rounded-md whitespace-nowrap text-sm">
            Start Free Trial
            </button>
          </a>
        </div> */}
      </div>

      {youtubeUrls && youtubeUrls.length > 0 && summarizerType === "url" && (
        <SuggestedVideos videos={youtubeUrls} onVideoClick={handleVideoClick} />
      )}
    </div>
  );
}

const Summarizer = forwardRef(({ type, buttonName, placeholder }, ref) => {
  switch (type) {
    case "url":
      return (
        <UrlSummarizer
          ref={ref}
          buttonName={buttonName}
          placeholder={placeholder}
        />
      );
    case "file":
      return <FileSummarizer ref={ref} buttonName={buttonName} />;
    case "text":
      return (
        <TextSummarizer
          ref={ref}
          buttonName={buttonName}
          placeholder={placeholder}
        />
      );
    default:
      return (
        <TextSummarizer
          ref={ref}
          buttonName={buttonName}
          placeholder={placeholder}
        />
      );
  }
});
