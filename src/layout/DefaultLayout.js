import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { CToast, CToastBody, CToastClose, CToaster, CToastHeader } from '@coreui/react';
import { addAccount, changeAccount } from '../store/accountSlice'
import { useDispatch } from 'react-redux'
const DefaultLayout = () => {
  const [toastKey, setToastKey] = useState(0)
  let navigate = useNavigate();

  const errorMessage = useSelector((state) => state.error.message)
  const id = useSelector((state) => state.error.id)
  const dispatch = useDispatch();
  useEffect(() => {
    if (sessionStorage.getItem("auth_token") == null) {
      navigate("/login");
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${sessionStorage.getItem("auth_token")}`);
    myHeaders.append("Accept", "application/json");
    fetch(`${import.meta.env.VITE_ENDPOINT}/getContext`, { headers: myHeaders })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      })
      .then((result) => {
        if (result.accounts) {
          dispatch(changeAccount(result.accounts[0].address))
          dispatch(addAccount(result.accounts));
        }

      })
      .catch((error) => console.error(error));
  });
  useEffect(() => {
    if (errorMessage) {
      setToastKey(Date.now())  // generate a fresh key on new message
    }
  }, [id])
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        {errorMessage && (<CToaster className="p-3 mb-5" placement="bottom-end" >
          <CToast key={toastKey} animation={false} visible={true}>
            <CToastHeader closeButton>
              <svg
                className="rounded me-2"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
              >
                <rect width="100%" height="100%" fill="#007aff"></rect>
              </svg>
              <div className="fw-bold me-auto">Solana PoC</div>
              <small>just now</small>
            </CToastHeader>
            <CToastBody>{errorMessage}</CToastBody>
          </CToast>
        </CToaster>)}
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
