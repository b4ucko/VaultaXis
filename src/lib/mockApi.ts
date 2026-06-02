import { FileItem, EncryptionResult, DecryptionResult, EncryptionAlgorithm } from './types';
import { logAuditEntry } from './encryptionUtils';
import { storeEncryptedBlob, getEncryptedBlob, deleteEncryptedBlob } from './dbUtils';

// Web Crypto PBKDF2 & AES-GCM Helpers
const PBKDF2_ITERATIONS = 100000;

const deriveKeyFromPassword = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import raw password as key material
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // Derive AES-GCM 256 key
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

// Binary Pack: OMNIX Header + Metadata + Ciphertext
const packEncryptedData = (
  salt: Uint8Array,
  iv: Uint8Array,
  fileName: string,
  fileType: string,
  ciphertext: ArrayBuffer,
  algorithm: EncryptionAlgorithm = 'AES-256'
): ArrayBuffer => {
  const encoder = new TextEncoder();
  const fileNameBytes = encoder.encode(fileName);
  const fileTypeBytes = encoder.encode(fileType);

  // Magic 'OMNIX' (5 bytes) + Alg (1 byte mapping)
  const magic = encoder.encode('OMNIX');
  
  let algId = 1;
  if (algorithm === 'ChaCha20') algId = 2;
  else if (algorithm === 'Twofish') algId = 3;
  else if (algorithm === 'RSA') algId = 4;
  else if (algorithm === 'Blowfish') algId = 5;

  const totalLength = 
    magic.length + 
    1 + 
    salt.length + 
    iv.length + 
    2 + fileNameBytes.length + 
    2 + fileTypeBytes.length + 
    ciphertext.byteLength;

  const buffer = new Uint8Array(totalLength);
  let offset = 0;

  // 1. Magic
  buffer.set(magic, offset);
  offset += magic.length;

  // 2. Algorithm ID
  buffer[offset] = algId;
  offset += 1;

  // 3. Salt
  buffer.set(salt, offset);
  offset += salt.length;

  // 4. IV
  buffer.set(iv, offset);
  offset += iv.length;

  // 5. Filename Length + Filename
  const view = new DataView(buffer.buffer);
  view.setUint16(offset, fileNameBytes.length, false);
  offset += 2;
  buffer.set(fileNameBytes, offset);
  offset += fileNameBytes.length;

  // 6. FileType Length + FileType
  view.setUint16(offset, fileTypeBytes.length, false);
  offset += 2;
  buffer.set(fileTypeBytes, offset);
  offset += fileTypeBytes.length;

  // 7. Ciphertext
  buffer.set(new Uint8Array(ciphertext), offset);

  return buffer.buffer;
};

// Binary Unpack: Extract Metadata, Salt, IV, and Ciphertext
interface UnpackedData {
  salt: Uint8Array;
  iv: Uint8Array;
  fileName: string;
  fileType: string;
  ciphertext: Uint8Array;
  algorithm: EncryptionAlgorithm;
}

const unpackEncryptedData = (buffer: ArrayBuffer): UnpackedData => {
  const view = new DataView(buffer);
  const decoder = new TextDecoder();
  let offset = 0;

  // 1. Check Magic 'OMNIX'
  const magicBytes = new Uint8Array(buffer, offset, 5);
  const magic = decoder.decode(magicBytes);
  if (magic !== 'OMNIX') {
    throw new Error('Not a valid OmniX encrypted file');
  }
  offset += 5;

  // 2. Algorithm ID
  const algId = view.getUint8(offset);
  let algorithm: EncryptionAlgorithm = 'AES-256';
  if (algId === 2) algorithm = 'ChaCha20';
  else if (algId === 3) algorithm = 'Twofish';
  else if (algId === 4) algorithm = 'RSA';
  else if (algId === 5) algorithm = 'Blowfish';
  offset += 1;

  // 3. Salt (16 bytes)
  const salt = new Uint8Array(buffer, offset, 16);
  offset += 16;

  // 4. IV (12 bytes)
  const iv = new Uint8Array(buffer, offset, 12);
  offset += 12;

  // 5. Filename
  const fileNameLen = view.getUint16(offset, false);
  offset += 2;
  const fileNameBytes = new Uint8Array(buffer, offset, fileNameLen);
  const fileName = decoder.decode(fileNameBytes);
  offset += fileNameLen;

  // 6. FileType
  const fileTypeLen = view.getUint16(offset, false);
  offset += 2;
  const fileTypeBytes = new Uint8Array(buffer, offset, fileTypeLen);
  const fileType = decoder.decode(fileTypeBytes);
  offset += fileTypeLen;

  // 7. Ciphertext (rest of file)
  const ciphertext = new Uint8Array(buffer, offset);

  return { salt, iv, fileName, fileType, ciphertext, algorithm };
};

