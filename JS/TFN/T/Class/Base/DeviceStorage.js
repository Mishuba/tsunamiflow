export class Mi extends Na {
    namespace = "tf";
    cookieenabled = navigator.cookieEnabled;
    cookies = this.cookieenabled ? this.parsecookie() : {};
this.SessionStorage = window.sessionStorage;
    constructor(options = {}) {
        super(options);
    }

    Sessionkey(name) {
        return `${this.namespace}:${name}`;
    }

    setSession(name, value) {

        try {

            const data = JSON.stringify(value);

            this.SessionStorage.setItem(
                this.Sessionkey(name),
                data
            );

            return true;

        } catch (err) {

            console.error("TfSessionStorage set failed:", err);
            return false;

        }

    }

    getSession(name) {

        const value = this.SessionStorage.getItem(
            this.Sessionkey(name)
        );

        if (value === null) return null;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }

    }

    removeSession(name) {

        this.SessionStorage.removeItem(
            this.Sessionkey(name)
        );

    }

    Sessionhas(name) {

        return this.SessionStorage.getItem(
            this.Sessionkey(name)
        ) !== null;

    }

    Sessionkeys() {

        const list = [];

        for (let i = 0; i < this.SessionStorage.length; i++) {

            const key = this.SessionStorage.Sessionkey(i);

            if (key.startsWith(this.namespace + ":")) {

                list.push(
                    key.replace(this.namespace + ":", "")
                );

            }

        }

        return list;

    }

    clearSession() {

        const keys = this.Sessionkeys();

        keys.forEach(k => {
            this.removeSession(k);
        });

    }

    Sessionsize() {

        let bytes = 0;

        for (let i = 0; i < this.SessionStorage.length; i++) {

            const key = this.SessionStorage.key(i);

            if (key.startsWith(this.namespace + ":")) {

                const value = this.SessionStorage.getItem(key);

                bytes += key.length + value.length;

            }

        }

        return bytes;

    }
    cookiekey(name) {
        return `${this.namespace}:${name}`;
    }

    parsecookie() {

        const jar = {};

        if (!document.cookie) return jar;

        document.cookie.split(";").forEach(cookie => {

            const parts = cookie.split("=");

            const key = parts.shift().trim();
            const value = parts.join("=");

            jar[key] = decodeURIComponent(value);

        });

        return jar;

    }

    setcookie(name, value, {
        days = 7,
        path = "/",
        secure = false,
        sameSite = "Lax"
    } = {}) {

        if (!this.cookieenabled) return false;

        const key = this.key(name);

        const expires = new Date(
            Date.now() + days * 86400000
        ).toUTCString();

        const data = encodeURIComponent(
            JSON.stringify(value)
        );

        let cookie = `${key}=${data}; expires=${expires}; path=${path}; SameSite=${sameSite}`;

        if (secure) cookie += "; Secure";

        document.cookie = cookie;

        this.cookies[key] = data;

        return true;

    }

    getcookie(name) {

        if (!this.cookieenabled) return null;

        const key = this.cookiekey(name);

        const value = this.parse()[key];

        if (!value) return null;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }

    }

    cookiehas(name) {

        const key = this.cookiekey(name);

        return key in this.parsecookie();

    }

    removecookie(name, path = "/") {

        const key = this.cookiekey(name);

        document.cookie =
            `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;

        delete this.cookies[key];

    }

    cookiekeys() {

        const parsed = this.parsecookie();

        return Object.keys(parsed)
            .filter(k => k.startsWith(this.namespace + ":"))
            .map(k => k.replace(this.namespace + ":", ""));

    }

    clearcookie() {

        this.cookiekeys().forEach(k => {
            this.remove(k);
        });

    }
}