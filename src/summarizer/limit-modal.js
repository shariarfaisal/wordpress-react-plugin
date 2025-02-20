import Modal from "react-modal";
import Alert from "../utils/alert";
import { useSummarizer } from "./useSummarizer";
import { IoMdClose } from "react-icons/io";

Modal.setAppElement("body");

export const SignInContent = () => {
  return (
    <div className="space-y-3 text-center px-5 py-8">
      <h2 className="text-3xl font-bold">Enjoy Free Trial!🚀</h2>
      <p className="text-lg font-light">
        To access all premium features, please log in or create a free account
        and enjoy a free trial!
      </p>
      <div className="flex items-center justify-center gap-3 h-[100px]">
        <a href="https://web.tubeonai.com/login" target="_blank">
          <button className="h-10 w-[150px] px-5 rounded-lg text-base flex items-center justify-center font-normal border border-gray-200 hover:bg-slate-200 transition-colors duration-150">
            Log In
          </button>
        </a>
        <a href="https://web.tubeonai.com/register" target="_blank">
          <button className="h-10 w-[150px] px-3 rounded-lg text-base flex items-center justify-center font-normal bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white">
            Sign Up
          </button>
        </a>
      </div>
      <p className="text-sm font-normal text-gray-600">
        No credit card required
      </p>
    </div>
  );
};

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
          <SignInContent />
        </div>
      </div>
    </Modal>
  );
}
