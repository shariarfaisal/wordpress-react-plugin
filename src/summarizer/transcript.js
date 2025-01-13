import { useSummarizer } from "./useSummarizer";

export default function Transcript() {
  const { summary } = useSummarizer();

  if (!summary) {
    return null;
  }

  return (
    <div
      className="h-full scroll-y"
      dangerouslySetInnerHTML={{
        __html: `<pre class="whitespace-pre-wrap">${summary.transcript}</pre>`,
      }}
    ></div>
  );
}
