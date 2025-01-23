import { create } from "zustand";

export const useSummarizer = create((set) => ({
  type: "url", // url, file, text
  activeTab: "content", // content, repurpose, chat, transcript, timestamp
  summary: null,
  title: "Youtube to Blog Post",
  promptType: "free-blog-post-generator",
  limitOpen: false,
  errMsg: "",
  backendBaseUrl: "https://dev-app.tubeonai.com",
  webAppBaseUrl: "https://dev-web.tubeonai.com",
  setSummary: (summary) => set({ summary }),
  setType: (type) => set({ type }),
  setPromptType: (promptType) => set({ promptType }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setLimitOpen: (limitOpen) => set({ limitOpen }),
  setErrMsg: (errMsg) => set({ errMsg }),
}));
