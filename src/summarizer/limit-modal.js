import Modal from "react-modal";
import Alert from "../utils/alert";
import { useSummarizer } from "./useSummarizer";
import { IoMdClose } from "react-icons/io";

Modal.setAppElement("body");

export default function LimitModal() {
  const { limitOpen, setLimitOpen, errMsg } = useSummarizer();

  return (
    <Modal
      isOpen={limitOpen}
      close={() => setLimitOpen(false)}
      className={"limit-modal"}
      style={{
        overlay: {
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0, 0, 0.2)",
          zIndex: 99,
          backdropFilter: "blur(5px)",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        },
        content: {
          position: "relative",
          inset: 0,
          margin: "auto",
          border: "none",
          borderRadius: "10px",
          padding: 0,
          background: "white",
          outline: "none",
          width: "37.5rem",
          maxWidth: "100%",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
      title="Create an Account!"
    >
      <div className="relative">
        <button
          onClick={() => setLimitOpen(false)}
          className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center hover:bg-gray-200 rounded-full "
        >
          <IoMdClose className="text-lg" />
        </button>
        <div className="w-full flex flex-col gap-3 p-5 text-center">
          {errMsg && (
            <Alert
              message={errMsg}
              type="error"
              style={{ borderRadius: "0" }}
            />
          )}
          <h1 className="text-2xl md:text-3xl font-lora font-semibold">
            Enjoy Free Trial! 🚀
          </h1>
          <p className="text-sm text-slate-600 dark:text-gray-400">
            To access all premium features, please log in or create a free
            account and enjoy a free trial!
          </p>
          <div className="w-full flex justify-center">
            <a href="https://web.tubeonai.com/login" target="_blank">
              <button
                onClick={() => {
                  setLimitOpen(false);
                }}
                className="bg-sky-500 h-8 text-base hover:bg-sky-600 text-white px-4 flex items-center justify-center rounded-full font-semibold"
              >
                Login
              </button>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
