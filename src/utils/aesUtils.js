// utils/crypto.js
export const encrypt = async (text, base64Key, iv) => {
  // Convert Base64 key to Uint8Array
  const keyBytes = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));

  // Import key for AES-GCM
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  // Encode text to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    cryptoKey,
    data
  );
  // // Decode back to string
  // const decoder = new TextDecoder();
  // return atob() decoder.decode(encrypted);// return as bytes
};

export const decrypt = async (cipherBytes, base64Key, iv) => {
  // Convert Base64 key to Uint8Array
  const keyBytes = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));

  // Import key for AES-GCM
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    cryptoKey,
    cipherBytes
  );

  // Decode back to string
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};