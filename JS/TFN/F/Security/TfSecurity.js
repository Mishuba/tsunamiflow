export class TfSecurity {
    constructor() {
        // Initialize imported APIs if available
        this.credentials = window.CredentialManagerAPI ? new CredentialManagerAPI() : null;
        this.webAuthn = window.WebAuthnAPI ? new WebAuthnAPI() : null;
        this.permissions = window.PermissionsAPI ? new PermissionsAPI() : null;
    }

    // ===== Credential Manager Methods =====
    async storeCredential(id, password = '', options = {}) {
        if (!this.credentials) return;
        await this.credentials.store(id, password, options);
    }

    async getCredential(options = {}) {
        if (!this.credentials) return null;
        return await this.credentials.get(options);
    }

    async preventSilentSignIn() {
        if (!this.credentials) return;
        await this.credentials.preventSilentSignIn();
    }

    async removeCredential() {
        if (!this.credentials) return;
        await this.credentials.remove();
    }

    async autoLogin(federated = false) {
        if (!this.credentials) return null;
        return await this.credentials.autoLogin(federated);
    }

    // ===== WebAuthn Methods =====
    isWebAuthnSupported() {
        return this.webAuthn ? this.webAuthn.isSupported() : false;
    }

    async webAuthnRegister(options = {}) {
        if (!this.webAuthn) return null;
        return await this.webAuthn.register(options);
    }

    async webAuthnAuthenticate(options = {}) {
        if (!this.webAuthn) return null;
        return await this.webAuthn.authenticate(options);
    }

    static arrayBufferToBase64(buffer) {
        return WebAuthnAPI.abToBase64(buffer);
    }

    static base64ToArrayBuffer(base64) {
        return WebAuthnAPI.base64ToAb(base64);
    }

    // ===== Permissions Methods =====
    async queryPermission(name) {
        if (!this.permissions) return "unsupported";
        return await this.permissions.query(name);
    }

    async requestPermission(name) {
        if (!this.permissions) return "unsupported";
        return await this.permissions.request(name);
    }

    async watchPermission(name, callback) {
        if (!this.permissions) return null;
        return await this.permissions.watch(name, callback);
    }

    // ===== Utility =====
    isReady() {
        return {
            credentials: !!this.credentials,
            webAuthn: !!this.webAuthn,
            permissions: !!this.permissions
        };
    }
}