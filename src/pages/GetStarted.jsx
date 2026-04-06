import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CRow, CSpinner } from '@coreui/react'
import solLogo from 'src/assets/brand/svgviewer-png-output.png'
import { useNavigate } from 'react-router-dom'
const GetStarted = () => {
    const storedTheme = useSelector((state) => state.changeState.theme)
    const [searchParams] = useSearchParams(); const code = searchParams.get("code");
    const navigate = useNavigate(); const dispatch = useDispatch()
    const [isClicked, setClicked] = useState(false);
    useEffect(() => {
        if (code != null) {

        }
    }, []);



    function base64urlToUint8Array(base64url) {
        const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
        const base64 = (base64url + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        return Uint8Array.fromBase64(base64)
    }

    async function completeRegistration(id, attestationResponse) {
        return fetch(`${import.meta.env.VITE_ENDPOINT}/complete-registration`, {
            "method": "POST",
            body: JSON.stringify({
                id,
                attestationResponse
            }),
            headers: {
                "content-type": "application/json"
            }

        })
    }

    async function beginPasskeyGeneration(options) {
        const publicKey = { ...options, challenge: base64urlToUint8Array(options.challenge), user: { ...options.user, id: base64urlToUint8Array(options.user.id) } };
        console.log({ publicKey });
        return navigator.credentials.create({ publicKey });
    }

    function handleGetStarted(e) {
        e.preventDefault();
        setClicked(true)
        fetch(`${import.meta.env.VITE_ENDPOINT}/get-started`, {
            method: 'POST'
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            })
            .then(async (result) => {
                //begin passkey generation
                const publicKeyCredential = await beginPasskeyGeneration(result);
                // send it to server for verification
                console.log(JSON.stringify(publicKeyCredential));
                const response = await completeRegistration(result.user.id, publicKeyCredential);
                if (response.success) {


                }
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setClicked(false);
            })

    }
    console.log(storedTheme)
    return (<div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
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
                                <h4 className="text-center mb-2">Create Your Secure Wallet</h4>
                                <p className="text-center small mb-4">
                                    Use your device biometrics (Face ID / Fingerprint) to create a passwordless wallet.
                                </p>

                                {/* Info Section */}
                                <div className="mb-4 small">
                                    <p><strong>🔐 How it works</strong></p>
                                    <ul>
                                        <li>Your wallet is secured using device authentication</li>
                                        <li>No passwords required</li>
                                        <li>Private key stays on your device</li>
                                    </ul>

                                    <p className="mt-3"><strong>⚠️ Important</strong></p>
                                    <ul>
                                        <li>This wallet is tied to this device</li>
                                        <li>No password recovery available</li>
                                        <li>Do not use shared/public devices</li>
                                    </ul>
                                </div>

                                {/* CTA */}
                                <CForm>
                                    <CRow>
                                        <CCol xs={12}>
                                            <div className="d-grid gap-2 col-12 mx-auto">


                                                {isClicked ? (
                                                    <CSpinner variant="grow" className="mx-auto" />
                                                ) : (<button
                                                    className={`mx-4 my-2 btn btn-primary ${isClicked ? 'disabled' : ''
                                                        }`}
                                                    onClick={handleGetStarted}
                                                >
                                                    Get Started
                                                </button>)}
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
    </div>)
}

export default GetStarted
