import { useCallback, useRef, useState } from "react";

const NEWLINE = "\n".charCodeAt(0);

const textStreamPart = {
  code: "0",
  name: "text",
  parse: (value) => {
    if (typeof value !== "string") {
      throw new Error('"text" parts expect a string value.');
    }
    return { type: "text", value };
  },
};

const streamParts = [textStreamPart];

export const streamPartsByCode = {
  [textStreamPart.code]: textStreamPart,
};

export const validCodes = streamParts.map((part) => part.code);

// Concatenates all the chunks into a single Uint8Array
function concatChunks(chunks, totalLength) {
  const concatenatedChunks = new Uint8Array(totalLength);

  let offset = 0;
  for (const chunk of chunks) {
    concatenatedChunks.set(chunk, offset);
    offset += chunk.length;
  }
  chunks.length = 0;

  return concatenatedChunks;
}

export async function* readDataStream(reader, { isAborted } = {}) {
  const decoder = new TextDecoder();
  const chunks = [];
  let totalLength = 0;

  while (true) {
    const { value } = await reader.read();

    if (value) {
      chunks.push(value);
      totalLength += value.length;
      if (value[value.length - 1] !== NEWLINE) {
        // If the last character is not a newline, we have not read the whole JSON value
        continue;
      }
    }

    if (chunks.length === 0) {
      break; // We have reached the end of the stream
    }

    const concatenatedChunks = concatChunks(chunks, totalLength);
    totalLength = 0;

    const streamParts = decoder
      .decode(concatenatedChunks, { stream: true })
      .split("\n")
      .filter((line) => line !== "")
      .map((line) => {
        const firstSeparatorIndex = line.indexOf(":");

        if (firstSeparatorIndex === -1) {
          throw new Error("Failed to parse stream string. No separator found.");
        }

        const prefix = line.slice(0, firstSeparatorIndex);

        if (!validCodes.includes(prefix)) {
          throw new Error(
            `Failed to parse stream string. Invalid code ${prefix}.`
          );
        }

        const code = prefix;

        const textValue = line.slice(firstSeparatorIndex + 1);
        const jsonValue = JSON.parse(textValue);

        return streamPartsByCode[code].parse(jsonValue);
      });

    for (const streamPart of streamParts) {
      yield streamPart;
    }

    // The request has been aborted, stop reading the stream.
    if (isAborted?.()) {
      reader.cancel();
      break;
    }
  }
}

export default function useChat({ api, onResponse, onFinish, onError, body }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const abortControllerRef = useRef(null);

  // Handler to trigger stream reading and processing
  const handleStreamResponse = useCallback(
    async (response) => {
      const reader = response.body.getReader();
      const id = Date.now().toString();
      const streamGenerator = readDataStream(reader, {
        isAborted: () => abortControllerRef.current?.signal.aborted,
      });
      let chunks = "";

      try {
        for await (const part of streamGenerator) {
          switch (part.type) {
            case "text":
              chunks += part.value;
              setMessages((messages) => {
                const msg = messages.find((m) => m.id === id);
                if (msg) {
                  msg.content += part.value;
                } else {
                  messages.push({
                    id,
                    content: part.value,
                    role: "assistant",
                  });
                }
                return messages;
              });
              break;
          }
        }

        if (onResponse) {
          onResponse(chunks);
        }
      } catch (e) {
        onError(e);
      }
    },
    [onResponse, onError]
  );

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = useCallback(
    (e, params) => {
      e.preventDefault();
      if (!input) {
        return;
      }

      let newMessages = messages.concat({
        id: Date.now().toString(),
        content: input,
        role: "user",
      });

      const payloads = {
        api_key: body.api_key,
        auth_token: body.auth_token,
        id: body.id,
        message: input,
        messages: newMessages,
        source: body.source,
      };

      if (params?.input) {
        payloads.message = params.input;
      }
      if (params?.messages) {
        payloads.messages = params.messages;
        setMessages([...params.messages]);
      } else {
        setMessages(newMessages);
      }

      setInput("");

      fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloads),
      })
        .then(async (res) => {
          if (res.ok) {
            try {
              await handleStreamResponse(res);
            } catch (err) {
              console.log(err);
            }
          }
        })
        .catch((err) => {
          onError(err);
        });
    },
    [body, input, messages, onResponse, onError]
  );

  return {
    messages,
    setMessages,
    input,
    setInput,
    handleSubmit,
    handleInputChange,
  };
}
