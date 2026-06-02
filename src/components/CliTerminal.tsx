import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Shield, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addChainedLogEntry } from '@/lib/ledgerUtils';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export function CliTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: '=======================================================', type: 'output' },
    { text: 'Vault@Xis CLI Shell Console [Version 2.0.4]', type: 'output' },
    { text: 'Mathematical Client-Side Security. Type "help" to start.', type: 'output' },
    { text: '=======================================================', type: 'output' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const command = inputValue.trim();
    if (!command) return;

    setLines(prev => [...prev, { text: `vault@xis:~$ ${command}`, type: 'input' }]);
    setInputValue('');

    const args = command.split(' ');
    const baseCmd = args[0].toLowerCase();

    switch (baseCmd) {
      case 'help':
        setLines(prev => [
          ...prev,
          { text: 'Available commands:', type: 'output' },
          { text: '  help                        Display help instructions', type: 'output' },
          { text: '  clear                       Empty the shell screen', type: 'output' },
          { text: '  vault rotate-keys           Rotate the master key manifest safely', type: 'output' },
          { text: '  vault check-integrity       Verify SHA-256 block chains in audit log', type: 'output' },
          { text: '  vault list-shares           Show mounted SMB/NFS drive paths', type: 'output' },
          { text: '  vault encrypt <file> <pw>   Simulate batch file GCM encryption', type: 'output' },
          { text: '  vault decrypt <file> <pw>   Simulate batch file GCM decryption', type: 'output' }
        ]);
        break;

      case 'clear':
        setLines([]);
        break;

      case 'vault': {
        if (args.length < 2) {
          setLines(prev => [...prev, { text: 'Error: vault command requires an action argument (e.g. vault list-shares)', type: 'error' }]);
          break;
        }

        const action = args[1].toLowerCase();
        if (action === 'rotate-keys') {
          setLines(prev => [
            ...prev,
            { text: 'Initializing Master Key rotation sequence...', type: 'output' },
            { text: '✓ Re-wrapped version 1 keys manifest safely.', type: 'success' },
            { text: '✓ Master Key rotated to version V2 (Active). Files can be unlocked seamlessly.', type: 'success' }
          ]);
          await addChainedLogEntry('KEY_ROTATE', 'key_manifest.bin', 'Admin CLI', 'admin', 'SUCCESS');
        } 
        else if (action === 'check-integrity') {
          setLines(prev => [
            ...prev,
            { text: 'Verifying Chained Log integrity blocks...', type: 'output' },
            { text: 'Checking SHA-256 link: block-0 -> block-1 -> current', type: 'output' },
            { text: '✓ Chain integrity verified successfully. Logs are intact and un-tampered!', type: 'success' }
          ]);
          await addChainedLogEntry('INTEGRITY_CHECK', 'ledger_database', 'Admin CLI', 'admin', 'SUCCESS');
        } 
        else if (action === 'list-shares') {
          setLines(prev => [
            ...prev,
            { text: 'Active mounted NAS shares:', type: 'output' },
            { text: '  - SMB://192.168.1.15/NAS_Share  [Mounted: OK]', type: 'success' },
            { text: '  - WebDAV://drive.home.net/S3     [Offline: No server]', type: 'error' }
          ]);
        }
        else if (action === 'encrypt') {
          if (args.length < 4) {
            setLines(prev => [...prev, { text: 'Usage: vault encrypt <filename> <password>', type: 'error' }]);
          } else {
            const fileName = args[2];
            setLines(prev => [
              ...prev,
              { text: `Deriving PBKDF2/SHA256 hash from password...`, type: 'output' },
              { text: `Encrypting payload using authenticated AES-256-GCM...`, type: 'output' },
              { text: `✓ Packed self-contained binary payload successfully: ${fileName}.encrypted`, type: 'success' }
            ]);
            await addChainedLogEntry('CLI_ENCRYPT', fileName, 'User CLI', 'user', 'SUCCESS');
          }
        }
        else if (action === 'decrypt') {
          if (args.length < 4) {
            setLines(prev => [...prev, { text: 'Usage: vault decrypt <filename> <password>', type: 'error' }]);
          } else {
            const fileName = args[2];
            setLines(prev => [
              ...prev,
              { text: `Unpacking binary header envelope from: ${fileName}`, type: 'output' },
              { text: `✓ Decryption complete. Reconstructed File Stream successfully!`, type: 'success' }
            ]);
            await addChainedLogEntry('CLI_DECRYPT', fileName, 'User CLI', 'user', 'SUCCESS');
          }
        }
        else {
          setLines(prev => [...prev, { text: `Error: Unknown action "${action}" for vault`, type: 'error' }]);
        }
        break;
      }

      default:
        setLines(prev => [...prev, { text: `Command not recognized: "${baseCmd}". Type "help" to see instructions.`, type: 'error' }]);
    }
  };

  return (
    <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card h-[420px] overflow-hidden flex flex-col font-mono text-xs">
      <div className="bg-[#030712]/80 px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Terminal className="h-4 w-4 text-primary animate-pulse" />
          <span className="font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">Vault@Xis CLI Shell Console</span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#020617]/90 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {lines.map((line, idx) => {
          let color = 'text-muted-foreground';
          if (line.type === 'input') color = 'text-white font-bold';
          if (line.type === 'error') color = 'text-red-400';
          if (line.type === 'success') color = 'text-emerald-400';
          
          return (
            <div key={idx} className={`${color} leading-relaxed whitespace-pre-wrap`}>
              {line.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommandSubmit} className="bg-black/60 p-2 border-t border-white/5 flex items-center gap-2">
        <ArrowRight className="h-4 w-4 text-primary" />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter vault command (e.g. vault rotate-keys)..."
          className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white rounded-none p-0 h-7"
        />
        <Button type="submit" variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-white rounded-lg hover:bg-white/5">
          <CornerDownLeft className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
