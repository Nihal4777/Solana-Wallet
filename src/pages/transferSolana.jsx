import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { showError } from '../store/errorSlice'
import Swal from 'sweetalert2'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CFormLabel, CRow } from '@coreui/react'
import { address, createSolanaRpc } from '@solana/kit'
import { transferSol } from '../utils/solanaUtils'
const SOLANA_RPC = 'https://api.devnet.solana.com'
const Tables = () => {
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState(0.0)
  const [balance, setBalance] = useState(0)
  const dispatch = useDispatch()
  const selectedAccount = useSelector(state => state.accounts.selected)
  const [isAmountValid, setIsAmountValid] = useState(true)
  const rpc = createSolanaRpc(SOLANA_RPC);
  const fetchBalance = async () => {
    if (!selectedAccount) return

    try {
      const response = await rpc.getAccountInfo(address(selectedAccount.publicKeyBase58)).send()
      const balance = (Number(response.value?.lamports)  || 0) / 1e9;
      console.log(typeof balance)
        setBalance(balance) // Convert lamports to SOL
    } catch (err) {
      console.error('Error fetching balance:', err)
      dispatch(showError('Error fetching balance: ' + err.message))
    }


  }

  useEffect(() => {
    fetchBalance() // Initial fetch
    const interval = setInterval(fetchBalance, 10000) // Every 10 seconds
    return () => clearInterval(interval) // Cleanup on unmount
  }, [selectedAccount])

  const handleSubmit = (e) => {

    e.preventDefault()

    transferSol(recipientAddress, amount * 1000000000, selectedAccount)
      .then(async (response) => {
        

        // if (!response.ok) {
        //   let errorMessage = data.error
        //   if (data.errors) {
        //     errorMessage += ': ' + Object.entries(data.errors)
        //       .map(([field, msg]) => `${field} - ${msg}`)
        //       .join(', ')
        //   }
        //   throw new Error(errorMessage)
        // } else {
          Swal.fire({
            title: "Transaction successful",
            html: `<a href="https://solana.fm/tx/${response}?cluster=devnet-alpha" target="_blank">View in Solscan</a>`,
            icon: "success"
          })
          setRecipientAddress("")
          setAmount(0.0)
          fetchBalance() // Refresh balance after transaction
        // }
        // dispatch(showError("Transaction successful ✅"))
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
              Available Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Transfer SOL</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel>Recipient Address</CFormLabel>
                  <CFormInput
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="Enter recipient's Solana address"
                    required
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Amount (SOL)</CFormLabel>
                  <CFormInput
                    type="number"
                    step="0.000000001"
                    min="0"
                    value={amount}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value)
                      setAmount(e.target.value)
                      setIsAmountValid(
                        balance === null || isNaN(value) || (value > 0 && value <= balance)
                      )
                    }}
                    placeholder="Enter amount to send"
                    required
                  />
                </div>
                <CButton
                  type="submit"
                  color="primary"
                  disabled={!recipientAddress ||
                    !isAmountValid ||
                    !amount ||
                    parseFloat(amount) === 0 ||
                    balance === null
                  }
                >
                  Send SOL
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Tables
