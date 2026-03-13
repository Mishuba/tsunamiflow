export class CredentialManagerAPI {
    constructor() {
        this.credentialsSupported = ('credentials' in navigator);
    }

    /**
     * Store credentials (username/password or federated login)
     * @param {string} id - username or account id
     * @param {string} password - password (ignored for federated)
     * @param {object} options - { name, iconURL, federatedURL }
     */
    async store(id, password = '', options = {}) {
        if (!this.credentialsSupported) {
            console.warn("Credential Management API not supported in this browser");
            return;
        }

        try {
            let cred;
            if (options.federatedURL) {
                // Federated credential (Google, Facebook, etc.)
                cred = new FederatedCredential({
                    id,
                    name: options.name || id,
                    iconURL: options.iconURL || '',
                    provider: options.federatedURL
                });
            } else {
                // Standard password credential
                cred = new PasswordCredential({
                    id,
                    password,
                    name: options.name || id,
                    iconURL: options.iconURL || ''
                });
            }

            await navigator.credentials.store(cred);
            console.log("Credentials stored successfully");
        } catch (err) {
            console.error("Failed to store credentials:", err);
        }
    }

    /**
     * Retrieve credentials
     * @param {object} options - { federated: boolean, mediation: "optional"|"silent"|"required" }
     * @returns Credential object or null
     */
    async get(options = {}) {
        if (!this.credentialsSupported) return null;

        try {
            const cred = await navigator.credentials.get({
                password: !options.federated,
                federated: !!options.federated,
                mediation: options.mediation || "optional"
            });
            return cred || null;
        } catch (err) {
            console.error("Failed to retrieve credentials:", err);
            return null;
        }
    }

    /**
     * Prevent automatic silent sign-in
     */
    async preventSilentSignIn() {
        if (!this.credentialsSupported) return;

        try {
            await navigator.credentials.preventSilentAccess();
            console.log("Silent access prevented");
        } catch (err) {
            console.error("Failed to prevent silent sign-in:", err);
        }
    }

    /**
     * Clear credentials
     * Note: There’s no direct delete, overwrite with empty credentials
     */
    async remove() {
        if (!this.credentialsSupported) return;

        try {
            const cred = new PasswordCredential({
                id: '',
                password: ''
            });
            await navigator.credentials.store(cred);
            console.log("Credentials cleared");
        } catch (err) {
            console.error("Failed to remove credentials:", err);
        }
    }

    /**
     * Utility: Attempt automatic login (password or federated)
     * Returns retrieved credentials or null
     */
    async autoLogin(federated = false) {
        try {
            const cred = await this.get({ federated, mediation: "silent" });
            if (cred) {
                console.log("Auto-login retrieved:", cred.id);
                return cred;
            } else {
                console.log("No stored credentials for auto-login");
                return null;
            }
        } catch (err) {
            console.error("Auto-login error:", err);
            return null;
        }
    }
}