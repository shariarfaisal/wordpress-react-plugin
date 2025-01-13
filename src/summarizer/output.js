import { MdOutlineContentCopy, MdOutlineFileDownload } from "react-icons/md";
import { useSummarizer } from "./useSummarizer";
import { CiCalendar, CiTextAlignLeft } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react";
import { ImageFallback } from "../utils/image-fallback";
import { copyTextToClipboard, formatNumber, useCompletion } from "../utils";
import { GoClock } from "react-icons/go";
import { parse } from "marked";
import { PiMagicWand } from "react-icons/pi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { CgTranscript } from "react-icons/cg";
import { toast } from "react-toastify";
import CustomPrompts from "./custom-prompts";
import Chat from "./chat";
import Transcript from "./transcript";
import Languages from "./languages";

const Output = () => {
  const { summary, activeTab, setActiveTab, setSummary, title, promptType } =
    useSummarizer();
  const [errMsg, setErrMsg] = useState("");
  const [parsedContent, setParsedContent] = useState("");
  const { completion, setCompletion, isLoading, complete } = useCompletion({
    api: "http://localhost:3000/api/summarize",
    body: {
      id: summary.id,
      source: summary.source,
      prompt_type: promptType,
    },
    onFinish: (prompt, completion) => {
      if (completion) {
        const newSummary = {
          ...summary,
          summary: completion,
          summary_as_md: completion,
        };

        if (promptType) {
          newSummary.custom_prompt_response = completion;
        }

        setSummary(newSummary);
      }
    },
    onError: (err) => {
      let msg = err?.response?.data?.message || err.message;
      console.log(err, msg);
      setErrMsg?.(msg);
    },
  });

  const tabs = [
    {
      name: "content",
      title: "Content",
      icon: CiTextAlignLeft,
    },
    {
      name: "repurpose",
      title: "Repurpose Content",
      icon: PiMagicWand,
    },
    {
      name: "chat",
      title: "Ask Follow-up Questions",
      icon: IoChatbubblesOutline,
    },
    {
      name: "transcript",
      title: "Transcript",
      icon: CgTranscript,
    },
  ];

  useEffect(() => {
    if (summary.custom_prompt_details) {
      if (summary.custom_prompt_details.summary_translated?.summary_as_md) {
        setCompletion(
          summary.custom_prompt_details.summary_translated.summary_as_md
        );
      } else {
        setCompletion(summary.custom_prompt_details.summary_as_md);
      }
    } else if (
      summary.summary_translations &&
      summary.summary_translations.length > 0
    ) {
      setCompletion(summary.summary_translations[0].summary_as_md);
    } else if (!summary.summary && summary.transcript) {
      complete(summary.transcript);
    } else if (
      summary.transcript &&
      promptType &&
      !summary.custom_prompt_response
    ) {
      complete(summary.transcript);
    } else if (!summary.custom_prompt_response_as_html) {
      setCompletion(
        summary.summary_as_md || summary.summary_html || summary.summary
      );
    } else if (summary.custom_prompt_response_as_html) {
      setCompletion(summary.custom_prompt_response_as_html);
    } else if (!summary.transcript) {
      setErrMsg("Transcript not found");
    }
  }, []);

  useEffect(() => {
    if (completion) {
      const parsed = parse(completion);
      if (typeof parsed === "string") {
        setParsedContent(parsed);
      } else {
        parsed.then(setParsedContent);
      }
    }
  }, [completion]);

  const copyHandler = useCallback(() => {
    copyTextToClipboard(completion, () => {
      toast("Copied", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    });
  }, [completion]);

  if (!summary) {
    return null;
  }

  return (
    <div className="output space-y-3">
      {/* tabs */}
      <div className="w-full max-w-full flex flex-row gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-2 h-8 rounded outline-none focus:outline-none border flex gap-2 items-center justify-center text-xs font-medium cursor-pointer ${
                tab.name === activeTab
                  ? "bg-sky-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <tab.icon className="text-lg" />
              <span className="whitespace-nowrap">{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* video info */}
      <div className="py-8 flex gap-3 border-b border-gary-200 ">
        {/* thumbnail */}
        <div className="w-3/12">
          {summary.thumbnail && (
            <img src={summary.thumbnail} alt="" className="w-full rounded-lg" />
          )}
        </div>

        {/* details info */}
        <div className="space-y-2">
          <h2 className="text-xl font-medium">{summary.title}</h2>

          {/* description */}
          <div className="flex flex-row gap-3 text-sm">
            <div className="flex gap-1.5 flex-row items-center">
              <GoClock className="text-lg" />
              <span>{summary.formatted_duration}</span>
            </div>
            <div className="flex gap-1.5 flex-row items-center">
              <CiCalendar className="text-lg" />
              <time dateTime={summary.formatted_published_time}>
                {summary.formatted_published_time}
              </time>
            </div>
          </div>

          {/* channel info */}
          {summary.channel && summary.source === "Youtube" && (
            <div>
              <div className="w-full flex items-center gap-3">
                <ImageFallback
                  src={summary.channel.thumbnail_url}
                  alt=""
                  className="w-7 h-7 rounded-full"
                >
                  <div className="w-7 h-7 rounded-full bg-gray-200"></div>
                </ImageFallback>
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-medium">
                    {summary.channel.title}
                  </h3>
                  <div className="text-gray-500 text-xs font-semibold">
                    {formatNumber(summary.channel.subscriber_count)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* content tab */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
        <button
          onClick={copyHandler}
          className="flex items-center gap-2 text-sm font-medium outline-none focus:outline-none border px-2 h-8 rounded hover:bg-gray-100 transitions-colors"
        >
          <MdOutlineContentCopy />
          <span className="text-xs">Copy</span>
        </button>
        <Languages />
        <button className="ml-auto flex items-center gap-2 text-sm font-medium border px-2 h-8 rounded hover:bg-gray-100 transitions-colors">
          <MdOutlineFileDownload />
          <span>Export PDF</span>
        </button>
      </div>

      {/* content loading */}
      {isLoading && !completion && (
        <div>
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            <span>Generating summary...</span>
          </div>
        </div>
      )}

      {activeTab === "content" && (
        <>
          {errMsg && <div className="text-red-500 text-lg py-4">{errMsg}</div>}

          {completion && (
            <div className={`md:pr-3 prose dark:prose-invert !text-lg pb-10`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: parsedContent,
                }}
              ></div>
            </div>
          )}
        </>
      )}

      <CustomPrompts show={activeTab === "repurpose"} />
      <Chat show={activeTab === "chat"} />
      {activeTab === "transcript" && <Transcript />}
    </div>
  );
};

export default Output;
