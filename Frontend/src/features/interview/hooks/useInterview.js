import { useContext } from "react";
import { InterviewContext } from "../interview-context";
import { generateInterviewReport } from "../services/interview.api";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, reports } = context;

  const generateReport = async (details) => {
    setLoading(true);

    try {
      const response = await generateInterviewReport(details);
      return response.interviewReport;
    } catch (error) {
      console.error("Unable to generate the interview report.", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, reports, generateReport };
};
