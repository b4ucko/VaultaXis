
export type FileCategory =
  | 'all'
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'executable'
  | 'system'
  | 'programming'
  | 'security'
  | 'unknown';

// Previously called FileType in some files
export type FileType = FileCategory;

export interface FileItem {
  id: string;
  name: string;
  type: FileCategory;
  size: number;
  encrypted: boolean;
  lastModified: Date;
  originalType?: string;
  operation?: 'encrypted' | 'decrypted';
  algorithm?: EncryptionAlgorithm;
  encryptionTime?: number;
  originalSize?: number;
}

export interface EncryptionResult {
  success: boolean;
  message?: string;
  fileId?: string;
  encryptionTime?: number;
  algorithm?: EncryptionAlgorithm;
  originalSize?: number;
  encryptedSize?: number;
  encryptedFileName?: string;
  file?: File;
}

export interface DecryptionResult {
  success: boolean;
  message?: string;
  file?: File;
  decryptionTime?: number;
  algorithm?: EncryptionAlgorithm;
}

export type EncryptionStatus = 'idle' | 'encrypting' | 'encrypted' | 'error' | 'decrypting' | 'decrypted';
// Add DecryptionStatus type that was missing
export type DecryptionStatus = 'idle' | 'decrypting' | 'decrypted' | 'error';
export type ThemeMode = 'light' | 'dark' | 'system';

export type EncryptionAlgorithm = 'AES-256' | 'ChaCha20' | 'Blowfish' | 'RSA' | 'Twofish';

export interface EncryptionProfile {
  id: string;  // Add the missing id property
  name: string;
  algorithm: EncryptionAlgorithm;
  compressionEnabled: boolean;
  description?: string;
}

export interface NasConfig {
  address: string;
  username: string;
  password: string;
  sharedFolder: string;
  isConnected: boolean;
  serverUrl?: string;
  localPath?: string;
}

// Add AuditLogEntry interface that was missing
export interface AuditLogEntry {
  action: 'encrypt' | 'decrypt';
  fileName: string;
  algorithm: EncryptionAlgorithm;
  success: boolean;
  fileSize?: number;
  timestamp: string;
}
