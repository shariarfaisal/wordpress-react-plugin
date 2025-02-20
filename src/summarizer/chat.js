import { useMemo } from "react";
import { useSummarizer } from "./useSummarizer";
import { IoArrowUp } from "react-icons/io5";
import { SignInContent } from "./limit-modal";

export default function Chat({ show }) {
  const { setLimitOpen, summary } = useSummarizer();

  const questions = [
    {
      title: "Generate some quiz question.",
    },
    {
      title:
        "Who is the creator of this video? Tell me more about the creator life.",
    },
    {
      title: "Can you find some key point?",
    },
    {
      title: "Explain TED's Historical Optimism in Technology.",
    },
  ];

  const placeholder = useMemo(() => {
    let topic = "video";
    if (summary?.source && !["Youtube", "Podcast"].includes(summary?.source)) {
      topic = summary?.source;
    }

    let text = `What do you want to ask about this ${topic}?`;
    return text;
  }, [summary?.source]);

  if (!show) {
    return null;
  }
  return (
    <div className="flex flex-col gap-5">
      <SignInContent />
      <div className="">
        <div className="flex flex-col items-center gap-3 px-5 py-10 min-h-[200px]">
          <div className="w-full grid grid-cols-2 gap-3 mt-auto">
            {questions.map((q, i) => {
              return (
                <p
                  key={i}
                  className="md:min-h-[70px] flex items-center justify-center rounded-lg gap-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border dark:border-slate-700  cursor-pointer text-sm lg:text-lg font-medium px-5 py-1.5 text-center"
                  onClick={() => {
                    setLimitOpen(true);
                  }}
                >
                  <span className="max-w-[350px]">{q.title}</span>
                </p>
              );
            })}
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLimitOpen(true);
          }}
          className="flex items-center gap-3 h-16 px-3 pr-5 bg-slate-100 border border-slate-200 rounded-full"
        >
          <input
            placeholder={placeholder}
            className="w-full h-8 px-3 outline-none text-base bg-transparent"
          />
          <button
            type="submit"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-500 text-white hover:bg-brand-primary-light transition-all duration-200 ease-in-out"
          >
            <IoArrowUp />
          </button>
        </form>
      </div>
    </div>
  );
}
