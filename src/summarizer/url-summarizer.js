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


export const UrlSummarizer = forwardRef(
  (
    { buttonName = "Generate", placeholder = "Paste YouTube URL here" },
    ref
  ) => {
    const [url, setUrl] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const { setSummary, backendBaseUrl, setLimitOpen, setErrMsg: setGlobalErrMsg } =
      useSummarizer();


    const summarize = useCallback(
      async ({ link, prompt_type, source }) => {
        try {
          setLoading(true);
          const { data } = await axios.post(`${backendBaseUrl}/api/v2/public/summarize`, {
            link_or_id: link,
            prompt_type,
            source,
          });

          if (!data.success) {
            setErrMsg(data.message);
            setLimitOpen(true);
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

    // Expose summarizeUrl method through ref
    useImperativeHandle(ref, () => ({
      summarizeUrl: (videoUrl) => {
        setUrl(videoUrl);
        summarize({
          link: videoUrl,
          source: "url",
        });
      },
    }));

    const isValidUrl = useMemo(() => {
      try {
        new URL(url);
        return true;
      } catch (err) {
        return false;
      }
    }, [url]);

    const submitHandler = () => {
      summarize({
        link: url,
        source: "url",
      });
    };

    return (
      <>
        <div className="summarizer-url space-y-3 pr-3">
          {errMsg && (
            <p className="text-lg bg-red-200 text-red-600 p-3 rounded-lg font-normal">
              {errMsg}
            </p>
          )}
          <div className="relative">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholder}
              className="w-full font-medium border border-gray-200 text-sm md:text-base h-12 placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-base focus:outline-none rounded-lg bg-slate-100 px-4 py-2"
            />
            <div className="absolute top-0 right-0 p-2">
              <button
                onClick={submitHandler}
                disabled={!isValidUrl}
                className=" h-8 px-2 flex items-center justify-center gap-2 rounded-lg disabled:bg-[#BDBDBD] disabled:cursor-not-allowed disabled:text-white bg-[#2196F3] hover:bg-[#2196F3]/80 text-white transition-colors duration-200 text-sm font-medium whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <VscLoading className="animate-spin" />
                    <span className="ml-2">Processing</span>
                  </>
                ) : (
                  <>
                    <BsStars />
                    <span className="text-xs sm:text-base">{buttonName}</span>
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
