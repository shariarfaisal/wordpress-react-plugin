import { useCallback } from "react";
import { useSummarizer } from "./useSummarizer";
import { BiCopy } from "react-icons/bi";
import { toast } from "react-toastify";
import { copyTextToClipboard } from "../utils";

export default function Transcript() {
  const { summary } = useSummarizer();

  const copyHandler = useCallback(() => {
    copyTextToClipboard(summary.captions, () => {
      toast("Copied", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        style: {
          width: "150px",
        },
      });
    });
  }, [summary.captions]);

  if (!summary) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={copyHandler}
        className="absolute right-0 top-0 mt-3 mr-3 border bg-transparent hover:bg-gray-200 rounded-lg w-10 h-10 outline-none focus:outline-none flex items-center justify-center text-xl"
      >
        <BiCopy />
      </button>
      <div
        className="h-full scroll-y"
        dangerouslySetInnerHTML={{
          __html: `<pre class="whitespace-pre-wrap">${summary.captions}</pre>`,
        }}
      ></div>
    </div>
  );
}
