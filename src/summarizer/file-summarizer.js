import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { useSummarizer } from "./useSummarizer";
import {
  FaFileAlt,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileVideo,
} from "react-icons/fa";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdOutlineAudioFile } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "../utils";
import { useDropzone } from "react-dropzone";
import { CiWarning } from "react-icons/ci";
import { VscLoading } from "react-icons/vsc";

const types = {
  "application/pdf": <FaFilePdf />,
  "application/msword": <RiFileExcel2Fill />,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
    <RiFileExcel2Fill />
  ),
  "text/plain": <FaFileAlt />,
  "application/vnd.ms-powerpoint": <FaFilePowerpoint />,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": (
    <FaFilePowerpoint />
  ),
  "audio/mpeg": <MdOutlineAudioFile />,
  "video/mp4": <FaFileVideo />,
};

function FileIcon({ type }) {
  if (types[type]) {
    return types[type];
  }

  return <FaFileAlt />;
}

function FileType({ type }) {
  switch (type) {
    case "application/pdf":
      return "PDF";
    case "application/msword":
      return "Word";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "Word";
    case "text/plain":
      return "Text";
    case "application/vnd.ms-powerpoint":
      return "Powerpoint";
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "Powerpoint";
    case "audio/mpeg":
      return "Audio";
    case "video/mp4":
      return "Video";
    default:
      return "File";
  }
}

function Progress({ progress = 0, className }) {
  return (
    <div
      className={`w-10 h-10 flex items-center justify-center text-gray-600 text-sm font-medium ${className}`}
    >
      {progress}%
    </div>
  );
}

export const FileSummarizer = () => {
  const { prompt_type } = useSummarizer();
  const [file, setFile] = useState();
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const { setSummary, backendBaseUrl } = useSummarizer();

  const uploadToS3 = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(
        `${backendBaseUrl}/api/get-presigned-url-for-free-users`,
        {
          file_name: file.name,
          file_type: file.type,
        }
      );

      if (!data.url?.url) {
        throw new Error("Failed to upload file");
      }

      await axios({
        url: data.url.url,
        method: "put",
        data: file,
        headers: { "Content-Type": file.type },
        timeout: 10 * 60 * 1000,
        onUploadProgress: (progress) => {
          setUploadProgress(
            Math.round((progress.loaded / (progress.total || 1)) * 100)
          );
        },
      });

      const actualUrl = data.url.url.split("?")[0];
      setUploadedUrl(actualUrl);
    },
  });

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    newFile(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: ".pdf,.doc,.docx,.txt,.pptx,.mp3,.mp4",
  });

  const newFile = (file) => {
    const ext = file?.name.split(".").pop();

    const sizeLimit = {
      audio: {
        type: "Audio",
        ext: ["mp3"],
        size: 100 * 1024 * 1024,
        size_txt: "100MB",
      },
      video: {
        type: "Video",
        ext: ["mp4"],
        size: 100 * 1024 * 1024,
        size_txt: "100MB",
      },
      document: {
        type: "Document",
        ext: ["pdf", "doc", "docx", "txt"],
        size: 50 * 1024 * 1024,
        size_txt: "50MB",
      },
    };

    if (file) {
      // check file size
      const limitError = Object.entries(sizeLimit).find(([key, value]) => {
        if (value.ext.includes(ext) && file.size > value.size) {
          setErrMsg(`File size must be less than ${value.size_txt}!`);
          return true;
        }
      });

      if (!limitError) {
        setFile(file);
        uploadToS3.mutate(file);
        setTitle(file.name);
      }
    }
  };

  const summarize = useCallback(
    async ({ email, prompt_type, title }) => {
      try {
        if (!uploadedUrl || !file) {
          return;
        }

        const extension = file.name.split(".").pop() || "pdf";
        let source = "pdf"; // "webpage" | "video" | "audio" | "pptx" | "document" | "pdf"
        if (["ppt", "pptx"].includes(extension)) {
          source = "pptx";
        } else if (["mp3"].includes(extension)) {
          source = "audio";
        } else if (["pdf"].includes(extension)) {
          source = "pdf";
        } else if (["doc", "docx", "txt"].includes(extension)) {
          source = "document";
        } else if (["mp4", "webp"].includes(extension)) {
          source = "video";
        }

        setLoading(true);
        const { data } = await axios.post(
          "https://dev-api.tubeonai.com/api/summarize",
          {
            link_or_id: uploadedUrl,
            title,
            email,
            prompt_type,
            source,
            extension,
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
    [uploadedUrl, file]
  );

  const submitHandler = useCallback(() => {
    if (!email) {
      setErrMsg("Please enter your email");
      return;
    }
    summarize({
      email,
      prompt_type,
      title,
    });
  }, [email, prompt_type, title]);

  const closeFile = () => {
    setFile(null);
    setUploadedUrl("");
    setUploadProgress(0);
    setErrMsg("");
  };

  return (
    <div className="summarizer-text space-y-3">
      {errMsg && (
        <p className="text-lg bg-red-200 text-red-600 p-3 rounded-lg font-normal">
          {errMsg}
        </p>
      )}

      {
        <div
          {...getRootProps()}
          className="border-dashed rounded-lg min-h-[200px] flex flex-col items-center justify-center border-2 p-4 cursor-pointer focus:outline-none outline-none"
        >
          <input {...getInputProps()} />

          <div>
            <p className="text-center text-xl font-semibold">
              Drag & drop a file here, or click to select a file
            </p>
            <p className="text-center text-gray-600">
              PDF, Doc, Docx, Txt, Pptx, Mp3, Mp4
            </p>
            <div className="text-center mt-3">
              <button className="h-8 px-4 bg-sky-500 text-white rounded-lg">
                Add a file
              </button>
            </div>
          </div>
        </div>
      }

      {file && (
        <div className="flex items-center  mb-2">
          <div className="w-full relative flex items-center gap-2 p-2 pr-4 rounded-lg border bg-slate-50">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-lg border text-xl ${
                uploadProgress === 100
                  ? "bg-pink-600 text-white"
                  : "bg-slate-100"
              }`}
            >
              {errMsg ? (
                <CiWarning className="text-xl" />
              ) : uploadProgress === 100 ? (
                <FileIcon type={file.type} />
              ) : (
                <Progress percent={uploadProgress} />
              )}
            </div>
            <div>
              <p className="text-sm font-medium truncate w-full">{file.name}</p>
              <p className="text-xs font-medium text-slate-400">
                {FileType({ type: file.type })}{" "}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <span className="ml-1">Uploading...</span>
                )}
              </p>
            </div>
            <button
              onClick={closeFile}
              className="flex-center absolute top-0 right-0 mt-[-8px] mr-[-8px] w-5 h-5 rounded-full  bg-slate-100 hover:bg-slate-200 transition-all duration-200 border border-slate-300"
            >
              <IoMdClose />
            </button>
          </div>
        </div>
      )}
      {file && (
        <input
          className="w-full px-3 py-2 focus:outline-none rounded-lg bg-slate-100 border"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      )}
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
            <p className="text-sm text-yellow-600">
              Share email to get summary in your inbox
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={submitHandler}
            disabled={!uploadedUrl}
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
