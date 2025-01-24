import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { useSummarizer } from "./useSummarizer";
import { VscLoading } from "react-icons/vsc";

export const UrlSummarizer = () => {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSummary, backendBaseUrl } = useSummarizer();

  const summarize = useCallback(
    async ({ link, email, prompt_type, source }) => {
      if (!email) {
        setErrMsg("Please enter your email");
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.post(`${backendBaseUrl}/api/summarize`, {
          link_or_id: link,
          email,
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
        <div className="flex flex-col gap-2 sm:!flex-row justify-between">
          <div className="flex items-start gap-2 w-full">
            <a
              className="flex flex-row gap-1.5 bg-sky-200 p-2 rounded-lg text-sm"
              href={`${webAppBaseUrl}/login`}
            >
              <span className="font-medium">Free</span>
              <span className="font-semibold text-sky-600 uppercase">
                Trial
              </span>
            </a>
            <div className="space-y-2 w-full md:max-w-[250px]">
              <input
                className="w-full h-10 focus:outline-none rounded-lg text-base border  p-3"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
              {emailErr && <p className="text-red-500 text-sm">*{emailErr}</p>}
              <p className="text-sm text-yellow-600">
                Share email to get summary in your inbox
              </p>
            </div>
          </div>
          <div className="w-full sm:!w-[140px]">
            <button
              onClick={submitHandler}
              disabled={!isValidUrl}
              className="w-full px-4 py-2 h-10 flex items-center justify-center gap-2 rounded-xl disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-white bg-sky-600 hover:bg-sky-500 text-white transition-colors duration-200 text-sm font-medium"
            >
              {loading ? (
                <>
                  <VscLoading className="animate-spin" />
                  <span className="ml-2">Processing</span>
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
