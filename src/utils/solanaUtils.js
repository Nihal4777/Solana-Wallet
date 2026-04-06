import { createSignerFromKeyPair, generateKeyPairSigner } from '@solana/kit';
import bs58 from "bs58"


export const getSolBalance = async (address) => {
  const pubkey = new PublicKey(address)
  const lamports = await connection.getBalance(pubkey)
  return (lamports / 1e9).toFixed(4)
}

export const getTokenBalance = async (owner, mint) => {
  const ownerPubkey = new PublicKey(owner)
  const mintPubkey = new PublicKey(mint)
  const ata = await getAssociatedTokenAddress(mintPubkey, ownerPubkey)
  try {
    const accountInfo = await getAccount(connection, ata)
    return (Number(accountInfo.amount) / 1e6).toFixed(2) // USDC/EURC usually have 6 decimals
  } catch (err) {
    return '0.00'
  }
}

export const generateNewWallet = async () => {
 const cryptoKeyPair = await crypto.subtle.generateKey(
        { name: "Ed25519" },
        true,               // <— extractable!
        ["sign", "verify"]
    );
    const exported = await crypto.subtle.exportKey("pkcs8", cryptoKeyPair.privateKey);

    // Last 32 bytes of pkcs8 export are the private key
    const bytes = new Uint8Array(
        exported,
        exported.byteLength - 32,
        32
    );
    bytes.toString("base58")
    const privateKeyBase58 = bs58.encode(bytes);
    const exportedPublicKey = await crypto.subtle.exportKey("raw", cryptoKeyPair.publicKey);
    const publicKeyBytes = new Uint8Array(exportedPublicKey);
    const publicKeyBase58 = bs58.encode(publicKeyBytes);
    return {
        publicKeyBase58,
        privateKeyBase58
    }
}
