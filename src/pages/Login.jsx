import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CRow, CSpinner } from '@coreui/react'
import solLogo from 'src/assets/brand/svgviewer-png-output.png'
import { useNavigate } from 'react-router-dom'
import { encrypt, decrypt } from '../utils/aesUtils'
import { generateNewWallet, transferSol, transferToken } from '../utils/solanaUtils'
import { addAccounts } from '../helper/db'
const Login = () => {
    const storedTheme = useSelector((state) => state.changeState.theme)
    const navigate = useNavigate(); const dispatch = useDispatch()
    const [isLoggingIn, setLoggingIn] = useState(false);
    function handleLogin(e) {
        e.preventDefault();
    }
  const account = useSelector((state) => state.accounts.selected);

    useEffect(() => {

        // generateNewWallet().then(({ privateKeyBase58, publicKeyBase58 }) => {
        //     console.log(privateKeyBase58);
        //     console.log(publicKeyBase58);
        //     addAccounts({
        //         encryptedKey: privateKeyBase58,
        //         publicKeyBase58: publicKeyBase58,
        //         iv: "0+LUE9I255VNL54k",
        //         name: "wallet 1",
        //         id: "1"
        //     }).then(console.log)

        // });


        // transferSol("d8ZLgFUjrugT4ce645Gc8JmxPX4M7UC1BadZHXsApX1",1000,account);
        // console.log(account)

        transferToken("d8ZLgFUjrugT4ce645Gc8JmxPX4M7UC1BadZHXsApX1","900","4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",account)

    }, [])


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
