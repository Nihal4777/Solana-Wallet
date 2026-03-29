import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { showError } from '../store/errorSlice'
import Swal from 'sweetalert2'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CFormLabel, CRow } from '@coreui/react'

const Tables = () => {
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState(0.0)
  const [balance, setBalance] = useState(null)
  const dispatch = useDispatch()
  const selectedAccount = useSelector(state => state.account.selected)
  const [isAmountValid, setIsAmountValid] = useState(true)
  const fetchBalance = async () => {
    if (!selectedAccount) return
    try {
      const response = await fetch('https://api.devnet.solana.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [selectedAccount],
        }),
      })

      const data = await response.json()
      if (data.result?.value != null) {
        setBalance(data.result.value / 1e9) // Convert lamports to SOL
      } else {
        throw new Error('Failed to fetch balance')
      }
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
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${sessionStorage.getItem("auth_token")}`);
    myHeaders.append("Accept", "application/json");

    const urlencoded = new URLSearchParams();
    urlencoded.append("value", amount);
    urlencoded.append("fromAddress", selectedAccount);
    urlencoded.append("toAddress", recipientAddress);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };

    fetch(`${import.meta.env.VITE_ENDPOINT}/transferSol`, requestOptions)
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
          fetchBalance() // Refresh balance after transaction
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
                  disabled={! recipientAddress ||
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
