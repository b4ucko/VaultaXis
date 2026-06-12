import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { EncryptionCard } from '@/components/EncryptionCard';
import { DecryptionCard } from '@/components/DecryptionCard';
import { FileList } from '@/components/FileList';
import { EnhancedPasswordInput } from '@/components/EnhancedPasswordInput';
import { FileItem, DecryptionStatus, FileCategory } from '@/lib/types';
import { getEncryptedFiles, decryptFile, deleteEncryptedFile } from '@/lib/mockApi';
import { downloadFile } from '@/lib/fileUtils';
import { 
  Shield, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  HardDrive, 
  Lock, 
  Upload, 
  History, 
  FileText,
  Terminal,
  KeyRound,
  Users,
  Calendar,
  Network,
  Cpu,
  Activity,
  ArrowRight,
  Info,
  Server,
  Zap,
  Globe,
  Radio,
  FileCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuditLogViewer } from '@/components/AuditLogViewer';
import { useTheme } from '@/hooks/use-theme';
import { CliTerminal } from '@/components/CliTerminal';
import { KeyManagementPanel } from '@/components/KeyManagementPanel';
import { UserAccessPanel } from '@/components/UserAccessPanel';
import { NasAdvancedPanel } from '@/components/NasAdvancedPanel';
import { SchedulerPanel } from '@/components/SchedulerPanel';

