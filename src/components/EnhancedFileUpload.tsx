
import React from 'react';
import { FileUpload } from './FileUpload';

interface EnhancedFileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
}

export function EnhancedFileUpload({ 
  onFileSelect,
  acceptedFileTypes 
}: EnhancedFileUploadProps) {
  // Process file upload
  const handleFileSelect = (file: File) => {
    // Pass the file to the parent component
    onFileSelect(file);
  };

  return (
    <div className="w-full">
      <FileUpload 
        onFileSelect={handleFileSelect}
        acceptedFileTypes={acceptedFileTypes}
      />
    </div>
  );
}
