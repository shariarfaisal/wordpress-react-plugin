import { create } from "zustand";



export const useSummarizer = create((set, get) => ({
  type: "url", // url, file, text
  activeTab: "content", // content, repurpose, chat, transcript, timestamp
  summary: null,
  title: "Youtube to Blog Post",
  promptType: "free-blog-post-generator",
  limitOpen: false,
  errMsg: "",
  backendBaseUrl: "https://app.tubeonai.com",
  webAppBaseUrl: "https://web.tubeonai.com",
  setSummary: (summary) => set({ summary }),
  setType: (type) => set({ type }),
  setPromptType: (promptType) => set({ promptType }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setLimitOpen: (limitOpen) => set({ limitOpen }),
  setErrMsg: (errMsg) => set({ errMsg }),
  textToPdf: async (text, cb) => {
    try {
      const { webAppBaseUrl } = get();
      const response = await fetch(`${webAppBaseUrl}/api/text-to-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "generated.pdf";
        link.click();
      }
    } catch (err) {
      cb?.(err);
    }
  },
}));
