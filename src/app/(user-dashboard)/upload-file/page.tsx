"use client";
import { FileUploadRep } from "@/components/upload-rep";
import React, { useEffect } from "react";

function Uploadfile() {
  useEffect(() => {
    console.log("Dashboard component rendered");
  }, []);

  return (
    <main className="flex-1 p-4">
      <FileUploadRep />
    </main>
  );
}

export default Uploadfile;
