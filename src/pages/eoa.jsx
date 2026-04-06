import React, { useState } from 'react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
} from '@coreui/react'
import { cilCopy, } from '@coreui/icons'
import { DocsComponents, DocsExample } from 'src/components'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import CIcon from '@coreui/icons-react'
import Swal from 'sweetalert2'
const handleShowPrivateKey = async (account) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${sessionStorage.getItem("auth_token")}`);
  const result = await Swal.fire({
    title: 'Reveal Private Key?',
    html: `
      <p>This key gives full access to your account.</p>
      <p style="color:red;font-weight:bold;">
        Never share it with anyone. Anyone with this key can steal your assets.
      </p>
      <p>Are you sure you want to view it?</p>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, show it',
    cancelButtonText: 'Cancel',
    focusCancel: true,
  });
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
  if (result.isConfirmed) {
    try {
      const response = await fetch(`${import.meta.env.VITE_ENDPOINT}/getPrivateKey/${account.address}`, {
        headers: myHeaders
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const privateKey = await response.text();

      Swal.fire({
        title: 'Your Private Key',
        html: `
          <div style="text-align:left;">
            <p style="margin-bottom: 0.5rem;"><strong>Keep this safe:</strong></p>
            <code id="private-key" style="
              display: block;
              background: #f5f5f5;
              border: 1px solid #ccc;
              padding: 10px;
              border-radius: 5px;
              word-break: break-all;
            ">${privateKey}</code>
            <button id="copy-btn" style="
        margin-top:10px;
        background-color:#3085d6;
        color:white;
        border:none;
        padding:8px 12px;
        border-radius:4px;
        cursor:pointer;
      ">
        Copy to Clipboard
      </button>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Close',
        allowOutsideClick: false,
        didOpen: () => {
          const copyBtn = document.getElementById('copy-btn');
          const keyText = document.getElementById('private-key').innerText;

          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(keyText).then(() => {
              Toast.fire({
                icon: 'success',
                title: 'Copied to clipboard!',
              });
            });
          });
        },
      });

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch the private key.',
        icon: 'error',
      });
    }
  }
}
const handleRemoveAccount = async (account, setAddresses) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${sessionStorage.getItem("auth_token")}`);
  const result = await Swal.fire({
    title: 'Are you sure you want to remove?',
    html: `
      <p style="color:red;font-weight:bold;">Removing from Backpack will delete the wallet's keypair. Make sure you have exported and saved the private key before removing.?</p>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove',
    cancelButtonText: 'Cancel',
    focusCancel: true,
  });
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
  if (result.isConfirmed) {
    try {
      const response = await fetch(`${import.meta.env.VITE_ENDPOINT}/removeAccount/${account.address}`, {
        headers: myHeaders
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      Toast.fire({
        icon: 'success',
        title: 'Account removed!',
      });
      setAddresses(prev => prev.filter(a => a.address !== account.address));

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to remove the account',
        icon: 'error',
      });
    }
  }
}
const Tables = () => {
  const accounts = useSelector((state) => state.accounts.accounts)
  let [addresses, setAddresses] = useState([]);

  useEffect(() => {
    setAddresses(accounts)

  }, [accounts]);

  return (

    <>
      <CRow className="mb-4"> <CCol>
        <CCard>
          <CCardBody>
            <CButton color="primary" disabled>
              Generate New EOA Address{" "}
              <CBadge color="light" textColor="dark" className="ms-2">
                Coming Soon
              </CBadge>
            </CButton>
          </CCardBody>
        </CCard>
      </CCol></CRow>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>EOA Addresses</strong> <small></small>
            </CCardHeader>
            <CCardBody>
              <CTable responsive>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                  </CTableRow>

                  {addresses && addresses.map((address, i) => (
                    <CTableRow key={i + 1}>
                      <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                      <CTableDataCell>{address.publicKeyBase58}</CTableDataCell>
                      <CTableDataCell><CButton color="primary" onClick={() => {
                        navigator.clipboard.writeText(address.publicKeyBase58)
                      }}> <CIcon icon={cilCopy} size="md" /></CButton></CTableDataCell>
                      <CTableDataCell><CButton color="warning" onClick={() => {
                        handleShowPrivateKey(address)
                      }}> View Secret</CButton></CTableDataCell>
                      <CTableDataCell><CButton color="danger" onClick={() => {
                        handleRemoveAccount(address, setAddresses)
                      }}> Remove Account</CButton></CTableDataCell>


                    </CTableRow>
                  ))
                  }


                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>


  )
}

export default Tables