// Real Encryption Function using Web Crypto API
export const encryptFile = async (
  file: File,
  password: string,
  algorithm: EncryptionAlgorithm = 'AES-256',
  compress: boolean = false
): Promise<EncryptionResult> => {
  const startTime = performance.now();

  try {
    if (!file || file.size === 0) {
      throw new Error("Invalid file: The file is empty or corrupted");
    }

    if (!password) {
      throw new Error("Invalid password: Please provide a password");
    }

    // 1. Read file as ArrayBuffer
    const fileContent = await file.arrayBuffer();

    // 2. Generate cryptographically strong random salt (16 bytes) and IV (12 bytes)
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // 3. Derive Cryptographic Key
    const aesKey = await deriveKeyFromPassword(password, salt);

    // 4. Encrypt using AES-GCM
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      aesKey,
      fileContent
    );

    // 5. Pack into self-contained binary buffer
    const packedBuffer = packEncryptedData(salt, iv, file.name, file.type, ciphertext, algorithm);
    const packedBlob = new Blob([packedBuffer], { type: 'application/octet-stream' });

    // 6. Store packed blob in IndexedDB for history decryption
    const fileId = crypto.randomUUID();
    await storeEncryptedBlob(fileId, packedBlob);

    // 7. Store safe file metadata (NO plaintext password, NO actual bytes) in localStorage
    const baseName = file.name.includes('.') 
      ? file.name.substring(0, file.name.lastIndexOf('.')) 
      : file.name;
    const extension = file.name.includes('.') 
      ? file.name.substring(file.name.lastIndexOf('.')) 
      : '';
    const encryptedFileName = `${baseName}_encrypted${extension}.encrypted`;

    const encryptedFiles = JSON.parse(localStorage.getItem('encryptedFiles') || '[]');
    const encryptedFileInfo = {
      id: fileId,
      name: encryptedFileName,
      originalName: file.name,
      originalType: file.type,
      size: packedBlob.size,
      originalSize: file.size,
      algorithm: algorithm,
      compressed: compress,
      encryptedAt: new Date().toISOString()
    };
    localStorage.setItem('encryptedFiles', JSON.stringify([...encryptedFiles, encryptedFileInfo]));

    const endTime = performance.now();
    const encryptionTime = endTime - startTime;

    logAuditEntry({
      action: 'encrypt',
      fileName: file.name,
      algorithm: algorithm,
      success: true,
      fileSize: file.size
    });

    const finalEncryptedFile = new File([packedBlob], encryptedFileName, { type: 'application/octet-stream' });

    return {
      success: true,
      message: 'File encrypted successfully',
      fileId: fileId,
      encryptionTime,
      algorithm,
      originalSize: file.size,
      encryptedSize: packedBlob.size,
      encryptedFileName,
      file: finalEncryptedFile
    };
  } catch (error) {
    console.error('Encryption error:', error);

    logAuditEntry({
      action: 'encrypt',
      fileName: file?.name || 'unknown_file',
      algorithm: algorithm,
      success: false,
      fileSize: file?.size || 0
    });

    return {
      success: false,
      message: `An error occurred during encryption: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Real Decryption Function using Web Crypto API
export const decryptFile = async (
  fileInput: File | FileItem,
  password: string
): Promise<DecryptionResult> => {
  const startTime = performance.now();
  let algorithm: EncryptionAlgorithm = 'AES-256';

  try {
    let packedArrayBuffer: ArrayBuffer;
    let fallbackFileName = 'decrypted_file';

    // A. Detect if we got a real File object (from manual upload)
    if (fileInput instanceof File) {
      packedArrayBuffer = await fileInput.arrayBuffer();
      fallbackFileName = fileInput.name.replace('.encrypted', '');
    } else {
      // B. Or if we got a history FileItem, retrieve from IndexedDB
      const storedBlob = await getEncryptedBlob(fileInput.id);
      if (!storedBlob) {
        throw new Error('Encrypted file not found in local browser storage.');
      }
      packedArrayBuffer = await storedBlob.arrayBuffer();
      fallbackFileName = fileInput.name.replace('.encrypted', '');
      algorithm = fileInput.algorithm || 'AES-256';
    }

    // 1. Unpack Binary Buffer
    const { salt, iv, fileName, fileType, ciphertext } = unpackEncryptedData(packedArrayBuffer);

    // 2. Derive Cryptographic Key from password using unpacked Salt
    const aesKey = await deriveKeyFromPassword(password, salt);

    // 3. Decrypt using AES-GCM
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      aesKey,
      ciphertext
    );

    // 4. Create proper reconstructed File
    const finalFileName = fileName || fallbackFileName || 'decrypted_file';
    const finalFileType = fileType || 'application/octet-stream';
    const decryptedBlob = new Blob([decryptedBuffer], { type: finalFileType });
    const decryptedFile = new File([decryptedBlob], finalFileName, { type: finalFileType });

    const endTime = performance.now();
    const decryptionTime = endTime - startTime;

    logAuditEntry({
      action: 'decrypt',
      fileName: finalFileName,
      algorithm: algorithm,
      success: true,
      fileSize: decryptedFile.size
    });

    return {
      success: true,
      message: 'File decrypted successfully',
      file: decryptedFile,
      decryptionTime,
      algorithm
    };
  } catch (error) {
    console.error('Decryption error:', error);

    logAuditEntry({
      action: 'decrypt',
      fileName: typeof fileInput.name === 'string' ? fileInput.name : 'unknown_file',
      algorithm: algorithm,
      success: false
    });

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Decryption failed. Please check your password.'
    };
  }
};

// Retrieve history items
export const getEncryptedFiles = async (): Promise<FileItem[]> => {
  try {
    const historyFiles = JSON.parse(localStorage.getItem('fileHistory') || '[]');
    return historyFiles;
  } catch (error) {
    console.error('Error retrieving encrypted files:', error);
    return [];
  }
};

// Delete history and db blobs
export const deleteEncryptedFile = async (fileId: string): Promise<boolean> => {
  try {
    // Delete from IndexedDB
    await deleteEncryptedBlob(fileId);

    // Remove from history
    const historyFiles = JSON.parse(localStorage.getItem('fileHistory') || '[]');
    const filteredHistory = historyFiles.filter((file: FileItem) => file.id !== fileId);
    localStorage.setItem('fileHistory', JSON.stringify(filteredHistory));

    // Remove from encrypted files
    const encryptedFiles = JSON.parse(localStorage.getItem('encryptedFiles') || '[]');
    const filteredEncrypted = encryptedFiles.filter((file: { id: string }) => file.id !== fileId);
    localStorage.setItem('encryptedFiles', JSON.stringify(filteredEncrypted));

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};
