export class WebAuthnAPI {
    constructor() {
        this.supported = !!(window.PublicKeyCredential);
    }

    // Check if WebAuthn is available
    isSupported() {
        return this.supported;
    }

    // Create a new credential (registration)
    async register({ username, displayName, challenge, rp = { name: "Tsunami Flow" }, userId } = {}) {
        if (!this.supported) throw new Error("WebAuthn not supported in this browser");

        try {
            const publicKey = {
                challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
                rp,
                user: {
                    id: Uint8Array.from(userId, c => c.charCodeAt(0)),
                    name: username,
                    displayName
                },
                pubKeyCredParams: [
                    { type: "public-key", alg: -7 }, // ES256
                    { type: "public-key", alg: -257 } // RS256
                ],
                timeout: 60000,
                attestation: "direct",
                authenticatorSelection: {
                    authenticatorAttachment: "platform", // or "cross-platform"
                    requireResidentKey: false,
                    userVerification: "preferred"
                }
            };

            const credential = await navigator.credentials.create({ publicKey });
            console.log("Credential created:", credential);
            return credential;
        } catch (err) {
            console.error("WebAuthn registration failed:", err);
            return null;
        }
    }

    // Request a credential (login/authentication)
    async authenticate({ challenge, allowCredentials = [], userVerification = "preferred" } = {}) {
        if (!this.supported) throw new Error("WebAuthn not supported in this browser");

        try {
            const publicKey = {
                challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
                allowCredentials: allowCredentials.map(cred => ({
                    id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0)),
                    type: "public-key",
                    transports: cred.transports || ["internal"]
                })),
                timeout: 60000,
                userVerification
            };

            const assertion = await navigator.credentials.get({ publicKey });
            console.log("Authentication successful:", assertion);
            return assertion;
        } catch (err) {
            console.error("WebAuthn authentication failed:", err);
            return null;
        }
    }

    // Convert ArrayBuffer to Base64
    static abToBase64(buffer) {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    }

    // Convert Base64 to ArrayBuffer
    static base64ToAb(base64) {
        return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    }
}