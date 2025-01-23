import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { useSummarizer } from "./useSummarizer";
import { VscLoading } from "react-icons/vsc";

export const TextSummarizer = () => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSummary } = useSummarizer();

  const summarize = useCallback(async ({ title, text, email, source }) => {
    try {
      if (!email) {
        setEmailErr("Email is required");
        return;
      }

      setLoading(true);
      const { data } = await axios.post(
        "https://dev-api.tubeonai.com/api/summarize",
        {
          title,
          text,
          email,
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
  }, []);

  const submitHandler = () => {
    summarize({
      link: "",
      text: text,
      title,
      email,
      source: "url",
    });
  };

  return (
    <div className="summarizer-text space-y-3">
      {errMsg && (
        <p className="text-lg bg-red-200 text-red-600 p-3 rounded-lg font-normal">
          {errMsg}
        </p>
      )}
      <div className="space-y-2">
        <input
          className="w-full text-sm font-medium px-3 py-2 focus:outline-none rounded-lg bg-slate-100"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste Text here"
          className="w-full text-base font-medium min-h-16 focus:outline-none rounded-xl border-none bg-slate-100 p-3 no-scrollbar"
        ></textarea>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-start gap-2">
          <a
            className="flex flex-row gap-1.5 bg-sky-200 p-2 rounded-lg text-sm"
            href=""
          >
            <span className="font-medium">Free</span>
            <span className="font-semibold text-sky-600 uppercase">Trial</span>
          </a>
          <div className="space-y-2">
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
        <div>
          <button
            onClick={submitHandler}
            disabled={!text}
            className="px-4 py-2 h-10 flex items-center gap-2 rounded-xl disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-white bg-sky-600 hover:bg-sky-500 text-white transition-colors duration-200 text-sm font-medium"
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
  );
};
