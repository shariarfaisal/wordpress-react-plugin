import axios from "axios";
import { forwardRef, useCallback, useState } from "react";
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
import { BsStars } from "react-icons/bs";

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

export const FileSummarizer = forwardRef(
  ({
    buttonName = "Generate",
    placeholder = "Drag & drop a file here, or click to select a file",
  }) => {
    const { prompt_type } = useSummarizer();
    const [file, setFile] = useState();
    const [title, setTitle] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedUrl, setUploadedUrl] = useState("");
    const { setSummary, backendBaseUrl, webAppBaseUrl, setLimitOpen, setErrMsg: setGlobalErrMsg } = useSummarizer();

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
      async ({ prompt_type, title }) => {
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
          const { data } = await axios.post(`${backendBaseUrl}/api/v2/public/summarize`, {
            link_or_id: uploadedUrl,
            title,
            prompt_type,
            source,
            extension,
          });

          if (!data.success) {
            setErrMsg(data.message);
          } else {
            setErrMsg("");
            setSummary(data.video);
            console.log(data.video);
          }
        } catch (err) {
          console.log(err.response.data);
          const msg =
            err?.response?.data?.message || err?.response?.data || err.message;
          setErrMsg(msg);
          setLimitOpen(true);
          setGlobalErrMsg(msg);
        } finally {
          setLoading(false);
        }
      },
      [uploadedUrl, file]
    );

    const submitHandler = useCallback(() => {
      summarize({
        prompt_type,
        title,
      });
    }, [prompt_type, title, summarize]);

    const closeFile = () => {
      setFile(null);
      setUploadedUrl("");
      setUploadProgress(0);
      setErrMsg("");
    };

    return (
      <div className="summarizer-text space-y-3 pr-3">
        {errMsg && (
          <p className="text-lg bg-red-200 text-red-600 p-3 rounded-lg font-normal">
            {errMsg}
          </p>
        )}

        {!file && (
          <div
            {...getRootProps()}
            className="border-dashed rounded-lg min-h-[200px] flex flex-col items-center justify-center border-2 p-4 cursor-pointer focus:outline-none outline-none"
          >
            <input {...getInputProps()} />

            <div>
              <p className="text-center text-xl font-semibold">{placeholder}</p>
              <p className="text-center text-gray-600">
                PDF, Doc, Docx, Txt, Pptx, Mp3, Mp4
              </p>
              <div className="text-center mt-3">
                <button className="h-8 px-4 bg-sky-500 text-white rounded-lg text-sm">
                  Add a file
                </button>
              </div>
            </div>
          </div>
        )}

        {file && (
          <div className="flex items-center">
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
                <p className="text-sm font-medium truncate w-full">
                  {file.name}
                </p>
                <p className="text-xs font-medium text-slate-400">
                  {FileType({ type: file.type })}{" "}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <span className="ml-1">Uploading...</span>
                  )}
                </p>
              </div>
              <button
                onClick={closeFile}
                className="flex items-center justify-center absolute top-0 right-0 mt-[-8px] mr-[-8px] w-7 h-7 rounded-full  bg-slate-100 hover:bg-slate-200 transition-all duration-200 border border-slate-300"
              >
                <IoMdClose />
              </button>
            </div>
          </div>
        )}
        {file && (
          <input
            className="w-full px-3 py-2 focus:outline-none rounded-lg bg-slate-100 border text-sm"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}
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
            <div className="flex-1">
              <button
                onClick={submitHandler}
                disabled={!uploadedUrl}
                className="w-full ml-auto md:!w-auto px-3 md:!px-6 py-2 h-10 flex items-center justify-center gap-2 rounded-lg disabled:bg-[#BDBDBD] disabled:cursor-not-allowed disabled:text-white bg-[#2196F3] hover:bg-[#2196F3]/80 text-white transition-colors duration-200 text-sm font-medium whitespace-nowrap"
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
      </div>
    );
  }
);
