"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";

import { uploadFiles } from "@/utils/uploadthing"; // Ensure correct path
import { FileUpload } from "@/components/ui/file-upload";

export default function UploadFilePage() {  
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summarizedText, setSummarizedText] = useState<string | null>(null);

  const handleFileChange = async (files: File[]) => {
    try {
      setIsUploading(true);
      setError(null);

      if (!user?.id) {
        setError("User ID is missing. Please log in again.");
        setIsUploading(false);
        return;
      }

      console.log("✅ Clerk ID (to be sent):", user.id); // Debugging Clerk ID

      // ✅ Ensure a file is selected
      if (!files || files.length === 0) {
        setError("No file selected");
        setIsUploading(false);
        return;
      }

      const file = files[0];

      // ✅ Ensure only PDFs are allowed
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        setIsUploading(false);
        return;
      }

      if (file.size > 8 * 1024 * 1024) { // 8MB max size
        setError("File is too large (max 8MB).");
        setIsUploading(false);
        return;
      }

      console.log("Uploading PDF file:", file);

      // ✅ Upload PDF to UploadThing
      const res = await uploadFiles("pdfUploader", {
        files: [file],
        onUploadProgress: (progress) => {
          console.log(`Upload progress: ${progress}%`);
        },
      });

      console.log("UploadThing response:", res);

      // ✅ Ensure response contains a valid file URL
      if (!res || res.length === 0 || !res[0].url) {
        throw new Error("UploadThing did not return a valid file URL.");
      }

      const fileUrl = res[0].url;
      console.log("PDF uploaded successfully. URL:", fileUrl);

      // ✅ Send file data (PDF + URL) to backend
      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_url", fileUrl);
      formData.append("clerkid", String(user.id)); // ✅ Ensure correct naming

      // ✅ Log FormData as Object (Safe Logging)
      console.log("✅ FormData being sent:", Object.fromEntries(formData.entries()));

      const response = await fetch("https://mediverse-backend.onrender.com/ai/upload", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await response.json(); // ✅ Read response only once
      } catch (error) {
        console.error("Invalid JSON response from server:", error);
        throw new Error("Server responded with invalid data format");
      }

      if (!response.ok) {
        throw new Error(data?.error || "Failed to analyze the file");
      }

      console.log("Backend response:", data);
      setSummarizedText(data.summarized_text);

      alert("PDF uploaded and analyzed successfully!");
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
        Upload and Analyze PDF Report
      </h1>

      {/* Ensure file upload component accepts only PDFs */}
      {!summarizedText && (
  <FileUpload onChange={handleFileChange} accept="application/pdf" />
)}
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
  <div className="mt-6 w-full mx-auto p-6 rounded-xl shadow-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
    <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white text-center">
      Summarized Text
    </h2>
    <div className="p-4 rounded-lg w-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300  dark:prose-invert">
      <ReactMarkdown>{summarizedText}</ReactMarkdown>
    </div>
  </div>
)}

    </main>
  );
}
