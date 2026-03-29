import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
    CSpinner,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import solLogo from 'src/assets/brand/svgviewer-png-output.png'
import gitHubLogo from 'src/assets/brand/github.png'
import { addAccount, changeAccount } from '../store/accountSlice'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const storedTheme = useSelector((state) => state.changeState.theme)
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [isRedirect, setRedirect] = useState(false);
    useEffect(() => {
        if (code != null) {
            fetch(`${import.meta.env.VITE_ENDPOINT}/authenticate/${code}`)
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
                    console.log(result);
                    sessionStorage.setItem("auth_token", result.jwtToken);
                    navigate("/", { replace: true });

                })
                .catch((error) => console.error(error));
            setRedirect(true);
        }
    })
console.log(storedTheme)

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={4}>
                    <CCardGroup >
                            <CCard className={`mx-auto p-4 d-block ${storedTheme=='light' ? 'bg-dark' : ''}`}>
                                <CCardBody>
                                        <img src={solLogo} className="d-block mx-auto" />
                                    <CForm>
                                        <CRow>
                                            <CCol xs={12}>
                                                <div className="d-grid gap-2 col-12 mx-auto">
                                                    <a color="primary" className={`mx-4 my-4 btn btn-primary ${isRedirect ? 'disabled' : ''}`} href='https://github.com/login/oauth/authorize?scope=user:email&client_id=Ov23liHz7RU9xRk4lUPJ'>
                                                        <img src={gitHubLogo} style={{ "width": "32px" }} /> Continue with Github</a>
                                                    {isRedirect && <CSpinner variant="grow" className='mx-auto' />}
                                                </div>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Login
