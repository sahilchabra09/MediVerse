"use client";
import React from "react";
import { useResponse } from "@/context/ResponseContext";
import ReactMarkdown from "react-markdown";

const SummaryPage: React.FC = () => {
  const { response } = useResponse();

  // Parse the JSON response
  let summaryContent = "";
  try {
    const parsedResponse = JSON.parse(response);
    summaryContent = parsedResponse.summary || "";
  } catch (error) {
    console.error("Error parsing JSON:", error);
    summaryContent = "Error parsing the summary.";
  }

  return (
    <div className="flex-1 p-10">
      <h1 className="text-3xl font-bold mb-4">Summary of your report</h1>
      <ReactMarkdown className="prose dark:prose-invert">
        {summaryContent}
      </ReactMarkdown>
    </div>
  );
};

export default SummaryPage;
