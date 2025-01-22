'use client';
import React from 'react'
import { FileUpload } from "@/components/ui/file-upload";


function page() {
  return (
    <div className="flex-grow p-0 m-0 pt-10">
      <h1 className="text-3xl font-bold text-center text-neutral-600 dark:text-white mb-4">
        Upload File
      </h1>
      <FileUpload onChange={function (files: File[]): void {
        throw new Error('Function not implemented.');
      } } />
    </div>
  )
}

export default page