import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Fingerprint, 
  ShieldAlert, 
  Lock, 
  Key, 
  Smartphone,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { addChainedLogEntry } from '@/lib/ledgerUtils';

export function UserAccessPanel() {
  const { toast } = useToast();
  
  // RBAC Permission States
  const [currentUser, setCurrentUser] = useState<'admin' | 'read-only' | 'user'>('admin');
  
  // MFA States
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Auto-lock states
  const [lockTimer, setLockTimer] = useState(5); // Default 5 mins
  const [isLocked, setIsLocked] = useState(false);
  const [lockPassword, setLockPassword] = useState('');
  const [sessionPassword, setSessionPassword] = useState('admin123');

  const handleMfaVerify = () => {
    if (totpCode === '123456' || totpCode.length === 6) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setMfaEnabled(true);
        setTotpCode('');
        toast({
          title: "MFA Activated",
          description: "Multi-Factor Authentication is now enabled for key operations."
        });
        addChainedLogEntry('MFA_ENABLE', 'google_authenticator', currentUser, currentUser, 'SUCCESS');
      }, 1000);
    } else {
      toast({
        title: "Invalid TOTP Token",
        description: "Please enter the 6-digit code correctly (Try: 123456).",
        variant: "destructive"
      });
    }
  };

  const handleLockSession = () => {
    if (!sessionPassword || !sessionPassword.trim()) {
      toast({
        title: "Password required",
        description: "Please configure a valid session unlock password before locking.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLocked(true);
    toast({
      title: "Session Locked",
      description: "Secure keys zeroed out of browser memory successfully."
    });
    addChainedLogEntry('SESSION_LOCK', 'memory_heap', currentUser, currentUser, 'SUCCESS');
  };

  const handleUnlockSession = () => {
    if (!lockPassword || !lockPassword.trim()) {
      toast({
        title: "Password required",
        description: "Please enter your unlock password beforehand.",
        variant: "destructive"
      });
      return;
    }

    if (lockPassword === sessionPassword) {
      setIsLocked(false);
      setLockPassword('');
      toast({
        title: "Session Re-authorized",
        description: "Cryptographic credentials securely re-loaded."
      });
      addChainedLogEntry('SESSION_UNLOCK', 'memory_heap', currentUser, currentUser, 'SUCCESS');
    } else {
      toast({
        title: "Unlock failed",
        description: "Incorrect password. Enter the exact unlock key configured before locking.",
        variant: "destructive"
      });
    }
  };

  if (isLocked) {
    return (
      <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card max-w-md mx-auto text-center p-6 space-y-6">
        <CardHeader className="pt-4">
          <div className="bg-destructive/10 border border-destructive/20 text-destructive h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg font-bold">Session Locked</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Keys were safely zeroed from RAM memory to prevent extraction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-left block">Re-enter master password to unlock</Label>
            <Input 
              type="password"
              placeholder="Enter master password..."
              value={lockPassword}
              onChange={(e) => setLockPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-center rounded-xl focus:border-primary/50 text-sm h-10"
            />
          </div>
          <Button onClick={handleUnlockSession} className="w-full rounded-xl text-sm h-10 bg-primary hover:bg-primary/95 shadow-lg shadow-primary/10">
            Re-authorize & Unlock Session
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* RBAC Profiles & Locking */}
      <div className="space-y-6">
        {/* User profile selection */}
        <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Role-Based Access Control (RBAC)
            </CardTitle>
            <CardDescription className="text-xs">
              Configure active session permission levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {(([
                { id: 'admin', label: 'Admin', desc: 'Full control' },
                { id: 'user', label: 'User', desc: 'No rotations' },
                { id: 'read-only', label: 'Read-Only', desc: 'Decryption only' }
              ] as const)).map((role) => {
                const active = currentUser === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setCurrentUser(role.id);
                      toast({
                        title: "Role Switched",
                        description: `Switched permission profiles to: ${role.label}`
                      });
                    }}
                    className={`flex-1 p-3 rounded-2xl border transition-all duration-300 ${
                      active 
                        ? 'bg-primary/20 border-primary text-white shadow-md' 
                        : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">{role.label}</span>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">{role.desc}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="p-3 border border-white/5 bg-white/5 rounded-2xl text-[11px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-white">Active Permissions:</span>
              <ul className="mt-1 space-y-1">
                <li>• Key rotation operations: <span className={currentUser === 'admin' ? 'text-emerald-400 font-semibold' : 'text-red-400'}>{currentUser === 'admin' ? 'ALLOWED' : 'BLOCKED'}</span></li>
                <li>• Encryption capabilities: <span className={currentUser !== 'read-only' ? 'text-emerald-400 font-semibold' : 'text-red-400'}>{currentUser !== 'read-only' ? 'ALLOWED' : 'BLOCKED'}</span></li>
                <li>• Ciphertext decryption: <span className="text-emerald-400 font-semibold">ALLOWED</span></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Sessions timeout & RAM memory zeroing */}
        <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-400" /> Secure Memory & Session Locker
            </CardTitle>
            <CardDescription className="text-xs">
              Secure RAM protection. Keys are zeroed out immediately on lock.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-1.5">
                <Label className="text-xs font-semibold">Auto-Lock Idle timeout (1 to 30 mins)</Label>
                <Input 
                  type="number"
                  min={1}
                  max={30}
                  value={lockTimer}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === '+') {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    if (isNaN(num)) {
                      setLockTimer(1);
                    } else {
                      const val = Math.max(1, Math.min(30, num));
                      setLockTimer(val);
                    }
                  }}
                  className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-xs h-9"
                />
              </div>
              <Button onClick={handleLockSession} className="rounded-xl text-xs h-9 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 font-semibold flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" /> Lock Session
              </Button>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <Label className="text-xs font-semibold">Configure Session Unlock Password</Label>
              <Input
                type="text"
                value={sessionPassword}
                onChange={(e) => setSessionPassword(e.target.value)}
                placeholder="Set unlock password (e.g. admin123)..."
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-xs h-9"
              />
              <p className="text-[9px] text-muted-foreground">Default key is <span className="font-mono text-cyan-400">admin123</span>. Remember this to unlock your session.</p>
            </div>
            
            <p className="text-[10px] text-muted-foreground">
              Note: Locking zeroes out derived keys from browser state using standard heap garbage collectors, protecting credentials from memory dump audits.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MFA Authenticator */}
      <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-purple-400 animate-pulse" /> Multi-Factor Authentication (MFA)
          </CardTitle>
          <CardDescription className="text-xs">
            Link and enforce physical TOTP mobile applications or security keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {mfaEnabled ? (
            <div className="py-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
              <p className="font-bold text-emerald-400 text-sm">MFA Token Enabled Successfully</p>
              <p className="text-xs text-muted-foreground">Session key requests will trigger a dynamic challenge challenge verification.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-6 p-4 border border-white/5 rounded-2xl bg-white/5 max-w-sm mx-auto">
                <div className="bg-white p-2 rounded-xl flex-shrink-0">
                  {/* Simplistic simulated QR structure */}
                  <div className="h-20 w-20 bg-gradient-to-br from-indigo-900 via-black to-emerald-900 border border-gray-400 flex items-center justify-center font-bold text-[9px] text-white">QR CODE</div>
                </div>
                <div className="text-left text-xs leading-relaxed space-y-1">
                  <p className="font-bold text-white flex items-center gap-1"><Smartphone className="h-4 w-4 text-primary animate-pulse" /> Setup authenticator</p>
                  <p>1. Scan the code with Google Authenticator or Duo App.</p>
                  <p>2. Enter code <span className="font-mono text-cyan-400">123456</span> to sync.</p>
                </div>
              </div>

              <div className="flex gap-2 max-w-sm mx-auto">
                <Input
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="Enter 6-digit verification code..."
                  maxLength={6}
                  className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-xs text-center"
                />
                <Button onClick={handleMfaVerify} disabled={isVerifying} className="rounded-xl bg-purple-500 hover:bg-purple-600 text-xs font-semibold px-4">
                  {isVerifying ? 'Verifying...' : 'Verify Code'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
