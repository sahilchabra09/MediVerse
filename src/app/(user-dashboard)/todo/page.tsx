"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function TodoPage() {
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("todoList");
    console.log("Data from localStorage:", storedData);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Parsed data:", parsedData);
        if (parsedData && parsedData.routine) {
          setMarkdownContent(parsedData.routine);
        } else {
          setError("Invalid data format in localStorage");
        }
      } catch (e) {
        console.error("Error parsing data:", e);
        setError("Error loading data from localStorage");
      }
    } else {
      setError("No data found in localStorage");
    }
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white">
          Your Routine
        </h1>

        {error ? (
          <p className="text-red-400">{error}</p>
        ) : markdownContent ? (
          <div className="prose max-w-none bg-gray-800 text-gray-200 p-8 rounded-xl shadow-lg">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl text-white font-bold" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-2xl text-gray-300 font-semibold"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl text-white font-semibold" {...props} />
                ), // Heading like "Upper Body"
                p: ({ node, ...props }) => (
                  <p className="text-gray-300" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-gray-300" {...props} />
                ), // List items in white or gray
                strong: ({ node, ...props }) => (
                  <strong className="text-white" {...props} />
                ), // Strong text like "Upper Body", "Lower Body"
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-white">Loading routine...</p>
        )}
      </div>
    </div>
  );
}
