import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Trash2, 
  RefreshCw, 
  ShieldAlert, 
  Link as LinkIcon,
  CheckCircle2,
  Lock,
  ArrowDown
} from 'lucide-react';
import { 
  getChainedLogs, 
  clearChainedLogs, 
  addChainedLogEntry, 
  ChainedLogEntry,
  calculateSHA256
} from '@/lib/ledgerUtils';
import { useToast } from '@/hooks/use-toast';

export function AuditLogViewer() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<ChainedLogEntry[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const loadLogs = async () => {
    let currentLogs = getChainedLogs();
    
    // Seed genesis blocks if log database is empty
    if (currentLogs.length === 0) {
      await addChainedLogEntry('GENESIS_BLOCK', 'ledger_init.bin', 'Vault System', 'admin', 'SUCCESS');
      await addChainedLogEntry('VAULT_INITIALIZATION', 'vault_master_config', 'Vault System', 'admin', 'SUCCESS');
      currentLogs = getChainedLogs();
    }
    
    setLogs(currentLogs.reverse()); // Show newest first
  };
  
  useEffect(() => {
    loadLogs();
  }, []);
  
  const clearLogs = () => {
    try {
      clearChainedLogs();
      setLogs([]);
      toast({
        title: "Chained logs cleared",
        description: "Ledger has been truncated. System initialized with new Genesis block."
      });
      loadLogs();
    } catch (error) {
      console.error('Error clearing logs:', error);
      toast({
        title: "Error",
        description: "Failed to reset ledger.",
        variant: "destructive"
      });
    }
  };

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    let tampered = false;
    
    // Read clean copy
    const cleanLogs = getChainedLogs();
    
    // Verify each hash sequence
    for (let i = 0; i < cleanLogs.length; i++) {
      const entry = cleanLogs[i];
      const prevEntry = cleanLogs[i - 1];
      const expectedPrevHash = prevEntry ? prevEntry.hash : '0000000000000000000000000000000000000000000000000000000000000000';
      
      // Recalculate block hash
      const blockString = `${entry.id}-${entry.timestamp}-${entry.action}-${entry.fileName}-${entry.operator}-${entry.role}-${entry.status}-${entry.prevHash}`;
      const recalculatedHash = await calculateSHA256(blockString);
      
      if (entry.prevHash !== expectedPrevHash || entry.hash !== recalculatedHash) {
        tampered = true;
        break;
      }
    }

    setTimeout(() => {
      setIsVerifying(false);
      if (tampered) {
        toast({
          title: "Ledger Corruption Detected!",
          description: "Crucial! Block chain hash linkage mismatch found. The log database has been modified!",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Ledger Integrity Verified",
          description: "All cryptographically chained SHA-256 blocks validated successfully. Logs are completely untampered!"
        });
      }
    }, 1500);
  };
  
  const downloadLogs = () => {
    try {
      const logsData = JSON.stringify(logs, null, 2);
      const blob = new Blob([logsData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vaultaxis-cryptographic-ledger-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Ledger Exported",
        description: "Cryptographic audit logs exported successfully."
      });
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast({
        title: "Error",
        description: "Failed to export logs",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
        <div>
          <h3 className="font-bold text-white flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <LinkIcon className="h-3.5 w-3.5 text-primary animate-pulse" /> Cryptographic Ledger Blocks
          </h3>
          <p className="text-[9px] text-muted-foreground mt-0.5">SHA-256 append-only linked audit block-chain.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleVerifyChain} disabled={isVerifying} className="rounded-xl text-[9px] h-7 border-cyan-500/20 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20">
            {isVerifying ? 'Validating...' : 'Verify Chain Integrity'}
          </Button>
          <Button variant="outline" size="sm" onClick={downloadLogs} className="rounded-xl text-[9px] h-7 border-white/10 bg-white/5 hover:bg-white/10">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={clearLogs} className="rounded-xl text-[9px] h-7 border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20">
            <Trash2 className="h-3.5 w-3.5" /> Reset Ledger
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[280px] rounded-2xl border border-white/10 bg-[#020617]/50 p-2">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No ledger records available.
          </div>
        ) : (
          <div className="space-y-3 p-1">
            {logs.map((log, index) => {
              const statusSuccess = log.status === 'SUCCESS';
              return (
                <div key={log.id} className="space-y-2">
                  <div 
                    className={`p-3 border rounded-2xl bg-white/5 ${
                      statusSuccess 
                        ? 'border-white/5 hover:border-white/15' 
                        : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-white flex items-center gap-1">
                        [{log.action}] <span className="font-mono text-muted-foreground text-[10px] truncate max-w-[120px]">{log.fileName}</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] text-muted-foreground border-t border-white/5 pt-2">
                      <p>Operator: <span className="text-white font-medium">{log.operator}</span></p>
                      <p className="text-right">Status: <span className={statusSuccess ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>{log.status}</span></p>
                    </div>

                    <div className="mt-2 space-y-1 font-mono text-[9px] text-muted-foreground/80 bg-black/40 p-2 rounded-xl border border-white/5 overflow-hidden">
                      <p className="truncate">PREV_HASH: <span className="text-cyan-400/80 font-semibold">{log.prevHash}</span></p>
                      <p className="truncate">BLOCK_HASH: <span className="text-purple-400/80 font-semibold">{log.hash}</span></p>
                    </div>
                  </div>
                  {index < logs.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <ArrowDown className="h-3.5 w-3.5 text-primary/40 animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
