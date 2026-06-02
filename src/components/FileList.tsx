
import React from 'react';
import { FileItem } from '@/lib/types';
import { FileTypeIcon } from '@/components/FileTypeIcon';
import { formatFileSize } from '@/lib/fileUtils';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Shield, ShieldOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FileListProps {
  files: FileItem[];
  onDecrypt: (file: FileItem) => void;
  onDelete: (fileId: string) => void;
}

export function FileList({ files, onDecrypt, onDelete }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No file history yet.</p>
        <p className="text-sm">Encrypt or decrypt files to see your history here.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {files.map(file => (
        <div 
          key={file.id} 
          className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <FileTypeIcon fileType={file.type} encrypted={file.encrypted} size={30} className="text-primary" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{file.name}</p>
                <Badge variant={file.encrypted ? "outline" : "secondary"}>
                {file.operation === 'encrypted' ? 
                    <Shield className="w-3 h-3 mr-1" /> : 
                    <ShieldOff className="w-3 h-3 mr-1" />
                  }
                  {file.operation || (file.encrypted ? 'encrypted' : 'decrypted')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} • {new Date(file.lastModified).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {file.encrypted && (
              <Button size="sm" variant="outline" onClick={() => onDecrypt(file)}>
                <Download className="w-4 h-4 mr-1" /> Decrypt
              </Button>
            )}
            <Button size="icon" variant="ghost" onClick={() => onDelete(file.id)} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
