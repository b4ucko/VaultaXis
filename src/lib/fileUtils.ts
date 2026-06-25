import { FileCategory, FileItem } from './types';

// Determine file type from file object
export const getFileType = (file: File): FileCategory => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  // Document types
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'csv', 'tex', 'md', 'epub', 'mobi', 'xps'].includes(extension)) {
    return 'document';
  } 
  // Image types
  else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'heif', 'heic', 'raw', 'cr2', 'nef', 'arw', 'dng', 'psd', 'ai', 'eps', 'indd', 'webp', 'ico'].includes(extension)) {
    return 'image';
  } 
  // Video types
  else if (['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'mpg', 'mpeg', '3gp', 'webm', 'ogv', 'vob', 'swf', 'mts'].includes(extension)) {
    return 'video';
  } 
  // Audio types
  else if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus', 'mid'].includes(extension)) {
    return 'audio';
  }
  // Archive types
  else if (['zip', 'rar', '7z', 'tar', 'gz', 'iso', 'dmg', 'cab', 'xz', 'bz2'].includes(extension)) {
    return 'archive';
  }
  // Executable types
  else if (['exe', 'msi', 'app', 'apk', 'ipa', 'sh', 'bat', 'bin', 'cmd'].includes(extension)) {
    return 'executable';
  }
  // System files
  else if (['dll', 'sys', 'cfg', 'ini', 'plist', 'reg', 'dat', 'pkg'].includes(extension)) {
    return 'system';
  }
  // Programming files
  else if (['py', 'js', 'html', 'css', 'c', 'cpp', 'java', 'php', 'json', 'xml', 'yaml', 'yml', 'sql', 'r', 'm', 'pl', 'rb'].includes(extension)) {
    return 'programming';
  }
  // Security files
  else if (['pem', 'pfx', 'key', 'csr', 'crt', 'asc', 'p12'].includes(extension)) {
    return 'security';
  }
  
  // Check if this is an encrypted file
  else if (extension === 'encrypted') {
    // Get the type from the base file name if possible
    const baseExtension = file.name.replace('.encrypted', '').split('.').pop()?.toLowerCase();
    if (baseExtension) {
      // Try to determine the original file type
      if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'csv', 'tex', 'md', 'epub', 'mobi', 'xps'].includes(baseExtension)) {
        return 'document';
      } 
      // ...and so on for other types
    }
    return 'security'; // Default type for encrypted files
  }
  
  return 'unknown';
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' bytes';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
};

// Update isFileAllowed to handle all supported file types
export const isFileAllowed = (file: File): boolean => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  // Document types
  const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'csv', 'tex', 'md', 'epub', 'mobi', 'xps'];
  
  // Image types
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'heif', 'heic', 'raw', 'cr2', 'nef', 'arw', 'dng', 'psd', 'ai', 'eps', 'indd', 'webp', 'ico'];
  
  // Video types
  const videoTypes = ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'mpg', 'mpeg', '3gp', 'webm', 'ogv', 'vob', 'swf', 'mts'];
  
  // Audio types
  const audioTypes = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus', 'mid'];
  
  // Archive types
  const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz', 'iso', 'dmg', 'cab', 'xz', 'bz2'];
  
  // Executable types
  const executableTypes = ['exe', 'msi', 'app', 'apk', 'ipa', 'sh', 'bat', 'bin', 'cmd'];
  
  // System types
  const systemTypes = ['dll', 'sys', 'cfg', 'ini', 'plist', 'reg', 'dat', 'pkg'];
  
  // Programming types
  const programmingTypes = ['py', 'js', 'html', 'css', 'c', 'cpp', 'java', 'php', 'json', 'xml', 'yaml', 'yml', 'sql', 'r', 'm', 'pl', 'rb'];
  
  // Security types
  const securityTypes = ['pem', 'pfx', 'key', 'csr', 'crt', 'asc', 'p12', 'encrypted'];
  
  const allowedTypes = [
    ...documentTypes,
    ...imageTypes,
    ...videoTypes,
    ...audioTypes,
    ...archiveTypes,
    ...executableTypes,
    ...systemTypes,
    ...programmingTypes,
    ...securityTypes
  ];
  
  return allowedTypes.includes(extension);
};

// Convert File to FileItem
export const fileToFileItem = (file: File): FileItem => {
  return {
    id: crypto.randomUUID(),
    name: file.name,
    type: getFileType(file),
    size: file.size,
    encrypted: file.name.endsWith('.encrypted'),
    lastModified: new Date(file.lastModified),
    originalType: file.type
  };
};

// Create download URL for a file
export const createDownloadUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

// Trigger file download
export const downloadFile = (file: File): void => {
  const url = createDownloadUrl(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
