export const encrypt = async (text, base64Key, iv) => {
  // Convert Base64 key to Uint8Array
  const keyBytes = Uint8Array.fromBase64(base64Key)

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

  return new Uint8Array(encrypted).toBase64();
};

export const decrypt = async (cipherBytes, base64Key, iv) => {
  // Convert Base64 key to Uint8Array
  const keyBytes = Uint8Array.fromBase64(base64Key)
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
    Uint8Array.fromBase64(cipherBytes).buffer
  );

  // Decode back to string
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};  