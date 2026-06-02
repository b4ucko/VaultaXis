
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Clock, FileDigit, Server } from 'lucide-react';
import { formatFileSize } from '@/lib/fileUtils';
import { algorithmDetails } from '@/lib/encryptionUtils';
import { EncryptionAlgorithm } from '@/lib/types';

interface EncryptionSummaryProps {
  fileName: string;
  algorithm: EncryptionAlgorithm;
  timeTaken: number;
  originalSize: number;
  finalSize: number;
  compressionEnabled?: boolean;
}

export function EncryptionSummary({
  fileName,
  algorithm,
  timeTaken,
  originalSize,
  finalSize,
  compressionEnabled = false
}: EncryptionSummaryProps) {
  const formatTime = (ms: number): string => {
    if (ms < 1000) {
      return `${ms.toFixed(0)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  };
  
  const compressionRatio = originalSize > 0 ? ((originalSize - finalSize) / originalSize * 100).toFixed(1) : '0';
  
  return (
    <Card className="bg-muted/30 border shadow-sm">
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-sm truncate">{fileName}</h3>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium">Algorithm:</span>
          </div>
          <div className="text-right">{algorithm}</div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="font-medium">Processing time:</span>
          </div>
          <div className="text-right">{formatTime(timeTaken)}</div>
          
          <div className="flex items-center gap-2">
            <FileDigit className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Original size:</span>
          </div>
          <div className="text-right">{formatFileSize(originalSize)}</div>
          
          <div className="flex items-center gap-2">
            <FileDigit className="h-4 w-4 text-green-500" />
            <span className="font-medium">Final size:</span>
          </div>
          <div className="text-right">{formatFileSize(finalSize)}</div>
          
          {compressionEnabled && (
            <>
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Space saved:</span>
              </div>
              <div className="text-right">{compressionRatio}%</div>
            </>
          )}
        </div>
        
        <div className="pt-2 text-xs text-muted-foreground">
          <span className="font-medium">Security level:</span> {algorithmDetails[algorithm].description}
        </div>
      </CardContent>
    </Card>
  );
}
