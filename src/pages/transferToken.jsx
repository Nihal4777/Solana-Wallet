import React, { useEffect, useState } from 'react'
import {
  CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput,
  CFormLabel, CFormSelect, CRow
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'
import { showError } from '../store/errorSlice'
import Swal from 'sweetalert2'
import { address, createSolanaRpc } from '@solana/kit'
const SOLANA_RPC = 'https://api.devnet.solana.com'
const TokenTransfer = () => {
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState('')
  const [selectedTokenLabel, setSelectedTokenLabel] = useState('')
  const [tokenBalance, setTokenBalance] = useState(0)
  const rpc = createSolanaRpc(SOLANA_RPC);
  const dispatch = useDispatch()
  const selectedAccount = useSelector(state => state.accounts.selected)
  const [isAmountValid, setIsAmountValid] = useState(true)
  const tokens = [
    { value: 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr', label: 'EURC' },
    { value: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', label: 'USDC' }
  ]

  const fetchTokenBalance = async () => {
    if (!selectedToken || !selectedAccount) return
    try {
      const tokenAccounts = await rpc.getTokenAccountsByOwner(selectedAccount.publicKeyBase58, {
        mint: address(selectedToken)
      }, {
        encoding: "jsonParsed"
      }).send()
      console.log(tokenAccounts);
      if (tokenAccounts.value.length) {
        const usdtBalance = await rpc
          .getTokenAccountBalance(tokenAccounts.value[0].pubkey)
          .send();

        const amount = usdtBalance.value.amount;
        const decimals = usdtBalance.value.decimals;

        const formattedBalance = Number(amount) / Math.pow(10, decimals);

        console.log(formattedBalance);

        setTokenBalance(formattedBalance);
      }
      else {
        setTokenBalance(0);
      }
    } catch (err) {
      console.error('Error fetching token balance:', err)
      dispatch(showError('Error fetching token balance: ' + err.message))
    }
  }

  useEffect(() => {
    fetchTokenBalance()
    const interval = setInterval(fetchTokenBalance, 10000)
    return () => clearInterval(interval)
  }, [selectedToken, selectedAccount])

  const handleSubmit = (e) => {
    e.preventDefault()
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded")
    myHeaders.append("Authorization", `Bearer ${sessionStorage.getItem("auth_token")}`)
    myHeaders.append("Accept", "application/json")

    const urlencoded = new URLSearchParams()
    urlencoded.append("value", amount)
    urlencoded.append("fromAddress", selectedAccount)
    urlencoded.append("tokenAddress", selectedToken)
    urlencoded.append("toAddress", recipientAddress)

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    }

    fetch(`${import.meta.env.VITE_ENDPOINT}/transferToken`, requestOptions)
      .then(async (response) => {
        const data = await response.json()

        if (!response.ok) {
          let errorMessage = data.error
          if (data.errors) {
            errorMessage += ': ' + Object.entries(data.errors)
              .map(([field, msg]) => `${field} - ${msg}`)
              .join(', ')
          }
          throw new Error(errorMessage)
        } else {
          Swal.fire({
            title: "Transaction successful",
            html: `<a href="https://solana.fm/tx/${data.txnHash}?cluster=devnet-alpha" target="_blank">View in Solscan</a>`,
            icon: "success"
          })
          setRecipientAddress("")
          setAmount(0.0)
          fetchTokenBalance() // Refresh after transfer
        }

        dispatch(showError("Transaction successful ✅"))
      })
      .catch((error) => {
        console.error(error)
        dispatch(showError("We're experiencing an unexpected issue. Please try again later.:" + error.message))
      })
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardBody>
              Available Balance: {selectedToken ? (
                tokenBalance !== null ? `${tokenBalance.toFixed(4)} ${selectedTokenLabel}` : 'Loading...'
              ) : 'Select a token'}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Transfer Tokens</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel>Select Token</CFormLabel>
                  <CFormSelect
                    value={selectedToken}
                    onChange={(e) => {
                      setSelectedToken(e.target.value)
                      setSelectedTokenLabel(e.target.selectedOptions[0].innerText)
                    }}
                    required
                  >
                    <option value="">Choose token...</option>
                    {tokens.map(token => (
                      <option key={token.value} value={token.value}>
                        {token.label}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
                <div className="mb-3">
                  <CFormLabel>Recipient Address</CFormLabel>
                  <CFormInput
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="Enter recipient's address"
                    required
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Amount</CFormLabel>
                  <CFormInput
                    type="number"
                    step="0.000000001"
                    min="0"
                    value={amount}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value)
                      setAmount(e.target.value)
                      setIsAmountValid(
                        tokenBalance === null || isNaN(value) || value <= tokenBalance
                      )
                    }}
                    placeholder="Enter amount to send"
                    required
                  />
                </div>
                <CButton type="submit" color="primary" disabled={!isAmountValid || !amount
                  || parseFloat(amount) === 0 || !selectedToken}>
                  Send {selectedTokenLabel || 'Tokens'}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default TokenTransfer
