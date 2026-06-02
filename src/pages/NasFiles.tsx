
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileTypeIcon } from '@/components/FileTypeIcon';
import { formatFileSize } from '@/lib/fileUtils';
import { FileItem, FileCategory, NasConfig } from '@/lib/types';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { HardDrive, ArrowLeft, RefreshCw, FolderOpen, Download } from 'lucide-react';

const NasFiles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nasFiles, setNasFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('all');
  const [nasConfig, setNasConfig] = useState<NasConfig | null>(null);
  
  // Load NAS configuration from local storage
  useEffect(() => {
    const savedConfig = localStorage.getItem('nasConfig');
    if (savedConfig) {
      setNasConfig(JSON.parse(savedConfig));
    }
    
    // Simulate loading files from NAS
    setTimeout(() => {
      const mockNasFiles: FileItem[] = [
        {
          id: '1',
          name: 'financial-report-2025.pdf',
          type: 'document',
          size: 2500000,
          encrypted: true,
          lastModified: new Date('2025-03-01')
        },
        {
          id: '2',
          name: 'vacation-photos.zip',
          type: 'archive',
          size: 155000000,
          encrypted: true,
          lastModified: new Date('2025-02-15')
        },
        {
          id: '3',
          name: 'project-presentation.pptx',
          type: 'document',
          size: 8500000,
          encrypted: false,
          lastModified: new Date('2025-03-10')
        },
        {
          id: '4',
          name: 'server-backup.iso',
          type: 'system',
          size: 4200000000,
          encrypted: true,
          lastModified: new Date('2025-03-05')
        },
        {
          id: '5',
          name: 'family-video.mp4',
          type: 'video',
          size: 350000000,
          encrypted: true,
          lastModified: new Date('2025-01-20')
        }
      ];
      
      setNasFiles(mockNasFiles);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const filteredFiles = nasFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleDownload = (file: FileItem) => {
    toast({
      title: "Download started",
      description: `Downloading ${file.name} from NAS...`
    });
    
    // In a real app, this would make an API call to download the file from NAS
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `${file.name} has been downloaded.`
      });
    }, 2000);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate refreshing the file list
    setTimeout(() => {
      toast({
        title: "File list refreshed",
        description: "Your NAS files have been updated."
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSelectFileCategory={setSelectedCategory} selectedCategory={selectedCategory} />
      
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold">NAS Files</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>
        
        {nasConfig ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Connected NAS</CardTitle>
                </div>
                <CardDescription>
                  {nasConfig.address} • {nasConfig.sharedFolder}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="w-full max-w-sm">
                    <Input 
                      placeholder="Search files..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/nas-setup')}
                    className="ml-2"
                  >
                    Configure NAS
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {isLoading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading files from NAS...</p>
              </div>
            ) : filteredFiles.length > 0 ? (
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <FileTypeIcon 
                        fileType={file.type} 
                        encrypted={file.encrypted} 
                        size={30} 
                        className="text-primary" 
                      />
                      <div>
                        <p className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • {file.lastModified.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownload(file)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No files found</p>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try a different search term" : "Your NAS folder appears to be empty"}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>NAS Not Configured</CardTitle>
                <CardDescription>
                  You need to set up your NAS connection first.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button onClick={() => navigate('/nas-setup')}>
                  Configure NAS
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default NasFiles;
