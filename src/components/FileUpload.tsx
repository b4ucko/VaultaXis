
import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isFileAllowed, fileToFileItem } from '@/lib/fileUtils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
}

export function FileUpload({ onFileSelect, acceptedFileTypes }: FileUploadProps) {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const processFile = useCallback((file: File) => {
    // For decryption, only check if it's an encrypted file when specifically looking for .encrypted
    if (acceptedFileTypes === '.encrypted' && !file.name.endsWith('.encrypted')) {
      toast({
        title: "Unsupported file type",
        description: "Please select a file with .encrypted extension",
        variant: "destructive"
      });
      return;
    } 
    // For encryption, check if the file type is allowed
    else if (!acceptedFileTypes && !isFileAllowed(file)) {
      toast({
        title: "Unsupported file type",
        description: "Please select a supported file type",
        variant: "destructive"
      });
      return;
    }
    
    onFileSelect(file);
    
    toast({
      title: "File selected",
      description: file.name.endsWith('.encrypted') 
        ? `${file.name} is ready for decryption.`
        : `${file.name} is ready for encryption.`,
    });
  }, [onFileSelect, toast, acceptedFileTypes]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);
  
  const getAcceptString = () => {
    if (acceptedFileTypes) return acceptedFileTypes;
    return ".pdf,.docx,.xlsx,.pptx,.txt,.rtf,.odt,.csv,.md,.epub,.jpg,.jpeg,.png,.gif,.bmp,.svg,.tiff,.webp,.ico,.heic,.psd,.mp4,.mkv,.avi,.mov,.wmv,.flv,.webm,.3gp,.ts,.mpeg,.mp3,.wav,.flac,.aac,.ogg,.m4a,.wma,.aiff,.opus,.mid,.exe,.apk,.zip,.rar,.7z,.tar,.gz,.bat,.sh,.iso,.encrypted";
  };
  
  return (
    <div className="w-full">
      <div
        className={`file-drop-area ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={getAcceptString()}
        />
        <Upload className="w-12 h-12 mx-auto text-primary" />
        <p className="mt-2 text-lg font-medium">Drag and drop your file here</p>
        <p className="text-sm text-muted-foreground mb-4">
          {acceptedFileTypes === '.encrypted' 
            ? "Only encrypted files (.encrypted) are supported" 
            : "Supports documents, images, videos, audio files, archives and encrypted files"}
        </p>
        <Button asChild>
          <label htmlFor="file-upload">
            Select File
          </label>
        </Button>
      </div>
    </div>
  );
}
