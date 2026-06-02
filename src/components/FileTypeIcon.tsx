
import React from 'react';
import { FileCategory } from '@/lib/types';
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  File, 
  FileArchive,
  Lock,
  Code,
  Settings,
  Terminal,
  Shield
} from 'lucide-react';

interface FileTypeIconProps {
  fileType: FileCategory;
  encrypted?: boolean;
  size?: number;
  className?: string;
}

export function FileTypeIcon({ 
  fileType, 
  encrypted = false,
  size = 24,
  className = ""
}: FileTypeIconProps) {
  const getIcon = () => {
    switch(fileType) {
      case 'document':
        return <FileText size={size} />;
      case 'image':
        return <ImageIcon size={size} />;
      case 'video':
        return <Video size={size} />;
      case 'audio':
        return <Music size={size} />;
      case 'archive':
        return <FileArchive size={size} />;
      case 'programming':
        return <Code size={size} />;
      case 'system':
        return <Settings size={size} />;
      case 'executable':
        return <Terminal size={size} />;
      case 'security':
        return <Shield size={size} />;
      default:
        return <File size={size} />;
    }
  };
  
  if (encrypted) {
    return (
      <div className={`relative ${className}`}>
        {getIcon()}
        <Lock className="absolute -bottom-1 -right-1 text-primary" size={size/2} />
      </div>
    );
  }
  
  return <span className={className}>{getIcon()}</span>;
}
