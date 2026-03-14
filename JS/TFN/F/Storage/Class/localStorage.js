/*
Last Forever
1.) user Preference
2.) UI settings
3.) theme
4.) hardware preference
5.) featfure tflags
6.) bluetooth device
7.) usb midi device
8.) webcam enabled
9.) geolocation permission perference
10.) audio buffer settings

*/
export class TfLocalStorage {

    constructor({
        namespace = "tf"
    } = {}) {

        this.storage = window.localStorage;
        this.namespace = namespace;
    }

    key(name) {
        return `${this.namespace}:${name}`;
    }

    set(name, value) {
        try {

            const data = JSON.stringify(value);

            this.storage.setItem(
                this.key(name),
                data
            );

            return true;

        } catch (err) {

            console.error("TfLocalStorage set failed:", err);
            return false;

        }
    }

    get(name) {

        const value = this.storage.getItem(
            this.key(name)
        );

        if (value === null) return null;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }

    }

    remove(name) {

        this.storage.removeItem(
            this.key(name)
        );

    }

    has(name) {

        return this.storage.getItem(
            this.key(name)
        ) !== null;

    }

    keys() {

        const list = [];

        for (let i = 0; i < this.storage.length; i++) {

            const k = this.storage.key(i);

            if (k.startsWith(this.namespace + ":")) {
                list.push(k.replace(this.namespace + ":", ""));
            }

        }

        return list;
    }

    clear() {

        const keys = this.keys();

        keys.forEach(k => {
            this.remove(k);
        });

    }

    size() {

        let bytes = 0;

        for (let i = 0; i < this.storage.length; i++) {

            const key = this.storage.key(i);

            if (key.startsWith(this.namespace + ":")) {

                const value = this.storage.getItem(key);

                bytes += key.length + value.length;

            }

        }

        return bytes;
    }

    toJson() {

        const data = {};

        this.keys().forEach(k => {
            data[k] = this.get(k);
        });

        return data;

    }

}