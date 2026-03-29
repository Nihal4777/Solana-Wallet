import { Connection, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token'

const connection = new Connection('https://api.devnet.solana.com')

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
