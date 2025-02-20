import React, { useState, useRef } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function SuggestedVideos({ videos, onVideoClick }) {
  const scrollContainerRef = useRef(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);

  const handleScroll = (e) => {
    const container = e.target;
    const isAtStart = container.scrollLeft === 0;
    const isAtEnd =
      container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

    setShowLeftShadow(!isAtStart);
    setShowRightShadow(!isAtEnd);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust this value to control scroll distance
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getYouTubeVideoId = (url) => {
    try {
      const videoUrl = new URL(url);
      if (videoUrl.hostname === "youtu.be") {
        return videoUrl.pathname.slice(1);
      }
      return videoUrl.searchParams.get("v");
    } catch (error) {
      return "";
    }
  };

  if (!videos || videos.length === 0) return null;

  return (
    <div className="suggested-videos">
      <p className="suggested-title">Suggested YouTube Videos</p>
      <div className="relative">
        {showLeftShadow && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <IoChevronBack className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}
        {showRightShadow && (
          <>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <IoChevronForward className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 no-scrollbar relative scroll-smooth"
          onScroll={handleScroll}
        >
          {videos.map((url, index) => (
            <div
              key={index}
              className="flex-none w-[260px] h-[146px] cursor-pointer transition-shadow duration-300 hover:shadow-xl relative"
              onClick={() => onVideoClick(url)}
            >
              <div className="absolute inset-0 z-10" />
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                  url
                )}?controls=0`}
                title={`Suggested Video ${index + 1}`}
                frameBorder="0"
                className="rounded-lg shadow-md pointer-events-none"
              ></iframe>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
