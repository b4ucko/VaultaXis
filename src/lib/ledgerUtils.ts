export interface ChainedLogEntry {
  id: string;
  timestamp: string;
  action: string;
  fileName: string;
  operator: string;
  role: 'admin' | 'user' | 'visitor' | 'read-only';
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  prevHash: string;
  hash: string;
}

// Helper to calculate SHA-256 hash using browser Web Crypto Subtle
export const calculateSHA256 = async (message: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const getChainedLogs = (): ChainedLogEntry[] => {
  try {
    const logs = localStorage.getItem('chainedAuditLogs');
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    console.error('Failed to read chained logs:', e);
    return [];
  }
};

export const clearChainedLogs = (): void => {
  localStorage.setItem('chainedAuditLogs', JSON.stringify([]));
};

export const addChainedLogEntry = async (
  action: string,
  fileName: string,
  operator: string,
  role: 'admin' | 'user' | 'visitor' | 'read-only',
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED'
): Promise<ChainedLogEntry> => {
  const logs = getChainedLogs();
  const prevEntry = logs[logs.length - 1];
  const prevHash = prevEntry ? prevEntry.hash : '0000000000000000000000000000000000000000000000000000000000000000';
  
  const timestamp = new Date().toISOString();
  const id = crypto.randomUUID();
  
  // Create block string to represent state
  const blockString = `${id}-${timestamp}-${action}-${fileName}-${operator}-${role}-${status}-${prevHash}`;
  const hash = await calculateSHA256(blockString);
  
  const newEntry: ChainedLogEntry = {
    id,
    timestamp,
    action,
    fileName,
    operator,
    role,
    status,
    prevHash,
    hash
  };
  
  localStorage.setItem('chainedAuditLogs', JSON.stringify([...logs, newEntry]));
  return newEntry;
};
