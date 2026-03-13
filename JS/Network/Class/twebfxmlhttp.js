export class TfXHR {
    constructor() {
        this.listeners = {};
    }

    request(method, url, data = null, headers = {}) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    this.emit("success", xhr.responseText);
                } else {
                    this.emit("error", xhr.statusText);
                }
            }
        };

        xhr.send(data);
        return xhr;
    }

    emit(event, data) {
        const listeners = this.listeners[event] || [];
        listeners.forEach(fn => fn(data));
    }

    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }
}