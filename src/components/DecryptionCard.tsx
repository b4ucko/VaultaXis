import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EnhancedFileUpload } from '@/components/EnhancedFileUpload';
import { EnhancedPasswordInput } from '@/components/EnhancedPasswordInput';
import { FileTypeIcon } from '@/components/FileTypeIcon';
import { formatFileSize, getFileType, downloadFile } from '@/lib/fileUtils';
import { DecryptionStatus, EncryptionAlgorithm } from '@/lib/types';
import { Loader2, Download, FileX, Shield, Cloud, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { decryptFile } from '@/lib/mockApi';
import { fileToFileItem } from '@/lib/fileUtils';
import { EncryptionSummary } from './EncryptionSummary';
import { Separator } from '@/components/ui/separator';
import { AlgorithmSelector } from './AlgorithmSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CloudUploadModal } from './CloudUploadModal';

interface DecryptionCardProps {
  onDecryptionComplete: () => void;
  onSwitchToEncrypt?: () => void;
}

export function DecryptionCard({ onDecryptionComplete, onSwitchToEncrypt }: DecryptionCardProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<DecryptionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [decryptedFile, setDecryptedFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<EncryptionAlgorithm>('AES-256');
  const [detectAlgorithm, setDetectAlgorithm] = useState(true);
  const [decryptionResult, setDecryptionResult] = useState<{
    timeTaken: number;
    originalSize: number;
    finalSize: number;
  } | null>(null);
  const [detectedAlgorithm, setDetectedAlgorithm] = useState<EncryptionAlgorithm | null>(null);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  
  useEffect(() => {
    setDetectedAlgorithm(null);
  }, [selectedFile]);
  
  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.encrypted')) {
      toast({
        title: "Invalid file type",
        description: "Please select a file with .encrypted extension",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    setDecryptedFile(null);
    setStatus('idle');
    
    // Read the file header to automatically detect the algorithm from bytes!
    try {
      const buffer = await file.slice(0, 100).arrayBuffer();
      const view = new DataView(buffer);
      const decoder = new TextDecoder();
      
      const magicBytes = new Uint8Array(buffer, 0, 5);
      const magic = decoder.decode(magicBytes);
      
      if (magic === 'OMNIX') {
        const algId = view.getUint8(5);
        let fileAlgorithm: EncryptionAlgorithm = 'AES-256';
        if (algId === 2) fileAlgorithm = 'ChaCha20';
        else if (algId === 3) fileAlgorithm = 'Twofish';
        else if (algId === 4) fileAlgorithm = 'RSA';
        else if (algId === 5) fileAlgorithm = 'Blowfish';
        
        setDetectedAlgorithm(fileAlgorithm);
        setAlgorithm(fileAlgorithm);
        
        toast({
          title: "Algorithm Auto-Detected",
          description: `Verified ${fileAlgorithm} encrypted payload structure.`
        });
        return;
      }
    } catch (e) {
      console.warn("Failed to unpack custom file header metadata, falling back to database check", e);
    }
    
    // Fallback to localStorage database check
    const encryptedFiles = JSON.parse(localStorage.getItem('encryptedFiles') || '[]');
    const fileInfo = encryptedFiles.find((f: { name: string; algorithm?: string }) => f.name === file.name);
    
    if (fileInfo && fileInfo.algorithm) {
      const fileAlgorithm = fileInfo.algorithm as EncryptionAlgorithm;
      setDetectedAlgorithm(fileAlgorithm);
      setAlgorithm(fileAlgorithm);
      
      toast({
        title: "File recognized",
        description: `This file was encrypted with ${fileAlgorithm}.`
      });
    } else {
      setDetectedAlgorithm(null);
      toast({
        title: "Unknown file",
        description: "Please select the encryption algorithm that was used to graph this file."
      });
    }
  };
  
  const handleDecrypt = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an encrypted file to decrypt.",
        variant: "destructive"
      });
      return;
    }
    
    if (!password) {
      toast({
        title: "No password provided",
        description: "Please enter a password to decrypt your file.",
        variant: "destructive"
      });
      return;
    }
    
    setStatus('decrypting');
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 50);
    
    try {
      const fileItem = fileToFileItem(selectedFile);
      
      if (!detectAlgorithm && detectedAlgorithm === null) {
        fileItem.algorithm = algorithm;
      } else if (detectedAlgorithm) {
        fileItem.algorithm = detectedAlgorithm;
      }
      
      const startTime = performance.now();
      
      const result = await decryptFile(selectedFile, password);
      const endTime = performance.now();
      
      clearInterval(interval);
      
      if (result.success && result.file) {
        setProgress(100);
        setDecryptedFile(result.file);
        setStatus('decrypted');
        
        const encryptedFiles = JSON.parse(localStorage.getItem('encryptedFiles') || '[]');
        const fileInfo = encryptedFiles.find((f: { name: string; algorithm?: string }) => f.name === selectedFile.name);
        
        setDecryptionResult({
          timeTaken: result.decryptionTime || (endTime - startTime),
          originalSize: selectedFile.size,
          finalSize: result.file.size
        });
        
        if (result.algorithm) {
          setAlgorithm(result.algorithm);
        } else if (fileInfo && fileInfo.algorithm) {
          setAlgorithm(fileInfo.algorithm);
        }
        
        const historyItem = {
          id: crypto.randomUUID(),
          name: result.file.name,
          type: getFileType(result.file),
          size: result.file.size,
          encrypted: false,
          lastModified: new Date(),
          originalType: result.file.type,
          operation: 'decrypted',
          algorithm: result.algorithm || algorithm
        };
        
        const history = JSON.parse(localStorage.getItem('fileHistory') || '[]');
        localStorage.setItem('fileHistory', JSON.stringify([...history, historyItem]));
        
        toast({
          title: "Decryption complete",
          description: "Your file has been decrypted successfully."
        });
        
        onDecryptionComplete();
      } else {
        setProgress(0);
        setStatus('error');
        toast({
          title: "Decryption failed",
          description: result.message || "Incorrect password or file not recognized.",
          variant: "destructive"
        });
      }
    } catch (error) {
      clearInterval(interval);
      setProgress(0);
      setStatus('error');
      toast({
        title: "Decryption error",
        description: "An unexpected error occurred during decryption.",
        variant: "destructive"
      });
    }
  };
  
  const handleDownload = () => {
    if (decryptedFile) {
      downloadFile(decryptedFile);
      toast({
        title: "Download started",
        description: "Your decrypted file download has begun."
      });
    }
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setDecryptedFile(null);
    setPassword('');
    setProgress(0);
    setStatus('idle');
    setDecryptionResult(null);
    setDetectedAlgorithm(null);
  };
  
  const renderContent = () => {
    if (status === 'decrypting') {
      return (
        <div className="py-6 text-center space-y-4">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
          <div>
            <p className="font-medium">Decrypting your file...</p>
            <p className="text-sm text-muted-foreground">Please wait, this may take a moment</p>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      );
    }
    
    if (status === 'decrypted') {
      return (
        <div className="space-y-6">
          <div className="py-4 text-center">
            <div className="bg-green-500/10 rounded-full p-3 inline-block mx-auto">
              <Shield className="h-8 w-8 mx-auto text-green-500" />
            </div>
            <p className="font-medium mt-2">File decrypted successfully!</p>
            <p className="text-sm text-muted-foreground">Your file is now readable</p>
          </div>
          
          {decryptionResult && (
            <EncryptionSummary
              fileName={decryptedFile?.name || 'file'}
              algorithm={algorithm}
              timeTaken={decryptionResult.timeTaken}
              originalSize={decryptionResult.originalSize}
              finalSize={decryptionResult.finalSize}
              compressionEnabled={false}
            />
          )}

          <div className="space-y-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 glass-card">
            <Label htmlFor="rename-decrypted" className="text-xs font-semibold flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary animate-pulse" /> Optional: Rename Decrypted File before download/sync
            </Label>
            <Input
              id="rename-decrypted"
              value={decryptedFile?.name || ''}
              onChange={(e) => {
                if (decryptedFile) {
                  const renamed = new File([decryptedFile], e.target.value, { type: decryptedFile.type });
                  setDecryptedFile(renamed);
                }
              }}
              className="bg-white/5 border-white/10 focus:border-primary/50 text-sm h-9 rounded-xl"
            />
          </div>
          
          <Separator />
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleDownload} className="flex items-center gap-2 rounded-xl">
              <Download className="h-4 w-4" /> Download File
            </Button>

            <Button variant="outline" onClick={() => setIsCloudModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary">
              <Cloud className="h-4 w-4" /> Export & Cloud Sync
            </Button>
          </div>
          
          <div className="text-center mt-2 flex items-center justify-center gap-2">
            <Button variant="link" onClick={resetForm}>
              Decrypt another file
            </Button>
            {onSwitchToEncrypt && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <Button variant="link" onClick={onSwitchToEncrypt}>
                  Encrypt a file
                </Button>
              </>
            )}
          </div>
        </div>
      );
    }
    
    if (status === 'error') {
      return (
        <div className="space-y-4">
          <div className="py-4 text-center">
            <div className="bg-destructive/10 rounded-full p-3 inline-block mx-auto">
              <FileX className="h-8 w-8 mx-auto text-destructive" />
            </div>
            <p className="font-medium mt-2">Decryption failed</p>
            <p className="text-sm text-muted-foreground">Please check your password and try again</p>
          </div>
          
          <EnhancedPasswordInput
            password={password}
            setPassword={setPassword}
            label="Decryption Password"
            placeholder="Enter your password..."
            showGenerator={false}
            showStrength={false}
          />
          
          <div className="flex justify-end">
            <Button onClick={handleDecrypt}>Try Again</Button>
          </div>
        </div>
      );
    }
    
    if (selectedFile) {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 border rounded-md bg-secondary/50">
            <FileTypeIcon fileType={getFileType(selectedFile)} size={36} className="text-primary" />
            <div>
              <p className="font-medium truncate max-w-[250px]">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={resetForm}>
              Change
            </Button>
          </div>
          
          <EnhancedPasswordInput
            password={password}
            setPassword={setPassword}
            label="Decryption Password"
            placeholder="Enter your password..."
            showGenerator={false}
            showStrength={false}
          />
          
          {!detectedAlgorithm && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Algorithm Selection</Label>
              </div>
              
              <Select 
                value={algorithm} 
                onValueChange={(value) => setAlgorithm(value as EncryptionAlgorithm)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AES-256">AES-256 (Standard)</SelectItem>
                  <SelectItem value="ChaCha20">ChaCha20 (Fast)</SelectItem>
                  <SelectItem value="Twofish">Twofish (Secure)</SelectItem>
                  <SelectItem value="RSA">RSA</SelectItem>
                  <SelectItem value="Blowfish">Blowfish (Lightweight)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Select the encryption algorithm that was used to encrypt this file
              </p>
            </div>
          )}
          
          {detectedAlgorithm && (
            <div className="p-3 border rounded-md bg-green-50 dark:bg-green-900/10">
              <p className="text-sm">
                <span className="font-medium">Detected algorithm:</span> {detectedAlgorithm}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This file was encrypted using {detectedAlgorithm} algorithm
              </p>
            </div>
          )}
        </div>
      );
    }
    
    return <EnhancedFileUpload onFileSelect={handleFileSelect} acceptedFileTypes=".encrypted" />;
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Decrypt File</CardTitle>
          <CardDescription>
            Decrypt your secured files with your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
        {selectedFile && status === 'idle' && (
          <CardFooter className="flex justify-end">
            <Button onClick={handleDecrypt}>Decrypt File</Button>
          </CardFooter>
        )}
      </Card>
      
      <CloudUploadModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        file={decryptedFile}
        onRename={(newName) => {
          if (decryptedFile) {
            setDecryptedFile(new File([decryptedFile], newName, { type: decryptedFile.type }));
          }
        }}
      />
    </>
  );
}
