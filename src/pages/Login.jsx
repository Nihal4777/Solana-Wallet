import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CRow, CSpinner } from '@coreui/react'
import solLogo from 'src/assets/brand/svgviewer-png-output.png'
import { useNavigate } from 'react-router-dom'
import { encrypt, decrypt } from '../utils/aesUtils'
const Login = () => {
    const storedTheme = useSelector((state) => state.changeState.theme)
    const navigate = useNavigate(); const dispatch = useDispatch()
    const [isLoggingIn, setLoggingIn] = useState(false);
    function handleLogin(e) {
        e.preventDefault();
    }


    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8}>
                        <CCardGroup>
                            <CCard
                                className={`mx-auto p-4 d-block ${storedTheme == 'light' ? 'bg-dark text-white' : ''
                                    }`}
                            >
                                <CCardBody>
                                    <img src={solLogo} className="d-block mx-auto mb-4" />

                                    {/* Title */}
                                    <h4 className="text-center mb-2">Access Your Wallet</h4>
                                    <p className="text-center small mb-4">
                                        Use your device biometrics (Face ID / Fingerprint) to securely log in.
                                    </p>

                                    {/* Info Section */}
                                    <div className="mb-4 small">
                                        <p><strong>🔐 Login Security</strong></p>
                                        <ul>
                                            <li>Authenticate using your device biometrics</li>
                                            <li>No passwords required</li>
                                            <li>Private key never leaves your device</li>
                                        </ul>

                                        <p className="mt-3"><strong>⚠️ Important</strong></p>
                                        <ul>
                                            <li>Login only works on this device</li>
                                            <li>Biometric authentication must be enabled</li>
                                            <li>Ensure your device is secure</li>
                                        </ul>
                                    </div>

                                    {/* CTA */}
                                    <CForm>
                                        <CRow>
                                            <CCol xs={12}>
                                                <div className="d-grid gap-2 col-12 mx-auto">
                                                    {isLoggingIn ? (
                                                        <CSpinner variant="grow" className="mx-auto" />
                                                    ) : (
                                                        <button
                                                            className={`mx-4 my-2 btn btn-primary ${isLoggingIn ? 'disabled' : ''
                                                                }`}
                                                            onClick={handleLogin}
                                                        >
                                                            Login with Biometrics
                                                        </button>
                                                    )}
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
