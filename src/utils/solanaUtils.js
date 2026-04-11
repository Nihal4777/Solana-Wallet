import { getTransferSolInstruction } from '@solana-program/system';
import { address, appendTransactionMessageInstructions, createKeyPairSignerFromPrivateKeyBytes, createSolanaRpc, createTransactionMessage, getBase64EncodedWireTransaction, getSignatureFromTransaction, pipe, sendAndConfirmTransactionFactory, setTransactionMessageFeePayer, setTransactionMessageFeePayerSigner, setTransactionMessageLifetimeUsingBlockhash, signTransactionMessageWithSigners } from '@solana/kit';
import bs58 from "bs58";

import { findAssociatedTokenPda, getCreateAssociatedTokenIdempotentInstructionAsync, getTransferInstruction, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token';

const rpc = createSolanaRpc(import.meta.env.VITE_SOLANA_RPC);

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
  const exportedPublicKey = await crypto.subtle.exportKey("raw", cryptoKeyPair.publicKey);
  const publicKeyBytes = new Uint8Array(exportedPublicKey);
  const publicKeyBase58 = bs58.encode(publicKeyBytes);

  const secretKey = new Uint8Array(64);
  secretKey.set(bytes, 0);
  secretKey.set(publicKeyBytes, 32);
  const privateKeyBase58 = bs58.encode(secretKey);


  return {
    publicKeyBase58,
    privateKeyBase58
  }

}


export const transferSol = async (destination, lamports, privateKey) => {


  const privateKeyBytes = bs58.decode(privateKey);
  const privateKey32 = privateKeyBytes.slice(0, 32);





  const signer = await createKeyPairSignerFromPrivateKeyBytes(
    privateKey32
  );



  const transferInstruction = getTransferSolInstruction({
    source: signer,
    destination,
    amount: lamports
  });

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  console.log(latestBlockhash)
  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    tx => setTransactionMessageFeePayer(signer.address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions([transferInstruction], tx)
  );
  console.log(transactionMessage)

  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

  const wireTx = getBase64EncodedWireTransaction(signedTransaction);

  const signature = await rpc.sendTransaction(wireTx, {
    encoding: "base64"
  }).send();

  console.log("TX:", signature);

  const transactionSignature = getSignatureFromTransaction(signedTransaction);
  console.log(transactionSignature)


  return transactionSignature;

}

export const transferToken = async (destination, tokenAmount, mintAdddress, privateKey) => {

  const privateKeyBytes = bs58.decode(privateKey);
  const privateKey32 = privateKeyBytes.slice(0, 32);





  const signer = await createKeyPairSignerFromPrivateKeyBytes(
    privateKey32
  );


  const [tokenA] = await findAssociatedTokenPda({
    mint: address(mintAdddress),
    owner: signer.address,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const [tokenB] = await findAssociatedTokenPda({
    mint: address(mintAdddress),
    owner: destination,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const createAta = await getCreateAssociatedTokenIdempotentInstructionAsync({
    signer,
    mint: address(mintAdddress),
    owner: destination,
  });



  const transferInstruction = getTransferInstruction({
    source: tokenA,
    destination: tokenB,
    authority: signer,
    amount: tokenAmount
  });

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  console.log(transferInstruction)
  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    tx => setTransactionMessageFeePayer(signer.address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions([createAta, transferInstruction], tx)
  );
  console.log(transactionMessage)

  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

  const wireTx = getBase64EncodedWireTransaction(signedTransaction);

  const signature = await rpc.sendTransaction(wireTx, {
    encoding: "base64"
  }).send();

  console.log("TX:", signature);

  const transactionSignature = getSignatureFromTransaction(signedTransaction);
  console.log(transactionSignature)
  return transactionSignature;


}