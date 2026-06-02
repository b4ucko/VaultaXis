
import { EncryptionAlgorithm, EncryptionProfile, AuditLogEntry } from "./types";

export const algorithmDetails: Record<EncryptionAlgorithm, {
  name: string;
  description: string;
  strengthLevel: number; // 1-5 scale
  speed: number; // 1-5 scale (5 being fastest)
  useCase: string;
}> = {
  'AES-256': {
    name: 'AES-256',
    description: 'Advanced Encryption Standard with 256-bit key length. Industry standard strong encryption.',
    strengthLevel: 5,
    speed: 4,
    useCase: 'Best for general purpose encryption with excellent security.'
  },
  'RSA': {
    name: 'RSA',
    description: 'Public-key cryptosystem used primarily for secure data transmission.',
    strengthLevel: 5,
    speed: 2,
    useCase: 'Ideal for secure key exchange and digital signatures.'
  },
  'ChaCha20': {
    name: 'ChaCha20',
    description: 'Modern stream cipher designed for high-speed encryption on software implementations.',
    strengthLevel: 4,
    speed: 5,
    useCase: 'Perfect for real-time communications and mobile devices.'
  },
  'Twofish': {
    name: 'Twofish',
    description: 'A symmetric key block cipher with a block size of 128 bits and key sizes up to 256 bits.',
    strengthLevel: 5,
    speed: 3,
    useCase: 'Good for highly sensitive data requiring strong security.'
  },
  'Blowfish': {
    name: 'Blowfish',
    description: 'A symmetric-key block cipher designed as a fast, free alternative to existing algorithms.',
    strengthLevel: 3,
    speed: 4,
    useCase: 'Suitable for lightweight applications with moderate security needs.'
  }
};

export const defaultProfiles: EncryptionProfile[] = [
  {
    id: 'profile-aes-default',
    name: 'Standard Security',
    algorithm: 'AES-256',
    compressionEnabled: true,
    description: 'Balanced security and performance'
  },
  {
    id: 'profile-chacha-speed',
    name: 'High Speed',
    algorithm: 'ChaCha20',
    compressionEnabled: true,
    description: 'Optimized for speed'
  },
  {
    id: 'profile-twofish-secure',
    name: 'Maximum Security',
    algorithm: 'Twofish',
    compressionEnabled: false,
    description: 'Highest level of security'
  },
  {
    id: 'profile-blowfish-light',
    name: 'Lightweight',
    algorithm: 'Blowfish',
    compressionEnabled: true,
    description: 'For quick encryption of less sensitive data'
  }
];

// Simulated function to get recommended algorithm based on file type
export const getRecommendedAlgorithm = (fileType: string): EncryptionAlgorithm => {
  switch (fileType) {
    case 'image':
    case 'video':
    case 'audio':
      return 'ChaCha20'; // Fast for media files
    case 'document':
    case 'programming':
      return 'AES-256'; // Standard security for most documents
    case 'archive':
    case 'executable':
      return 'Twofish'; // Higher security for executables
    case 'security':
      return 'Twofish'; // Maximum security for sensitive files
    default:
      return 'AES-256'; // Default
  }
};

// Helper function to calculate password strength (1-5)
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return Math.min(5, strength);
};

// Function to get strength label and color
export const getPasswordStrengthInfo = (strength: number): {
  label: string;
  color: string;
} => {
  switch (strength) {
    case 0:
      return { label: 'Very Weak', color: 'bg-red-500' };
    case 1:
      return { label: 'Weak', color: 'bg-red-400' };
    case 2:
      return { label: 'Fair', color: 'bg-yellow-500' };
    case 3:
      return { label: 'Good', color: 'bg-yellow-400' };
    case 4:
      return { label: 'Strong', color: 'bg-green-400' };
    case 5:
      return { label: 'Very Strong', color: 'bg-green-500' };
    default:
      return { label: 'Unknown', color: 'bg-gray-400' };
  }
};

// Function to save encryption profiles to localStorage
export const saveEncryptionProfile = (profile: EncryptionProfile): void => {
  const savedProfiles = getEncryptionProfiles();
  
  // Check if profile with same ID exists
  const existingIndex = savedProfiles.findIndex(p => p.id === profile.id);
  
  if (existingIndex >= 0) {
    // Update existing profile
    savedProfiles[existingIndex] = profile;
  } else {
    // Add new profile
    savedProfiles.push(profile);
  }
  
  localStorage.setItem('encryptionProfiles', JSON.stringify(savedProfiles));
};

// Function to get saved encryption profiles from localStorage
export const getEncryptionProfiles = (): EncryptionProfile[] => {
  try {
    const savedProfiles = localStorage.getItem('encryptionProfiles');
    if (savedProfiles) {
      return JSON.parse(savedProfiles);
    }
    
    // Initialize with default profiles the first time
    localStorage.setItem('encryptionProfiles', JSON.stringify(defaultProfiles));
    return defaultProfiles;
  } catch (error) {
    console.error('Error loading encryption profiles:', error);
    return defaultProfiles;
  }
};

// Function to log audit entries
export const logAuditEntry = (entry: {
  action: 'encrypt' | 'decrypt';
  fileName: string;
  algorithm: EncryptionAlgorithm;
  success: boolean;
  fileSize?: number;
}): void => {
  try {
    const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
    
    logs.push({
      ...entry,
      timestamp: new Date().toISOString()
    });
    
    // Keep only the last 100 entries to avoid localStorage limits
    if (logs.length > 100) {
      logs.shift();
    }
    
    localStorage.setItem('auditLogs', JSON.stringify(logs));
  } catch (error) {
    console.error('Error logging audit entry:', error);
  }
};

// Function to get audit logs
export const getAuditLogs = (): AuditLogEntry[] => {
  try {
    return JSON.parse(localStorage.getItem('auditLogs') || '[]');
  } catch (error) {
    console.error('Error getting audit logs:', error);
    return [];
  }
};

// Function to simulate compression (in a real app, this would actually compress data)
export const simulateCompression = async (file: File): Promise<{
  compressedSize: number;
  compressionRatio: number;
  data: ArrayBuffer;
}> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // Simulate compression based on file type
  const compressionFactor = 
    file.type.includes('image') ? 0.7 :
    file.type.includes('text') ? 0.5 :
    file.type.includes('video') ? 0.85 : 0.9;
  
  const compressedSize = Math.floor(file.size * compressionFactor);
  
  return {
    compressedSize,
    compressionRatio: file.size / compressedSize,
    data: arrayBuffer // In a real app, this would be compressed data
  };
};
