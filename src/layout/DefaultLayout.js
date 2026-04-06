import { useEffect, useState } from 'react';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react';
import { useDispatch } from 'react-redux';
import { addAccounts, getAccounts } from '../helper/db';
import { generateNewWallet } from '../utils/solanaUtils';
import { encrypt } from '../utils/aesUtils';
import { addAccount } from '../store/accountSlice';


const DefaultLayout = () => {
  const [toastKey, setToastKey] = useState(0)
  let navigate = useNavigate();

  const errorMessage = useSelector((state) => state.error.message)
  const id = useSelector((state) => state.error.id)
  const dispatch = useDispatch();

  useEffect(() => {

    getAccounts().then(accounts => {
      

      if (accounts.length == 0) {
        navigate("/get-started")
      }
      else {

        // generateNewWallet().then(({ privateKeyBase58, publicKeyBase58 }) => {
          
        //   dispatch(addAccount({
        //     publicKey: publicKeyBase58
        //   }))
        //   const iv = crypto.getRandomValues(new Uint8Array(12));

        //   // const encryptedKey = encrypt(privateKey, "P5DPQzZdyeG2a7FoDRD0cw==", iv)
        //   const encryptedKey = privateKeyBase58;

        //   addAccounts({
        //     id: "1",
        //     "name": "wallet 1",
        //     encryptedKey,
        //     publicKeyBase58,
        //     iv: iv.toBase64()
        //   });
        // });
      }




      console.log(accounts);
    })


    //generate wallet


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
        {false && (<CToaster className="p-3 mb-5" placement="bottom-end" >
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
