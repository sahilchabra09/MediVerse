import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core"; // Ensure correct path

export const {
  uploadFiles,
  useUploadThing,
} = generateReactHelpers<OurFileRouter>();
