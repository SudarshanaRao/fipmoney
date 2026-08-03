import CryptoJS from 'crypto-js';

const AES_SECRET_KEY = import.meta.env.VITE_AES_SECRET_KEY || 'fipmoney_256bit_ssl_encryption_key_32b'; // Same 32 bytes fallback as backend

export function decryptData256(encryptedText: string) {
  if (!encryptedText || !encryptedText.startsWith('enc256:')) return encryptedText;
  try {
    const parts = encryptedText.split(':');
    const iv = CryptoJS.enc.Hex.parse(parts[1]);
    const encryptedData = CryptoJS.enc.Hex.parse(parts[2]);
    const key = CryptoJS.enc.Utf8.parse(AES_SECRET_KEY.padEnd(32).slice(0, 32));
    
    // We need to create a CipherParams object to decrypt raw hex data with crypto-js
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedData
    });
    
    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      key,
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error('Decryption error:', err);
    return '';
  }
}
