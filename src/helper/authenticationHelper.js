export async function fetchEncryptionKey(id) {
    const response = await fetch(`${import.meta.env.VITE_ENDPOINT}/authenticate/options`, {
        method: 'POST',
        body: JSON.stringify(
            {
                id
            }
        ),
        headers: {
            "content-type": "application/json"
        }
    })

    const result = await response.json();
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
    const loginResponse = await fetch(`${import.meta.env.VITE_ENDPOINT}/authenticate/verify`, {
        method: 'POST',
        body: JSON.stringify({
            id,
            credential
        }),
        headers: {
            "content-type": "application/json"
        }
    })
    const loginResult = await loginResponse.json();
    return loginResult.key;
}

function base64urlToUint8Array(base64url) {
    const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
    const base64 = (base64url + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    return Uint8Array.fromBase64(base64)
}