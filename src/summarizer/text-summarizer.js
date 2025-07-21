import axios from "axios";
import {
  useCallback,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { useSummarizer } from "./useSummarizer";
import { VscLoading } from "react-icons/vsc";
import { BsStars } from "react-icons/bs";

export const TextSummarizer = forwardRef(
  (
    { buttonName = "Generate", placeholder = "Enter text to summarize" },
    ref
  ) => {
    const [text, setText] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const { setSummary, backendBaseUrl, webAppBaseUrl, setLimitOpen, setErrMsg: setGlobalErrMsg } = useSummarizer();


    const summarize = useCallback(
      async ({ text, prompt_type, source }) => {
        try {
          setLoading(true);
          const { data } = await axios.post(`${backendBaseUrl}/api/v2/public/summarize`, {
            text,
            prompt_type,
            source,
          });

          if (!data.success) {
            setErrMsg(data.message);
          } else {
            setErrMsg("");
            setSummary(data.video);
          }
        } catch (err) {
          const msg =
            err?.response?.data?.message || err?.response?.data || err.message;
          setErrMsg(msg);
          setLimitOpen(true);
          setGlobalErrMsg(msg);
        } finally {
          setLoading(false);
        }
      },
      []
    );

    useImperativeHandle(ref, () => ({
      summarizeText: (textContent) => {
        setText(textContent);
        summarize({
          text: textContent,
          source: "text",
        });
      },
    }));

    const isValidText = useMemo(() => {
      return text.trim().length > 0;
    }, [text]);

    const submitHandler = () => {
      summarize({
        text,
        source: "text",
      });
    };

    return (
      <>
        <div className="summarizer-text space-y-2 pr-3">
          {errMsg && (
            <p className="text-lg bg-red-200 text-red-600 p-3 rounded-lg font-normal">
              {errMsg}
            </p>
          )}
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              className="w-full min-h-16 text-sm md:text-base focus:outline-none rounded-xl border-none bg-slate-100 p-3 no-scrollbar"
            ></textarea>
          </div>
          <div className="flex flex-col gap-2 sm:!flex-row justify-between">
            <div className="flex items-center justify-between gap-2 w-full">
              <a
                className="flex flex-row gap-1.5 bg-sky-200 p-2 rounded-lg text-sm"
                href={`${webAppBaseUrl}/login`}
              >
                <span className="font-medium">Free</span>
                <span className="font-semibold text-sky-600 uppercase">
                  Trial
                </span>
              </a>
              <button
                onClick={submitHandler}
                disabled={!isValidText}
                className="w-full md:!w-auto px-3 md:!px-6 py-2 h-10 flex items-center justify-center gap-2 rounded-lg disabled:bg-[#BDBDBD] disabled:cursor-not-allowed disabled:text-white bg-[#2196F3] hover:bg-[#2196F3]/80 text-white transition-colors duration-200 text-sm font-medium whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <VscLoading className="animate-spin" />
                    <span className="ml-2">Processing</span>
                  </>
                ) : (
                  <>
                    <BsStars />
                    {buttonName}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
);