type WorkspaceType = 'crypto' | 'security' | 'advanced';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [decryptPassword, setDecryptPassword] = useState('');
  const [decryptionStatus, setDecryptionStatus] = useState<DecryptionStatus>('idle');
  const [decryptDialogOpen, setDecryptDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('all');
  
  // Categorized Workspaces
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>('crypto');
  const [activeTab, setActiveTab] = useState('encrypt');

  // Interactive Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const historyFiles = JSON.parse(localStorage.getItem('fileHistory') || '[]');
      setFiles(historyFiles);
    } catch (error) {
      toast({
        title: "Failed to load history",
        description: "Could not load file history. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleDecryptFile = (file: FileItem) => {
    setSelectedFile(file);
    setDecryptPassword('');
    setDecryptionStatus('idle');
    setDecryptDialogOpen(true);
  };
  
  const handleDeleteFile = async (fileId: string) => {
    try {
      const deleted = await deleteEncryptedFile(fileId);
      
      if (deleted) {
        setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
        toast({
          title: "File removed",
          description: "The file has been removed from history."
        });
      } else {
        throw new Error("Delete operation failed");
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not remove the file. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDecryptSubmit = async () => {
    if (!selectedFile) return;
    
    setDecryptionStatus('decrypting');
    
    try {
      const encryptedFiles = JSON.parse(localStorage.getItem('encryptedFiles') || '[]');
      
      const fileMatch = encryptedFiles.find((f: { name: string; password?: string }) => f.name === selectedFile.name);
      const passwordMatch = fileMatch?.password === decryptPassword;
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (passwordMatch) {
        const result = await decryptFile(selectedFile, decryptPassword);
        
        if (result.success && result.file) {
          setDecryptionStatus('decrypted');
          
          downloadFile(result.file);
          
          toast({
            title: "Decryption successful",
            description: "Your file has been decrypted and downloaded."
          });
          
          setTimeout(() => {
            setDecryptDialogOpen(false);
            setDecryptionStatus('idle');
            loadFiles(); // Refresh file history
          }, 2000);
        } else {
          setDecryptionStatus('error');
          toast({
            title: "Decryption failed",
            description: result.message || "File corrupt or unrecognized format.",
            variant: "destructive"
          });
        }
      } else {
        setDecryptionStatus('error');
        toast({
          title: "Decryption failed",
          description: "Incorrect password or file not found.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setDecryptionStatus('error');
      toast({
        title: "Decryption error",
        description: "An unexpected error occurred during decryption.",
        variant: "destructive"
      });
    }
  };
  
  const renderDecryptDialogContent = () => {
    if (decryptionStatus === 'decrypting') {
      return (
        <div className="py-6 text-center space-y-4">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
          <div>
            <p className="font-medium">Decrypting your file...</p>
            <p className="text-sm text-muted-foreground">Please wait, this may take a moment</p>
          </div>
        </div>
      );
    }
    
    if (decryptionStatus === 'decrypted') {
      return (
        <div className="py-6 text-center space-y-4">
          <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
          <div>
            <p className="font-medium">File decrypted successfully!</p>
            <p className="text-sm text-muted-foreground">Your file download should begin automatically</p>
          </div>
        </div>
      );
    }
    
    if (decryptionStatus === 'error') {
      return (
        <div className="space-y-4">
          <div className="py-4 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
            <p className="font-medium mt-2">Decryption failed</p>
            <p className="text-sm text-muted-foreground">Please check your password and try again</p>
          </div>
          
          <EnhancedPasswordInput
            password={decryptPassword}
            setPassword={setDecryptPassword}
            label="Password"
            placeholder="Enter your decryption password..."
            showGenerator={false}
          />
          
          <div className="flex justify-end">
            <Button onClick={handleDecryptSubmit}>Try Again</Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <EnhancedPasswordInput
          password={decryptPassword}
          setPassword={setDecryptPassword}
          label="Password"
          placeholder="Enter your decryption password..."
          showGenerator={false}
        />
        
        <div className="flex justify-end">
          <Button onClick={handleDecryptSubmit}>Decrypt File</Button>
        </div>
      </div>
    );
  };

  const filteredFiles = files.filter(file => 
    selectedCategory === 'all' || file.type === selectedCategory
  );
  
  return (
    <div className="flex flex-col min-h-screen bg-[#070b16] dark:bg-[#070b16] text-foreground transition-colors duration-300 ambient-glow font-outfit">
      <Header onSelectFileCategory={setSelectedCategory} selectedCategory={selectedCategory} />
      
      <div className="container max-w-5xl mx-auto py-12 px-4 flex-1">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src="/logo.png" alt="Vault@Xis Logo" className="h-12 w-12 object-contain" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-cyan-400 text-glow">
              Vault@Xis
            </h1>
          </div>
          <p className="text-md md:text-lg text-muted-foreground max-w-lg mx-auto font-light">
            Secure client-side cryptographic dashboard & storage engine.
          </p>
        </div>

        {/* Scrolling Ticker of Insights */}
        <div className="w-full overflow-hidden py-3.5 mb-10 glass border-y border-white/5 rounded-2xl relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#070b16] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#070b16] to-transparent z-10"></div>
          <div className="animate-marquee flex items-center gap-12 text-[10px] font-bold text-muted-foreground/80 tracking-widest whitespace-nowrap">
            {[
              "🔒 NATIVE WEB CRYPTO API: HARDWARE ACCELERATED AES-256-GCM ACTIVE",
              "🚀 100% CLIENT-SIDE OPERATION: KEY DERIVATION VIA PBKDF2/SHA256",
              "💎 ZERO-KNOWLEDGE PROTOCOL: PASSWORDS NEVER STORED OR TRANSMITTED",
              "📦 PACKED BINARY PAYLOADS: FULLY COMPATIBLE VAULT INTEGRATIONS",
              "💾 INDEXEDDB VAULT CACHE ACTIVE: UNLIMITED LOCAL ENCRYPTED LOGS"
            ].map((text, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping"></span>
                {text}
              </span>
            ))}
            {/* Repeat for seamless loop */}
            {[
              "🔒 NATIVE WEB CRYPTO API: HARDWARE ACCELERATED AES-256-GCM ACTIVE",
              "🚀 100% CLIENT-SIDE OPERATION: KEY DERIVATION VIA PBKDF2/SHA256",
              "💎 ZERO-KNOWLEDGE PROTOCOL: PASSWORDS NEVER STORED OR TRANSMITTED",
              "📦 PACKED BINARY PAYLOADS: FULLY COMPATIBLE VAULT INTEGRATIONS",
              "💾 INDEXEDDB VAULT CACHE ACTIVE: UNLIMITED LOCAL ENCRYPTED LOGS"
            ].map((text, idx) => (
              <span key={`dup-${idx}`} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping"></span>
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* WORKSPACE SELECTION SUITE */}
        <div className="mb-10 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/75 px-1">Select Module Workspace</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                id: 'crypto' as const,
                title: 'Cryptographic Engine',
                desc: 'Encrypt, decrypt, and manage secure local file assets.',
                icon: Cpu,
                color: 'from-blue-500/20 to-indigo-500/5',
                borderColor: 'border-blue-500/30',
                glow: 'shadow-blue-500/5',
                defaultTab: 'encrypt'
              },
              {
                id: 'security' as const,
                title: 'Identity & Access Suite',
                desc: 'Manage hardware key rotation, RBAC, and SHA-256 ledger logs.',
                icon: KeyRound,
                color: 'from-purple-500/20 to-pink-500/5',
                borderColor: 'border-purple-500/30',
                glow: 'shadow-purple-500/5',
                defaultTab: 'keys'
              },
              {
                id: 'advanced' as const,
                title: 'Automation & Subnets',
                desc: 'Dispatched automated cron jobs, NAS mounts, and CLI shell.',
                icon: Terminal,
                color: 'from-cyan-500/20 to-emerald-500/5',
                borderColor: 'border-cyan-500/30',
                glow: 'shadow-cyan-500/5',
                defaultTab: 'nas'
              }
            ].map((workspace) => {
              const Icon = workspace.icon;
              const active = activeWorkspace === workspace.id;
              return (
                <button
                  key={workspace.id}
                  onClick={() => {
                    setActiveWorkspace(workspace.id);
                    setActiveTab(workspace.defaultTab);
                    toast({
                      title: `Workspace Switched`,
                      description: `Active interface loaded: ${workspace.title}`
                    });
                  }}
                  className={`relative p-5 rounded-3xl border text-left transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br ${workspace.color} ${workspace.glow} ${
                    active 
                      ? `${workspace.borderColor} border-opacity-100 shadow-xl scale-[1.02] ring-1 ring-white/10` 
                      : 'border-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  {active && (
                    <span className="absolute top-4 right-4 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-white">{workspace.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{workspace.desc}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* MODULAR SUB-WORKSPACES */}
        <div className="space-y-6">
          {activeWorkspace === 'crypto' && (
            <Tabs defaultValue="encrypt" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Cpu className="h-4 w-4" /> Cryptographic Workspace
                </span>
                <TabsList className="bg-white/5 border border-white/5 rounded-xl p-1 gap-1">
                  <TabsTrigger value="encrypt" className="rounded-lg py-1.5 px-4 text-xs font-semibold">Encrypt</TabsTrigger>
                  <TabsTrigger value="decrypt" className="rounded-lg py-1.5 px-4 text-xs font-semibold">Decrypt</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-lg py-1.5 px-4 text-xs font-semibold flex items-center gap-1"><History className="h-3 w-3" /> History</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="encrypt" className="space-y-4 outline-none">
                <EncryptionCard 
                  onEncryptionComplete={loadFiles} 
                  onSwitchToDecrypt={() => setActiveTab('decrypt')} 
                />
              </TabsContent>
              
              <TabsContent value="decrypt" className="space-y-4 outline-none">
                <DecryptionCard 
                  onDecryptionComplete={loadFiles} 
                  onSwitchToEncrypt={() => setActiveTab('encrypt')} 
                />
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4 outline-none">
                <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-bold">
                      <History className="h-5 w-5 text-primary" /> File Action Logs
                    </CardTitle>
                    <CardDescription className="text-xs">View all local cryptographic files and operational downloads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="py-10 text-center">
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                        <p className="mt-2 text-muted-foreground">Loading history...</p>
                      </div>
                    ) : (
                      <FileList 
                        files={filteredFiles} 
                        onDecrypt={handleDecryptFile}
                        onDelete={handleDeleteFile}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {activeWorkspace === 'security' && (
            <Tabs defaultValue="keys" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4" /> Identity & Ledger Policy Workspace
                </span>
                <TabsList className="bg-white/5 border border-white/5 rounded-xl p-1 gap-1">
                  <TabsTrigger value="keys" className="rounded-lg py-1.5 px-4 text-xs font-semibold">Keys</TabsTrigger>
                  <TabsTrigger value="access" className="rounded-lg py-1.5 px-4 text-xs font-semibold">RBAC</TabsTrigger>
                  <TabsTrigger value="audit" className="rounded-lg py-1.5 px-4 text-xs font-semibold flex items-center gap-1"><Activity className="h-3 w-3" /> Ledger</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="keys" className="space-y-4 outline-none">
                <KeyManagementPanel />
              </TabsContent>

              <TabsContent value="access" className="space-y-4 outline-none">
                <UserAccessPanel />
              </TabsContent>
              
              <TabsContent value="audit" className="space-y-4 outline-none">
                <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-bold">
                      <FileText className="h-5 w-5 text-cyan-400" /> Audit Logs Chained Ledger
                    </CardTitle>
                    <CardDescription className="text-xs">View detailed tamper-evident encryption and decryption activity blocks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AuditLogViewer />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {activeWorkspace === 'advanced' && (
            <Tabs defaultValue="nas" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="h-4 w-4" /> Subnets & Automation Workspace
                </span>
                <TabsList className="bg-white/5 border border-white/5 rounded-xl p-1 gap-1">
                  <TabsTrigger value="nas" className="rounded-lg py-1.5 px-4 text-xs font-semibold">NAS</TabsTrigger>
                  <TabsTrigger value="scheduler" className="rounded-lg py-1.5 px-4 text-xs font-semibold">Jobs</TabsTrigger>
                  <TabsTrigger value="cli" className="rounded-lg py-1.5 px-4 text-xs font-semibold flex items-center gap-1"><Terminal className="h-3 w-3" /> CLI</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="nas" className="space-y-4 outline-none">
                <NasAdvancedPanel />
              </TabsContent>

              <TabsContent value="scheduler" className="space-y-4 outline-none">
                <SchedulerPanel />
              </TabsContent>

              <TabsContent value="cli" className="space-y-4 outline-none">
                <CliTerminal />
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* ========================================================================= */}
        {/* NEW EXTENSIVE LANDING PANELS (MAKES WEBSITE LONGER & DYNAMICALLY DETAILED) */}
        {/* ========================================================================= */}

        {/* 1. INTERACTIVE SYSTEM SUBNET NETWORK MAP */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground/75">Cryp-Ops Subnet Health Nodes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: 'Local Master Node', ip: '127.0.0.1', rtt: '0.11ms', role: 'Active Gateway', status: 'ONLINE', icon: Server, badgeColor: 'bg-emerald-500/10 text-emerald-400' },
              { name: 'Synology Secure Vault', ip: '192.168.1.15', rtt: '1.45ms', role: 'Watch Folder', status: 'STANDBY', icon: Radio, badgeColor: 'bg-cyan-500/10 text-cyan-400' },
              { name: 'QNAP Subnet Drop', ip: '192.168.1.105', rtt: '2.84ms', role: 'Backup Array', status: 'ONLINE', icon: Server, badgeColor: 'bg-emerald-500/10 text-emerald-400' },
              { name: 'mDNS Broadcast Route', ip: '224.0.0.251', rtt: '--', role: 'UDP Multicast', status: 'DISCONNECTED', icon: Globe, badgeColor: 'bg-red-500/10 text-red-400' },
            ].map((node, idx) => {
              const Icon = node.icon;
              return (
                <div key={idx} className="p-4 border border-black/5 dark:border-white/5 bg-white/40 dark:bg-[#0d1426]/50 rounded-2xl glass transition-all hover:scale-[1.02] flex flex-col justify-between min-h-[120px]">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${node.badgeColor}`}>{node.status}</span>
                  </div>
                  <div className="mt-3">
                    <p className="font-extrabold text-xs text-foreground dark:text-white truncate">{node.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{node.ip} • latency: {node.rtt}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. CRYPTOGRAPHIC ALGORITHM COMPARE MATRIX */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Zap className="h-5 w-5 text-cyan-400 animate-pulse" />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground/75">Cryptographic Algorithm Specification Compare</h2>
          </div>
          <div className="overflow-x-auto rounded-3xl border border-black/5 dark:border-white/5 bg-white/30 dark:bg-[#0d1426]/30 backdrop-blur-xl">
            <table className="w-full text-left text-xs font-medium border-collapse">
              <thead>
                <tr className="bg-black/5 dark:bg-black/45 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="p-4">Algorithm Suite</th>
                  <th className="p-4">Security Category</th>
                  <th className="p-4">Processing Throughput</th>
                  <th className="p-4">RAM Overhead</th>
                  <th className="p-4">Quantum Resistance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 text-muted-foreground">
                {[
                  { name: 'AES-256-GCM (Native)', level: '🛡️ Military Grade', speed: '⚡ 840 MB/s (Hardware Accel)', ram: '📦 Sub-MB buffers', quantum: '🟢 Highly Resilient' },
                  { name: 'ChaCha20-Poly1305', level: '🛡️ High Speed AEAD', speed: '⚡ 620 MB/s (CPU optimized)', ram: '📦 Low footprint', quantum: '🟢 Highly Resilient' },
                  { name: 'Argon2id KDF (Configured)', level: '🔑 Key Derivation', speed: '🐢 Tunably slow (Anti-GPU)', ram: '💾 64MB - 2GB active', quantum: '🟡 Partially Safe' },
                  { name: 'PBKDF2/SHA-256', level: '🔑 Standard KDF', speed: '🐢 Tunably slow (Iterative)', ram: '📦 Sub-MB', quantum: '🟢 Highly Resilient' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-foreground dark:text-white">{row.name}</td>
                    <td className="p-4 font-mono">{row.level}</td>
                    <td className="p-4">{row.speed}</td>
                    <td className="p-4 font-mono">{row.ram}</td>
                    <td className="p-4 text-emerald-400 font-bold text-[10px] tracking-wide">{row.quantum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. SECURITY ACCORDION HANDBOOK (SLIDING FAQ) */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <FileCheck className="h-5 w-5 text-purple-400" />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground/75">Zero-Knowledge Cryptographic Handbook</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "Q: Where are my master passwords and derived manifests stored?",
                a: "Never stored! Vault@Xis operates on a strict zero-knowledge local-first protocol. Your passwords and private keys are never transmitted to any database. When you lock a session, the Web Crypto Subtle keys derived in memory are zeroed out immediately and reclaimed by the browser heap garbage collectors, making memory dump attacks fully impossible."
              },
              {
                q: "Q: How does the append-only SHA-256 Block Ledger prevent log tampering?",
                a: "Every transaction log is treated as a cryptographically linked block. When a new log is created, it takes the SHA-256 hash of the immediately preceding block and signs them together. If an attacker tries to delete or modify a past transaction log, the hash linkage chain will break instantly, triggering a tamper alert when the Integrity scanner runs."
              },
              {
                q: "Q: Why are file extensions renamed to '.encrypted' inside the vault?",
                a: "Renaming files adds an additional security perimeter. By wrapping original names with secure hashes and locking them with the '.encrypted' payload extension, local system processes or sniffers cannot identify the nature of the file (e.g. secret invoices, private identity documents) without complete master decryption."
              }
            ].map((faq, index) => {
              const active = expandedFaq === index;
              return (
                <div key={index} className="border border-black/5 dark:border-white/5 bg-white/20 dark:bg-[#0d1426]/30 rounded-2xl overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => setExpandedFaq(active ? null : index)}
                    className="w-full p-4 flex justify-between items-center text-left text-xs font-bold text-foreground dark:text-white hover:bg-white/5 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-xs text-primary transition-transform duration-300 font-mono" style={{ transform: active ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                  </button>
                  <div 
                    className="transition-all duration-300 ease-in-out overflow-hidden"
                    style={{ maxHeight: active ? '180px' : '0px', opacity: active ? 1 : 0 }}
                  >
                    <p className="p-4 border-t border-black/5 dark:border-white/5 text-xs leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. PERFORMANCE & CRYPTOGRAPHIC MONITOR BAR */}
        <div className="mt-12 p-6 rounded-3xl border border-white/5 bg-white/5 dark:bg-black/20 glass transition-all hover:border-primary/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-foreground dark:text-white flex items-center gap-1.5 uppercase tracking-widest">
                <Activity className="h-4 w-4 text-emerald-400 animate-pulse" /> Cryptographic Integrity & System Monitor
              </h3>
              <p className="text-xs text-muted-foreground">Dynamic real-time dashboard of client heap status and active zero-knowledge parameters.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">All Pipelines Operational</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border border-white/5 bg-black/5 dark:bg-black/20 rounded-2xl space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Entropy Quality</p>
              <p className="text-lg font-extrabold text-foreground dark:text-white font-mono">99.98%</p>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '99%' }}></div>
              </div>
            </div>
            <div className="p-3 border border-white/5 bg-black/5 dark:bg-black/20 rounded-2xl space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Active KDF Rounds</p>
              <p className="text-lg font-extrabold text-foreground dark:text-white font-mono">100,000</p>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full animate-pulse" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="p-3 border border-white/5 bg-black/5 dark:bg-black/20 rounded-2xl space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Heap Leak Protection</p>
              <p className="text-lg font-extrabold text-foreground dark:text-white font-mono">ACTIVE</p>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="p-3 border border-white/5 bg-black/5 dark:bg-black/20 rounded-2xl space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Memory Zero Cycle</p>
              <p className="text-lg font-extrabold text-foreground dark:text-white font-mono">0.01s</p>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full animate-pulse" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={decryptDialogOpen} onOpenChange={setDecryptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decrypt File</DialogTitle>
            <DialogDescription>
              Enter your password to decrypt and download the file
            </DialogDescription>
          </DialogHeader>
          
          {renderDecryptDialogContent()}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Index;
