//35 tfotfal
/*
1.) session id
2.) login token 
3.) csrf tfoken
4.) user id
5.)
6.)
7.)
8.)
9.)
10.)
11.)
12.)
13.)
14.)
15.)
16.)
17.)
18.)
19.)
20.)
21.)
22.)
23.)
24.)
25.)
26.)
27.)
28.)
29.)
30.)
*/
export class NamiCookies {

    constructor({
        namespace = "tf"
    } = {}) {

        this.namespace = namespace;
        this.enabled = navigator.cookieEnabled;

        this.cookies = this.enabled ? this.parse() : {};

    }

    key(name) {
        return `${this.namespace}:${name}`;
    }

    parse() {

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

    set(name, value, {
        days = 7,
        path = "/",
        secure = false,
        sameSite = "Lax"
    } = {}) {

        if (!this.enabled) return false;

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

    get(name) {

        if (!this.enabled) return null;

        const key = this.key(name);

        const value = this.parse()[key];

        if (!value) return null;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }

    }

    has(name) {

        const key = this.key(name);

        return key in this.parse();

    }

    remove(name, path = "/") {

        const key = this.key(name);

        document.cookie =
            `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;

        delete this.cookies[key];

    }

    keys() {

        const parsed = this.parse();

        return Object.keys(parsed)
            .filter(k => k.startsWith(this.namespace + ":"))
            .map(k => k.replace(this.namespace + ":", ""));

    }

    clear() {

        this.keys().forEach(k => {
            this.remove(k);
        });

    }

    toJson() {

        const parsed = this.parse();

        const obj = {};

        Object.keys(parsed).forEach(key => {

            if (key.startsWith(this.namespace + ":")) {

                const clean = key.replace(this.namespace + ":", "");

                try {
                    obj[clean] = JSON.parse(parsed[key]);
                } catch {
                    obj[clean] = parsed[key];
                }

            }

        });

        return obj;

    }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
After we figure out how to do it with the guest then we should create a (the list below) cookie for the users at the community level or subscriber level
    - andriod phone cookie
    - google phone cookie
    - iphone(apple) phone cookie
    - andriod laptop cookie
    - google chrome laptop cookie
    - macbook (mac laptop) cookie
    - linux (laptop) cookie (maybe)
    - desktop (andriod) cookie
    - desktop (apple/mac) cookie
    - desktop (linux) cookie

*/