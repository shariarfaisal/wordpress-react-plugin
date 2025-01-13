import { useCallback, useRef, useState } from "react";
import { readDataStream } from "./use-chat";

export const useCompletion = ({ api, body, onFinish, onError }) => {
  const [completion, setCompletion] = useState("");
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);

  const handleStreamResponse = useCallback(
    async (response) => {
      const reader = response.body.getReader();
      const streamGenerator = readDataStream(reader, {
        isAborted: () => abortControllerRef.current?.signal.aborted,
      });
      let chunks = "";

      try {
        for await (const part of streamGenerator) {
          switch (part.type) {
            case "text":
              chunks += part.value;
              setCompletion(chunks);
              break;
          }
        }

        if (onFinish) {
          onFinish(prompt, chunks);
        }
      } catch (e) {
        onError(e);
        setError(e);
      }
    },
    [onFinish, onError, prompt]
  );

  const complete = useCallback(async (prompt, payloads = {}) => {
    setPrompt(prompt);
    setLoading(true);
    console.log("called complete", prompt, payloads);

    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "no-cors", // This is fine for simple, no-response-required requests
      body: JSON.stringify({ ...body, prompt, ...payloads }),
    })
      .then(async (res) => {
        try {
          await handleStreamResponse(res);
        } catch (err) {
          onError(err);
        }
        if (res.ok) {
        } else {
          throw new Error(
            `Request failed with status ${res.status}: ${res.statusText}`
          );
        }
      })
      .catch((err) => {
        onError(err);
        setError(err);
      });
  }, []);

  return {
    completion,
    setCompletion,
    loading,
    complete,
    error,
  };
};
