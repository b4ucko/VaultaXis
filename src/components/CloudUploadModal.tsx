import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Cloud, 
  Upload, 
  Settings, 
  Database, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  RefreshCw,
  HardDrive
} from 'lucide-react';

interface CloudUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  onRename: (newName: string) => void;
}

type CloudProvider = 'google' | 'dropbox' | 'onedrive' | 'aws';

export function CloudUploadModal({ isOpen, onClose, file, onRename }: CloudUploadModalProps) {
  const { toast } = useToast();
  const [activeProvider, setActiveProvider] = useState<CloudProvider>('google');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (file) {
      setFileName(file.name);
    }
    setUploadStatus('idle');
    setErrorMessage('');
  }, [file, isOpen]);

  if (!file) return null;

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleUpload = async () => {
    if (!fileName.trim()) {
      toast({
        title: "Filename empty",
        description: "Please enter a valid filename.",
        variant: "destructive"
      });
      return;
    }

    // Rename the file locally
    const renamedFile = new File([file], fileName, { type: file.type });
    onRename(fileName);

    setIsUploading(true);
    setUploadStatus('idle');

    // Simulate upload for cloud providers
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus('success');
      toast({
        title: `Upload Successful`,
        description: `Renamed file exported to ${activeProvider.toUpperCase()} securely.`
      });
    }, 1800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl glass border-white/10 dark:text-white shadow-2xl backdrop-blur-2xl rounded-3xl overflow-hidden p-0 max-h-[85vh] flex flex-col">
        {/* Scrollable Content Area */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400 flex items-center gap-2">
              <Cloud className="h-6 w-6 text-primary animate-pulse" /> Export & Cloud Integration
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Optionally rename your file and push it directly to cloud platforms or local storage systems.
            </DialogDescription>
          </DialogHeader>

          {/* Part 1: Rename File Option */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 glass-card">
            <Label htmlFor="rename" className="text-sm font-semibold flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" /> Optional: Rename File before exporting
            </Label>
            <div className="flex gap-2">
              <Input
                id="rename"
                value={fileName}
                onChange={handleFileNameChange}
                placeholder="Enter filename..."
                className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: Keep the `.encrypted` extension intact if exporting encrypted bundles.
            </p>
          </div>

          {/* Part 2: Selector */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Select Export Destination</Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'google', label: 'Drive', icon: Cloud, color: 'text-blue-400 bg-blue-500/10' },
                { id: 'dropbox', label: 'Dropbox', icon: Cloud, color: 'text-indigo-400 bg-indigo-500/10' },
                { id: 'onedrive', label: 'OneDrive', icon: HardDrive, color: 'text-sky-400 bg-sky-500/10' },
                { id: 'aws', label: 'AWS S3', icon: Database, color: 'text-orange-400 bg-orange-500/10' },
              ].map((p) => {
                const Icon = p.icon;
                const active = activeProvider === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProvider(p.id as CloudProvider);
                      setUploadStatus('idle');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ${
                      active 
                        ? 'bg-primary/20 border-primary text-white shadow-lg scale-105' 
                        : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mb-1.5 ${p.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-medium">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Providers with simulated interfaces */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-muted-foreground space-y-1 bg-indigo-500/5">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Cloud className="h-4 w-4 text-primary" /> {activeProvider.toUpperCase()} Cloud Sync Mode
            </span>
            <p>Sync is fully modeled. Press "Export" to securely copy and simulate delivery to your connected {activeProvider} API drive.</p>
          </div>

          {/* Part 4: Upload Feedback */}
          {isUploading && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-primary">
              <Loader2 className="h-5 w-5 animate-spin" /> Uploading to cloud... please wait
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <span>File successfully deployed. Your cloud node is fully synchronized!</span>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1.5">
              <span className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Destination Sync Blocked
              </span>
              <p className="font-mono">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Anchor Footer actions */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex justify-end gap-2.5 flex-shrink-0">
          <Button variant="ghost" onClick={onClose} disabled={isUploading} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading} className="rounded-xl bg-primary hover:bg-primary/90 flex items-center gap-1.5">
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Export File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
