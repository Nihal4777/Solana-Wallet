import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner } from '@coreui/react'

const USDC_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
const EURC_MINT = 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr' // Replace with real if needed
const SOLANA_RPC = 'https://api.devnet.solana.com'

const Dashboard = () => {
  const selectedAccount = useSelector(state => state.account.selected)
  const [solBalance, setSolBalance] = useState(null)
  const [usdcBalance, setUsdcBalance] = useState(null)
  const [eurcBalance, setEurcBalance] = useState(null)

  useEffect(() => {
    if (!selectedAccount) return

    const fetchBalances = async () => {
      // SOL balance
      try {
        const solRes = await fetch(SOLANA_RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getBalance',
            params: [selectedAccount],
          }),
        })
        const solJson = await solRes.json()
        setSolBalance((solJson.result?.value || 0) / 1e9)
      } catch {
        setSolBalance(null)
      }

      // USDC balance
      try {
        const usdcRes = await fetch(SOLANA_RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'getTokenAccountsByOwner',
            params: [
              selectedAccount,
              { mint: USDC_MINT },
              { encoding: 'jsonParsed' },
            ],
          }),
        })
        const usdcJson = await usdcRes.json()
        const amount =
          usdcJson.result?.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0
        setUsdcBalance(amount)
      } catch {
        setUsdcBalance(null)
      }

      // EURC balance
      try {
        const eurcRes = await fetch(SOLANA_RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 3,
            method: 'getTokenAccountsByOwner',
            params: [
              selectedAccount,
              { mint: EURC_MINT },
              { encoding: 'jsonParsed' },
            ],
          }),
        })
        const eurcJson = await eurcRes.json()
        const amount =
          eurcJson.result?.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0
        setEurcBalance(amount)
      } catch {
        setEurcBalance(null)
      }
    }

    fetchBalances() // initial load
    const interval = setInterval(fetchBalances, 10000) // every 10 sec

    return () => clearInterval(interval) // cleanup
  }, [selectedAccount])

  const renderCard = (label, balance) => (
    <CCol xs={12} md={4} key={label}>
      <CCard>
        <CCardHeader>{label}</CCardHeader>
        <CCardBody>{balance === null ? <CSpinner size="sm" /> : <h4>{balance}</h4>}</CCardBody>
      </CCard>
    </CCol>
  )

  return (
    <CRow>
      {renderCard('SOL Balance', solBalance)}
      {renderCard('USDC Balance', usdcBalance)}
      {renderCard('EURC Balance', eurcBalance)}
    </CRow>
  )
}

export default Dashboard
