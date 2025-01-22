// utils/uploadthing.ts
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// This single function gives you everything you need
export const {
  uploadFiles,      // for manual upload
  useUploadThing,   // for hook usage
  UploadButton,     // for button usage
  UploadDropzone,   // for dropzone usage
} = generateReactHelpers<OurFileRouter>();
