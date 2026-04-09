import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CRow, CSpinner } from '@coreui/react'
import solLogo from 'src/assets/brand/svgviewer-png-output.png'
import { useNavigate } from 'react-router-dom'
import { getAccounts } from '../helper/db'
import { setAccounts } from '../store/accountSlice'
const Login = () => {
    const storedTheme = useSelector((state) => state.changeState.theme)
    const navigate = useNavigate(); const dispatch = useDispatch()
    const [isClicked, setClicked] = useState(false);
    function handleLogin(e) {
        e.preventDefault();
        setClicked(true)
        fetch(`${import.meta.env.VITE_ENDPOINT}/authenticate/options`, {
            method: 'POST',
            body: JSON.stringify(
                {
                    id: account.id
                }
            ),
            headers: {
                "content-type": "application/json"
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            })
            .then(async (result) => {
                const publicKey = {
                    ...result, challenge: base64urlToUint8Array(result.challenge),
                    allowCredentials: result.allowCredentials.map(cred => {
                        return {
                            ...cred,
                            id: base64urlToUint8Array(cred.id)
                        }
                    })
                }
                let credential = await navigator.credentials.get({
                    publicKey
                })
                fetch(`${import.meta.env.VITE_ENDPOINT}/authenticate/verify`, {
                    method: 'POST',
                    body: JSON.stringify({
                        id: account.id,
                        credential
                    }),
                    headers: {
                        "content-type": "application/json"
                    }
                }).then(response.json()).then(jsonResponse => {
                    console.log(jsonResponse);
                })




            }).catch((error) => console.error(error))
            .finally(() => {
                setClicked(false);
            })

    }
    const [account, setAccount] = useState({});

    useEffect(() => {

        getAccounts().then(accounts => {
            if (!accounts.length) {
                navigate("/get-started");
            }
            console.log(accounts)
            dispatch(setAccounts(accounts))
            setAccount(accounts[0])


        });


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




    }, [])

    function base64urlToUint8Array(base64url) {
        const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
        const base64 = (base64url + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        return Uint8Array.fromBase64(base64)
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
                                                    {isClicked ? (
                                                        <CSpinner variant="grow" className="mx-auto" />
                                                    ) : (
                                                        <button
                                                            className={`mx-4 my-2 btn btn-primary ${isClicked ? 'disabled' : ''
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
