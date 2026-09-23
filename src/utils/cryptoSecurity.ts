/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * tampazar.com — AES-256-GCM Merchant Secret Encryption Engine
 * Zero-Trust Sanal POS & API Kimlik Şifreleme Modülü
 * 
 * Format: [16-byte IV (hex)]:[16-byte AuthTag (hex)]:[EncryptedCiphertext (hex)]
 */

const DEFAULT_SECRET_KEY = '12345678901234567890123456789012'; // 32 byte (256-bit)

// Helper: Convert buffer to hex string
function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper: Convert hex string to Uint8Array
function hexToBuffer(hex: string): Uint8Array {
  const cleanHex = hex.trim();
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Import or derive AES-GCM CryptoKey from 32-byte key
 */
async function getCryptoKey(customKeyStr?: string): Promise<CryptoKey> {
  const keyStr = customKeyStr || DEFAULT_SECRET_KEY;
  const enc = new TextEncoder();
  const keyData = enc.encode(keyStr.padEnd(32, '0').slice(0, 32));

  return await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt plainText using AES-256-GCM
 * Returns string format: `${ivHex}:${authTagHex}:${encryptedHex}`
 */
export async function encryptSecret(plainText: string, customKey?: string): Promise<string> {
  if (!plainText) return '';
  const cryptoKey = await getCryptoKey(customKey);
  const iv = window.crypto.getRandomValues(new Uint8Array(16)); // 16-byte IV
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);

  // Web Crypto AES-GCM appends the 16-byte (128-bit) auth tag to the end of the ciphertext
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as any,
      tagLength: 128, // 16 bytes auth tag
    },
    cryptoKey,
    data
  );

  const encryptedBytes = new Uint8Array(encryptedBuffer);
  // Split ciphertext and authTag (last 16 bytes)
  const tagLengthBytes = 16;
  const ciphertextBytes = encryptedBytes.slice(0, encryptedBytes.length - tagLengthBytes);
  const authTagBytes = encryptedBytes.slice(encryptedBytes.length - tagLengthBytes);

  const ivHex = bufferToHex(iv);
  const authTagHex = bufferToHex(authTagBytes);
  const encryptedHex = bufferToHex(ciphertextBytes);

  return `${ivHex}:${authTagHex}:${encryptedHex}`;
}

/**
 * Decrypt payload formatted as `${ivHex}:${authTagHex}:${encryptedHex}` using AES-256-GCM
 */
export async function decryptSecret(encryptedPayload: string, customKey?: string): Promise<string> {
  if (!encryptedPayload || !encryptedPayload.includes(':')) return '';
  const [ivHex, authTagHex, encryptedHex] = encryptedPayload.split(':');
  if (!ivHex || !authTagHex || !encryptedHex) return '';

  const cryptoKey = await getCryptoKey(customKey);
  const iv = hexToBuffer(ivHex);
  const authTag = hexToBuffer(authTagHex);
  const ciphertext = hexToBuffer(encryptedHex);

  // Combine ciphertext + authTag for Web Crypto API
  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext, 0);
  combined.set(authTag, ciphertext.length);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as any,
      tagLength: 128,
    },
    cryptoKey,
    combined as any
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Pure Node.js crypto equivalent code for backend & architecture reference
 */
export const NODEJS_CRYPTO_VAULT_CODE = `import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = Buffer.from(process.env.ENCRYPTION_SECRET_KEY || '12345678901234567890123456789012', 'utf-8'); // 32 byte

export function encryptSecret(plainText: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return \`\${iv.toString('hex')}:\${authTag}:\${encrypted}\`;
}

export function decryptSecret(encryptedPayload: string): string {
  const [ivHex, authTagHex, encryptedText] = encryptedPayload.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
`;
