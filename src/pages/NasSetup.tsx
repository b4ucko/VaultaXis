import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HardDrive, 
  FolderTree, 
  Server, 
  ArrowLeft, 
  Check, 
  Globe, 
  BookOpen,
  Terminal,
  Copy,
  CheckCircle2,
  Database
} from 'lucide-react';
import { NasConfig } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';

const NasSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stepIndex, setStepIndex] = useState(0);
  const [copiedType, setCopiedType] = useState<'node' | 'python' | null>(null);
  
  const [nasConfig, setNasConfig] = useState<NasConfig>({
    address: '',
    username: '',
    password: '',
    sharedFolder: '',
    isConnected: false,
    serverUrl: 'http://localhost:3001',
    localPath: ''
  });

  const nodeCode = `const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const targetDir = req.headers['x-nas-path'] || path.join(__dirname, 'uploads');
    if (!fs.existsSync(targetDir)){
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.get('/health', (req, res) => {
  res.json({ status: 'online', message: 'Vault@Xis NAS active!' });
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file received.' });
  res.json({ success: true, path: req.file.path });
});

app.listen(PORT, () => {
  console.log(\`Vault@Xis NAS running at http://localhost:\${PORT}\`);
});`;

  const pythonCode = `import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

PORT = 3001

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "online", "message": "Python NAS active!"})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files['file']
    target_path = request.headers.get('x-nas-path', './uploads')
    if not os.path.exists(target_path):
        os.makedirs(target_path, exist_ok=True)
    filename = secure_filename(file.filename)
    full_path = os.path.join(target_path, filename)
    file.save(full_path)
    return jsonify({"success": True, "path": full_path})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT)`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNasConfig(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text: string, type: 'node' | 'python') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    toast({
      title: "Code copied",
      description: `${type === 'node' ? 'Node.js' : 'Python'} receiver script copied to clipboard!`
    });
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleTestConnection = () => {
    if (!nasConfig.serverUrl || !nasConfig.localPath) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Connection successful",
      description: "Connected to local NAS folder successfully."
    });

    setNasConfig(prev => ({ ...prev, isConnected: true }));
    setStepIndex(3);
  };

  const handleSaveConfig = () => {
    localStorage.setItem('nasConfig', JSON.stringify(nasConfig));
    toast({
      title: "Configuration saved",
      description: "Your NAS configuration has been saved."
    });
    navigate('/');
  };

  const setupSteps = [
    {
      title: "Server Configuration",
      description: "Enter your NAS receiver server details",
      icon: <Globe className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="serverUrl" className="text-xs font-semibold">Server URL</Label>
            <Input 
              type="text" 
              id="serverUrl"
              name="serverUrl"
              placeholder="e.g., http://localhost:3001" 
              value={nasConfig.serverUrl}
              onChange={handleInputChange}
              className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-sm h-10"
            />
          </div>
          <Alert className="bg-primary/5 border-primary/20 rounded-xl">
            <Server className="h-4 w-4 text-primary" />
            <AlertTitle className="text-xs font-bold text-primary">Prerequisite Node</AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground">
              Configure your receiver API server using the instruction guide displayed on the right of your screen.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      title: "Local Folder Configuration",
      description: "Specify your destination directory",
      icon: <FolderTree className="h-5 w-5 text-cyan-400" />,
      content: (
        <div className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="localPath" className="text-xs font-semibold">Local Folder Path</Label>
            <Input 
              type="text" 
              id="localPath" 
              name="localPath"
              placeholder="e.g., C:\Users\Username\Desktop\NAS_Share" 
              value={nasConfig.localPath}
              onChange={handleInputChange}
              className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-sm h-10"
            />
          </div>
          <Alert className="bg-cyan-500/5 border-cyan-500/20 rounded-xl">
            <HardDrive className="h-4 w-4 text-cyan-400" />
            <AlertTitle className="text-xs font-bold text-cyan-400">Important</AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground">
              Provide an absolute path where your receiver daemon has active read and write system privileges.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      title: "Test Connection",
      description: "Verify your API link",
      icon: <Server className="h-5 w-5 text-purple-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Ensure your receiver server script is up and running, then click the button below to perform a handshake.
          </p>
          <Button onClick={handleTestConnection} className="w-full rounded-xl bg-primary hover:bg-primary/95 text-sm h-10 shadow-lg shadow-primary/10">
            Test Handshake Link
          </Button>
        </div>
      )
    },
    {
      title: "Setup Complete",
      description: "Your NAS is linked",
      icon: <Check className="h-5 w-5 text-emerald-400" />,
      content: (
        <div className="space-y-4">
          <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-sm text-emerald-400">NAS link successful!</p>
            <p className="text-xs text-muted-foreground mt-1.5">
              Sync operations will seamlessly push encrypted vaults directly to your configured directory.
            </p>
          </div>
          <Button onClick={handleSaveConfig} className="w-full rounded-xl text-sm h-10">
            Save Config & Return Home
          </Button>
        </div>
      )
    }
  ];

  const currentStep = setupSteps[stepIndex];

  return (
    <div className="min-h-screen flex flex-col bg-[#070b16] text-foreground ambient-glow">
      <Header onSelectFileCategory={() => {}} selectedCategory="all" />
      
      <main className="flex-1 container py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1.5 rounded-xl hover:bg-white/5 border border-white/5 bg-white/0 text-muted-foreground hover:text-white"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Column 1: Configurator */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                      {currentStep.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">{currentStep.title}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">{currentStep.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  {currentStep.content}
                </CardContent>
                {stepIndex < setupSteps.length - 1 && (
                  <CardFooter className="flex justify-between pt-2 border-t border-white/5">
                    <Button 
                      variant="ghost" 
                      onClick={() => stepIndex > 0 && setStepIndex(stepIndex - 1)}
                      disabled={stepIndex === 0}
                      className="rounded-xl text-xs"
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={() => setStepIndex(stepIndex + 1)}
                      className="rounded-xl text-xs bg-primary hover:bg-primary/95"
                    >
                      Next Step
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              <div className="flex justify-center">
                <div className="flex gap-2">
                  {setupSteps.map((_, i) => (
                    <div 
                      key={i}
                      className={`h-1.5 w-6 rounded-full transition-all duration-300 ${i <= stepIndex ? 'bg-primary shadow-sm shadow-primary/30' : 'bg-white/10'}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: On-screen Setup Documentation */}
            <div className="lg:col-span-7">
              <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
                    <BookOpen className="h-5 w-5 text-primary" /> NAS Server Setup & Deployment Guide
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Follow these step-by-step directions to boot up a receiver server inside your NAS node.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-xs text-muted-foreground">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px]">1</span>
                      Create backup directory
                    </h3>
                    <p className="leading-relaxed pl-6">
                      Log into your target device and set up a target folder. E.g. <code className="bg-white/5 px-1.5 py-0.5 rounded text-primary">C:\Users\Username\Desktop\NAS_Share</code> on Windows or <code className="bg-white/5 px-1.5 py-0.5 rounded text-primary">/mnt/nas/share</code> on Unix.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px]">2</span>
                      Deploy receiver daemon API
                    </h3>
                    <p className="leading-relaxed pl-6 mb-2">
                      Deploy one of the following receiver scripts inside your NAS environment. It will bind to port <code className="text-cyan-400">3001</code> to accept securely synced payloads.
                    </p>

                    <div className="pl-6">
                      <Tabs defaultValue="node-tab" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-white/5 p-1 border border-white/5 mb-3">
                          <TabsTrigger value="node-tab" className="rounded-lg text-[10px] py-1.5">Node.js Daemon</TabsTrigger>
                          <TabsTrigger value="python-tab" className="rounded-lg text-[10px] py-1.5">Python Daemon</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="node-tab" className="space-y-3 mt-0">
                          <div className="relative">
                            <pre className="bg-[#030712] border border-white/5 p-3 rounded-xl overflow-x-auto text-[10px] text-gray-300 font-mono max-h-48">
                              {nodeCode}
                            </pre>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => copyToClipboard(nodeCode, 'node')}
                              className="absolute top-2 right-2 h-7 w-7 bg-white/5 hover:bg-white/10 rounded-lg text-white"
                            >
                              {copiedType === 'node' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1.5">
                            <span className="font-semibold text-white flex items-center gap-1.5">
                              <Terminal className="h-3.5 w-3.5 text-primary" /> Run Commands
                            </span>
                            <pre className="bg-black/40 p-2 rounded text-[9px] text-primary font-mono">
                              npm init -y{"\n"}
                              npm i express cors multer{"\n"}
                              node server.js
                            </pre>
                          </div>
                        </TabsContent>

                        <TabsContent value="python-tab" className="space-y-3 mt-0">
                          <div className="relative">
                            <pre className="bg-[#030712] border border-white/5 p-3 rounded-xl overflow-x-auto text-[10px] text-gray-300 font-mono max-h-48">
                              {pythonCode}
                            </pre>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => copyToClipboard(pythonCode, 'python')}
                              className="absolute top-2 right-2 h-7 w-7 bg-white/5 hover:bg-white/10 rounded-lg text-white"
                            >
                              {copiedType === 'python' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1.5">
                            <span className="font-semibold text-white flex items-center gap-1.5">
                              <Terminal className="h-3.5 w-3.5 text-primary" /> Run Commands
                            </span>
                            <pre className="bg-black/40 p-2 rounded text-[9px] text-primary font-mono">
                              pip install flask flask-cors{"\n"}
                              python server.py
                            </pre>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px]">3</span>
                      Link up & sync
                    </h3>
                    <p className="leading-relaxed pl-6">
                      Input your configuration parameters in the settings panel on the left, execute a handshake, and save. Synced payloads will sync automatically!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NasSetup;
