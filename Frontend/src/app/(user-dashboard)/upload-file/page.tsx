"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";

import { uploadFiles } from "@/utils/uploadthing"; // <-- Make sure path is correct
import { FileUpload } from "@/components/ui/file-upload";

export default function UploadFilePage() {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summarizedText, setSummarizedText] = useState<string | null>(null);

  const handleFileChange = async (fileList: FileList) => {
    try {
      setIsUploading(true);
      setError(null);

      if (!user?.id) {
        setError("User not authenticated");
        return;
      }

      // Make sure we actually have a file
      if (!fileList || fileList.length === 0) {
        setError("No file selected");
        return;
      }
      const file = fileList[0]; // handle one file. (Or do Array.from(fileList) for multiple)

      // 1) Upload to UploadThing
      const res = await uploadFiles({
        endpoint: "imageUploader",
        files: [file],
      });

      // If something goes wrong, 'res' might be undefined or empty
      if (!res || res.length === 0) {
        throw new Error("Failed to upload to UploadThing");
      }

      // 2) Use the returned fileUrl to POST to your backend
      const fileUrl = res[0].fileUrl;

      // 3) Post to your own server
      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_url", fileUrl);
      formData.append("clerk_id", user.id);
      
      const response = await fetch("https://mediverse-backend.onrender.com/ai/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error || "Failed to analyze the file");
      }
      
      // 4) Set the summarized text
      const data = await response.json();
      setSummarizedText(data.summarized_text);

      alert("File uploaded and analyzed successfully!");
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold text-center text-neutral-600 dark:text-white mb-4">
        Upload and Analyze Report
      </h1>

      <FileUpload onChange={handleFileChange} />

      {isUploading && (
        <div className="mt-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
        </div>
      )}

      {error && (
        <div className="mt-6">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      )}

      {summarizedText && (
        <div className="mt-6 max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Summarized Text
          </h2>
          <ReactMarkdown className="prose dark:prose-dark">
            {summarizedText}
          </ReactMarkdown>
        </div>
      )}
    </main>
  );
}
