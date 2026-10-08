import { useState } from "react";
import { InterviewContext } from "./interview-context";

export const InterviewProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  return (
    <InterviewContext.Provider value={{ loading, setLoading, reports, setReports }}>
      {children}
    </InterviewContext.Provider>
  );
};
