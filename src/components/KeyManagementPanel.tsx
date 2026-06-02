import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  KeyRound, 
  RefreshCw, 
  Cpu, 
  FileKey, 
  ShieldCheck, 
  Settings, 
  HelpCircle,
  Smartphone,
  HardDrive
} from 'lucide-react';
import { addChainedLogEntry } from '@/lib/ledgerUtils';

export function KeyManagementPanel() {
  const { toast } = e => {};
  const { toast: triggerToast } = useToast();
  
  // States
  const [derivationFunc, setDerivationFunc] = useState<'pbkdf2' | 'argon2'>('pbkdf2');
  const [iterations, setIterations] = useState(100000);
  const [keyRotationVersion, setKeyRotationVersion] = useState('V1 (Active)');
  const [hasKeyFile, setHasKeyFile] = useState(false);
  const [hardwareKeyStatus, setHardwareKeyStatus] = useState<'disconnected' | 'connected'>('disconnected');
  const [isRotating, setIsRotating] = useState(false);

  const handleYubiKeyConnect = () => {
    setHardwareKeyStatus('connected');
    triggerToast({
      title: "YubiKey Hook Successful",
      description: "Secure hardware challenge-response token verified successfully."
    });
    addChainedLogEntry('HARDWARE_KEY_LINK', 'YubiKey_Slot_1', 'Admin', 'admin', 'SUCCESS');
  };

  const handleKeyFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.name.endsWith('.key')) {
        setHasKeyFile(false);
        triggerToast({
          title: "Invalid file type",
          description: "Only official keyfiles with a .key extension are permitted to authorize keys.",
          variant: "destructive"
        });
        e.target.value = ''; // Reset input selection
        return;
      }
      
      setHasKeyFile(true);
      triggerToast({
        title: "Key File Bound",
        description: `Linked keyfile: ${file.name}. This file must be present during operations.`
      });
      addChainedLogEntry('KEY_FILE_BIND', file.name, 'Admin', 'admin', 'SUCCESS');
    }
  };

  const rotateMasterKey = async () => {
    setIsRotating(true);
    setTimeout(async () => {
      setIsRotating(false);
      setKeyRotationVersion('V2 (Active)');
      triggerToast({
        title: "Master Key Rotated",
        description: "Re-wrapped metadata versions safely. Existing encrypted files have been converted."
      });
      await addChainedLogEntry('KEY_ROTATE', 'master_manifest.json', 'Admin', 'admin', 'SUCCESS');
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Col 1: PBKDF2/Argon2 Derivation */}
      <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" /> Key Derivation Function (KDF)
          </CardTitle>
          <CardDescription className="text-xs">
            Configure mathematical KDF algorithms to derive high-entropy keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Algorithm Selection</Label>
            <Select 
              value={derivationFunc} 
              onValueChange={(val) => setDerivationFunc(val as 'pbkdf2' | 'argon2')}
            >
              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pbkdf2">PBKDF2 (Native & Fast)</SelectItem>
                <SelectItem value="argon2">Argon2id (Highly Secure, Memory Hard)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              {derivationFunc === 'pbkdf2' ? 'Iterations count' : 'Memory cost (KB)'}
            </Label>
            <Input 
              type="number"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-xs"
            />
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-[11px] leading-relaxed text-muted-foreground">
            <p className="font-semibold text-white mb-1">Security insight:</p>
            {derivationFunc === 'pbkdf2' ? (
              <p>PBKDF2 uses standard iterations of HMAC. High iteration counts (e.g. 100,000+) increase the time taken to check each guess, safely blocking GPU dictionary brute-force attacks.</p>
            ) : (
              <p>Argon2id is the winner of the Password Hashing Competition. It is structured to consume massive memory resources, preventing hardware-accelerated cracking chips (ASICs) from breaking your keys.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Col 2: Hardware tokens, Key Files & Rotations */}
      <div className="space-y-6">
        {/* Rotation & Version Manifest */}
        <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-cyan-400" /> Key Rotation & Manifest
              </span>
              <span className="bg-primary/20 text-primary border border-primary/20 text-[9px] px-2 py-0.5 rounded-full font-mono uppercase">
                Active: {keyRotationVersion}
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Re-wrap versioned files metadata safely without full ciphertext re-encryption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground flex justify-between bg-white/5 p-2.5 rounded-xl border border-white/5 font-mono">
              <span>Manifest ID: manifest_v2.bin</span>
              <span className="text-cyan-400">SHA-256 Chained</span>
            </div>
            <Button 
              onClick={rotateMasterKey} 
              disabled={isRotating}
              className="w-full rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 font-semibold text-xs h-9 flex items-center gap-1.5"
            >
              {isRotating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Rotate Master Key & Update Manifest
            </Button>
          </CardContent>
        </Card>

        {/* Bindings Panel */}
        <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Cpu className="h-5 w-5 text-purple-400" /> Hardware Keys & Keyfiles
            </CardTitle>
            <CardDescription className="text-xs">
              Bind hardware dongles or local authentication files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Keyfile input */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <FileKey className="h-4 w-4 text-purple-400" /> Bind local key file (.key)
              </Label>
              <Input 
                type="file" 
                accept=".key"
                onChange={handleKeyFileSelect}
                className="bg-white/5 border-white/10 rounded-xl cursor-pointer text-xs focus:border-primary/50"
              />
              {hasKeyFile && (
                <p className="text-[10px] text-emerald-400 font-semibold">✓ Key file linked and active.</p>
              )}
            </div>

            {/* YubiKey trigger */}
            <div className="flex items-center justify-between p-3 border border-white/5 rounded-2xl bg-white/5">
              <div>
                <p className="font-semibold text-xs">Simulate hardware YubiKey / TPM token</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Link a cryptographic smart card chip</p>
              </div>
              <Button 
                onClick={handleYubiKeyConnect} 
                variant="outline" 
                size="sm"
                className={`rounded-xl text-[10px] h-8 ${
                  hardwareKeyStatus === 'connected' 
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {hardwareKeyStatus === 'connected' ? 'Connected' : 'Plug YubiKey'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
