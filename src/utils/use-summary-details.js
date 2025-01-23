import axios from "axios";
import { useSummarizer } from "../summarizer/useSummarizer";
import { useMutation } from "./hooks";

export const useSummaryDetails = ({ onSuccess, onError } = {}) => {
  const { backendBaseUrl } = useSummarizer();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.get(
        `${backendBaseUrl}/api/free_details/${id}`
      );
      return data;
    },
    onSuccess,
    onError,
  });
};
