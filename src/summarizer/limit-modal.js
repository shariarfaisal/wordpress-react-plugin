import Modal from "react-modal";
import Alert from "../utils/alert";
import { useSummarizer } from "./useSummarizer";
import { IoMdClose } from "react-icons/io";
import { GoCheckCircleFill } from "react-icons/go";
import moreFeatureUnlock from "../more-feature-unlock.png";

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

export const PremiumLimitModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
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
          width: "max-content",
          maxWidth: "100%",
          height: "650px",
          maxHeight: "90vh",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <div className="relative bg-white rounded-lg shadow-xl w-full flex overflow-hidden h-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center hover:bg-gray-200 rounded-full z-10"
        >
          <IoMdClose className="text-lg" />
        </button>

        {/* Left side - Image */}
        <div className="relative hidden md:!w-1/2 min-w-[300px] lg:!min-w-[400px] xl:!min-w-[500px] bg-[#2b8dc9] md:!flex flex-col items-center justify-center p-8">
          <img src={moreFeatureUnlock} alt="More Features" className="absolute top-0 right-0 bottom-0 left-0 w-full h-full object-cover" />
        </div>

        {/* Right side - Content */}
        <div className="w-full md:!w-1/2 p-8 flex flex-col overflow-y-auto">
          <div className="bg-[#ffdddd] text-[#d04747] rounded-full py-2 px-4 text-sm font-medium w-fit mb-6">
            Register To Summarize/Repurpose 30+ Min Videos
          </div>
          
          <h2 className="text-3xl font-bold mb-6">Upgrade to Pro for more access</h2>
          
          <div className="space-y-4 mb-8 text-base font-light">
            <div className="flex items-center gap-3">
              <GoCheckCircleFill className="text-gray-700 text-xl" />
              <span>10,000 Credits per month</span>
            </div>
            <div className="flex items-center gap-3">
              <GoCheckCircleFill className="text-gray-700 text-xl" />
              <span>Summarize Any Content</span>
            </div>
            <div className="flex items-center gap-3">
              <GoCheckCircleFill className="text-gray-700 text-xl" />
              <span>150+ Prompts access for repurpose</span>
            </div>
            <div className="flex items-center gap-3">
              <GoCheckCircleFill className="text-gray-700 text-xl" />
              <span>Audio Support</span>
            </div>
            <div className="flex items-center gap-3">
              <GoCheckCircleFill className="text-gray-700 text-xl" />
              <span>Bookmark opportunity</span>
            </div>
            <div className="flex items-center gap-3">
              <GoCheckCircleFill className="text-gray-700 text-xl" />
              <span>24/7 priority support</span>
            </div>
          </div>
          
          <a 
            href="https://web.tubeonai.com/summary?buy_now_package=38" 
            className="bg-[#2b8dc9] text-white py-3 px-6 rounded-md text-center font-medium hover:bg-[#247ab1] transition-colors duration-300 mb-4"
          >
            Start 7-days free trial
          </a>
          
          <a 
            href="https://tubeonai.com/pricing" 
            className="text-center hover:underline text-gray-600 hover:text-gray-800 transition-colors duration-300 text-sm font-light"
          >
            View all plans & features
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default function LimitModal() {
  const { limitOpen, setLimitOpen, errMsg } = useSummarizer();


  if (limitOpen && errMsg) {
    return <PremiumLimitModal isOpen={limitOpen} onClose={() => setLimitOpen(false)} />;
  }

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
