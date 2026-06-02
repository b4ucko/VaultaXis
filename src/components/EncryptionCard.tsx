import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { EnhancedFileUpload } from '@/components/EnhancedFileUpload';
import { EnhancedPasswordInput } from '@/components/EnhancedPasswordInput';
import { FileTypeIcon } from '@/components/FileTypeIcon';
import { formatFileSize, getFileType, downloadFile } from '@/lib/fileUtils';
import { encryptFile } from '@/lib/mockApi';
import { EncryptionStatus, EncryptionAlgorithm, EncryptionProfile } from '@/lib/types';
import { Lock, Loader2, Download, UploadCloud, Shield, Cloud, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AlgorithmSelector } from './AlgorithmSelector';
import { CloudUploadModal } from './CloudUploadModal';
import { EncryptionSummary } from './EncryptionSummary';
import { ProfileSelector } from './ProfileSelector';
import { defaultProfiles, getRecommendedAlgorithm } from '@/lib/encryptionUtils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface EncryptionCardProps {
  onEncryptionComplete: () => void;
  onSwitchToDecrypt?: () => void;
}

export function EncryptionCard({ onEncryptionComplete, onSwitchToDecrypt }: EncryptionCardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<EncryptionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<EncryptionProfile>(defaultProfiles[0]);
  const [algorithm, setAlgorithm] = useState<EncryptionAlgorithm>('AES-256');
  const [compressionEnabled, setCompressionEnabled] = useState(true);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [encryptionResult, setEncryptionResult] = useState<{
    timeTaken: number;
    originalSize: number;
    finalSize: number;
  } | null>(null);
  const [configTab, setConfigTab] = useState<string>('profile');
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setEncryptedFile(null);
    setStatus('idle');
    
    const recommendedAlgorithm = getRecommendedAlgorithm(getFileType(file));
    setAlgorithm(recommendedAlgorithm);
    
    const matchingProfile = defaultProfiles.find(p => p.algorithm === recommendedAlgorithm);
    if (matchingProfile) {
      setSelectedProfile(matchingProfile);
      setCompressionEnabled(matchingProfile.compressionEnabled);
    }
  };
  
  const handleProfileChange = (profile: EncryptionProfile) => {
    setSelectedProfile(profile);
    setAlgorithm(profile.algorithm);
    setCompressionEnabled(profile.compressionEnabled);
  };
  
  const handleEncrypt = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to encrypt.",
        variant: "destructive"
      });
      return;
    }
    
    if (!password) {
      toast({
        title: "No password provided",
        description: "Please enter a password to encrypt your file.",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    setStatus('encrypting');
    
    try {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 15; // Faster progress
        });
      }, 100); // Update more frequently
      
      console.log("Starting encryption with algorithm:", algorithm);
      console.log("File to encrypt:", selectedFile.name, "Size:", selectedFile.size, "Type:", selectedFile.type);
      
      const startTime = performance.now();
      const result = await encryptFile(selectedFile, password, algorithm, compressionEnabled);
      const endTime = performance.now();
      
      clearInterval(interval);
      setProgress(100);
      
      if (result.success) {
        console.log("Encryption successful:", result);
        
        if (result.file) {
          setEncryptedFile(result.file);
        }
        setStatus('encrypted');
        
        setEncryptionResult({
          timeTaken: result.encryptionTime || (endTime - startTime),
          originalSize: selectedFile.size,
          finalSize: result.encryptedSize || selectedFile.size
        });
        
        const historyItem = {
          id: result.fileId || crypto.randomUUID(),
          name: result.encryptedFileName || `${selectedFile.name}.encrypted`,
          type: getFileType(selectedFile),
          size: result.encryptedSize || result.file?.size || selectedFile.size,
          encrypted: true,
          lastModified: new Date(),
          originalType: selectedFile.type,
          operation: 'encrypted',
          algorithm: algorithm,
          encryptionTime: result.encryptionTime,
          originalSize: selectedFile.size
        };
        
        try {
          const history = JSON.parse(localStorage.getItem('fileHistory') || '[]');
          localStorage.setItem('fileHistory', JSON.stringify([...history, historyItem]));
        } catch (e) {
          console.error("Failed to update file history:", e);
        }
        
        toast({
          title: "Encryption complete",
          description: "Your file has been encrypted successfully.",
        });
        
        onEncryptionComplete();
      } else {
        console.error("Encryption failed:", result.message);
        setStatus('error');
        toast({
          title: "Encryption failed",
          description: result.message || "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Encryption error:", error);
      setProgress(0);
      setStatus('error');
      toast({
        title: "Encryption error",
        description: error instanceof Error ? error.message : "An unexpected error occurred during encryption.",
        variant: "destructive"
      });
    }
  };
  
  const handleDownload = () => {
    if (encryptedFile) {
      downloadFile(encryptedFile);
      toast({
        title: "Download started",
        description: "Your encrypted file download has begun."
      });
    }
  };
  
  const handleUploadToNas = () => {
    if (encryptedFile) {
      const nasConfig = localStorage.getItem('nasConfig');
      
      if (!nasConfig) {
        toast({
          title: "NAS not configured",
          description: "Please set up your NAS connection first.",
          variant: "destructive"
        });
        navigate('/nas-setup');
        return;
      }
      
      toast({
        title: "Uploading to NAS",
        description: "Your encrypted file is being uploaded to your NAS."
      });
      
      setTimeout(() => {
        toast({
          title: "Upload complete",
          description: "Your encrypted file has been stored on your NAS."
        });
        
        resetForm();
        onEncryptionComplete();
      }, 2000);
    }
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setEncryptedFile(null);
    setPassword('');
    setConfirmPassword('');
    setProgress(0);
    setStatus('idle');
    setEncryptionResult(null);
  };
  
  const renderAdvancedOptions = () => {
    return (
      <Card className="mt-4">
        <CardContent className="pt-4">
          <Tabs value={configTab} onValueChange={setConfigTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="custom">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="pt-4">
              <ProfileSelector
                selectedProfile={selectedProfile}
                onProfileChange={handleProfileChange}
              />
              
              {selectedProfile && (
                <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
                  <p className="font-medium">Profile settings:</p>
                  <div className="mt-1 space-y-1">
                    <p>• Algorithm: <span className="font-medium">{selectedProfile.algorithm}</span></p>
                    <p>• Compression: <span className="font-medium">{selectedProfile.compressionEnabled ? 'Enabled' : 'Disabled'}</span></p>
                    {selectedProfile.description && (
                      <p className="text-muted-foreground text-xs mt-1">{selectedProfile.description}</p>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4 pt-4">
              <AlgorithmSelector 
                selectedAlgorithm={algorithm}
                onChange={setAlgorithm}
              />
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="compression"
                  checked={compressionEnabled}
                  onCheckedChange={setCompressionEnabled}
                />
                <Label htmlFor="compression">Enable compression</Label>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };
  
  const renderContent = () => {
    if (status === 'encrypting') {
      return (
        <div className="py-6 text-center space-y-4">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
          <div>
            <p className="font-medium">Encrypting your file...</p>
            <p className="text-sm text-muted-foreground">Please wait, this may take a moment</p>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      );
    }
    
    if (status === 'encrypted') {
      return (
        <div className="space-y-6">
          <div className="py-4 text-center">
            <div className="bg-primary/10 rounded-full p-3 inline-block mx-auto">
              <Shield className="h-8 w-8 mx-auto text-primary" />
            </div>
            <p className="font-medium mt-2">File encrypted successfully!</p>
            <p className="text-sm text-muted-foreground">Your file is now secure</p>
          </div>
          
          {encryptionResult && (
            <EncryptionSummary
              fileName={encryptedFile?.name || selectedFile?.name || 'file'}
              algorithm={algorithm}
              timeTaken={encryptionResult.timeTaken}
              originalSize={encryptionResult.originalSize}
              finalSize={encryptionResult.finalSize}
              compressionEnabled={compressionEnabled}
            />
          )}

          <div className="space-y-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 glass-card">
            <Label htmlFor="rename-success" className="text-xs font-semibold flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary animate-pulse" /> Optional: Rename Encrypted File before download/sync
            </Label>
            <Input
              id="rename-success"
              value={encryptedFile?.name || ''}
              onChange={(e) => {
                if (encryptedFile) {
                  const renamed = new File([encryptedFile], e.target.value, { type: encryptedFile.type });
                  setEncryptedFile(renamed);
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
            
            <Button variant="outline" onClick={handleUploadToNas} className="flex items-center gap-2 rounded-xl">
              <UploadCloud className="h-4 w-4" /> Upload to NAS
            </Button>
          </div>
          
          <div className="text-center mt-2 flex items-center justify-center gap-2">
            <Button variant="link" onClick={resetForm}>
              Encrypt another file
            </Button>
            {onSwitchToDecrypt && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <Button variant="link" onClick={onSwitchToDecrypt}>
                  Decrypt a file
                </Button>
              </>
            )}
          </div>
        </div>
      );
    }
    
    if (selectedFile) {
      return (
        <div className="space-y-6">
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
          
          <div className="space-y-4">
            <EnhancedPasswordInput
              password={password}
              setPassword={setPassword}
              label="Encryption Password"
              placeholder="Create a strong password..."
              showGenerator={true}
            />
            
            <EnhancedPasswordInput
              password={confirmPassword}
              setPassword={setConfirmPassword}
              label="Confirm Password"
              placeholder="Confirm your password..."
              showGenerator={false}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="advanced-mode"
              checked={advancedMode}
              onCheckedChange={setAdvancedMode}
            />
            <Label htmlFor="advanced-mode">Advanced encryption options</Label>
          </div>
          
          {advancedMode && renderAdvancedOptions()}
        </div>
      );
    }
    
    return <EnhancedFileUpload onFileSelect={handleFileSelect} />;
  };
  
  return (
    <>
      <Card className="w-full">
      <CardHeader>
        <CardTitle>Encrypt File</CardTitle>
        <CardDescription>
          Secure your files with advanced encryption
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
      {selectedFile && status === 'idle' && (
        <CardFooter className="flex justify-end">
          <Button onClick={handleEncrypt}>Encrypt File</Button>
        </CardFooter>
      )}
    </Card>
      
      <CloudUploadModal 
        isOpen={isCloudModalOpen} 
        onClose={() => setIsCloudModalOpen(false)} 
        file={encryptedFile} 
        onRename={(newName) => {
          if (encryptedFile) {
            setEncryptedFile(new File([encryptedFile], newName, { type: encryptedFile.type }));
          }
        }} 
      />
    </>
  );
}
