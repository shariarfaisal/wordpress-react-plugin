import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { useSummarizer } from "./useSummarizer";

export const UrlSummarizer = () => {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSummary } = useSummarizer();

  const summarize = useCallback(
    async ({ link, email, prompt_type, source }) => {
      try {
        setLoading(true);
        const { data } = await axios.post(
          "https://api.tubeonai.com/api/summarize",
          {
            link_or_id: link,
            email,
            prompt_type,
            source,
          }
        );

        if (!data.success) {
          setErrMsg(data.message);
        } else {
          setErrMsg("");
          setSummary(data.video);
          console.log(data.video);
        }
      } catch (err) {
        const msg = err?.response?.data?.message || err.message;
        setErrMsg(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
      email,
      // prompt_type: "blog-post-generator",
      source: "url",
    });
  };

  return (
    <>
      <div className="summarizer-url space-y-3">
        {errMsg && (
          <p className="text-lg bg-red-200 text-red-600 p-3 rounded-lg font-normal">
            {errMsg}
          </p>
        )}
        <div>
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste URL here"
            className="w-full min-h-16 focus:outline-none rounded-xl border-none bg-slate-100 p-3 no-scrollbar"
          ></textarea>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-start gap-2">
            <a
              className="flex flex-row gap-1.5 bg-sky-200 p-2 rounded-lg text-sm"
              href=""
            >
              <span className="font-medium">Free</span>
              <span className="font-semibold text-sky-600 uppercase">
                Trial
              </span>
            </a>
            <div className="space-y-2">
              <input
                className="w-full h-10 focus:outline-none rounded-lg text-base border  p-3"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
              <p className="text-sm text-yellow-600">
                Share email to get summary in your inbox
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={submitHandler}
              disabled={!isValidUrl}
              className="px-4 py-2 h-10 rounded-xl disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-white bg-sky-600 hover:bg-sky-500 text-white transition-colors duration-200"
            >
              {loading ? "Loading..." : "Generate"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
