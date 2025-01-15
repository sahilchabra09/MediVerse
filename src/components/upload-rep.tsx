"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { useResponse } from "@/context/ResponseContext";
import { toast } from "sonner";
import { processFile } from '@/app/actions/processFile';

export function FileUploadRep() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setResponse } = useResponse();

  const isValidFileType = (file: File) => {
    const acceptedTypes: Record<string, boolean> = {
      'application/pdf': true,
      'image/jpeg': true,
      'image/png': true,
      'image/webp': true,
      'application/msword': true,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
      'text/plain': true,
    };

    return acceptedTypes[file.type] || false;
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) {
      toast.error("Please select a file");
      return;
    }

    const file = files[0];

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    if (!isValidFileType(file)) {
      toast.error("Unsupported file format. Please upload a PDF, image, or document file.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      const result = await processFile(formData);
      
      if (result.success && result.summary) {
        setResponse(result.summary);
        router.push('/summary');
        toast.success("File processed successfully!");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <FileUpload 
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            Supported formats: PDF, Images (JPEG, PNG, WebP), Word documents, and text files
          </div>
        </div>
      )}
    </div>
  );
}
