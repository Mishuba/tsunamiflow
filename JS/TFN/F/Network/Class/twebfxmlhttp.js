export class TfXHR {
    constructor() {
        this.listeners = {};
    }

    request(method, url, data = null, headers = {}, options = {}) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    xhr.responseType = "text";

    const {
        sendAs = "json"
    } = options;

    let payload = data;

    const hasContentType = Object.keys(headers)
        .some(h => h.toLowerCase() === "content-type");

    const hasAccept = Object.keys(headers)
        .some(h => h.toLowerCase() === "accept");

    // ===== DEFAULT ACCEPT HEADER =====
    if (!hasAccept) {
        xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
    }

    // ===== OUTGOING DATA =====
    if (data !== null && data !== undefined) {

        if (sendAs === "json") {
            payload = JSON.stringify(data);

            if (!hasContentType) {
                xhr.setRequestHeader("Content-Type", "application/json");
            }
        }

        else if (sendAs === "text") {
            payload = typeof data === "string" ? data : String(data);

            if (!hasContentType) {
                xhr.setRequestHeader("Content-Type", "text/plain");
            }
        }

        else if (sendAs === "form") {
            payload = data;
        }

        else if (sendAs === "binary") {
            payload = data;

            if (!hasContentType && data?.type) {
                xhr.setRequestHeader("Content-Type", data.type);
            }
        }
    }

    // ===== CUSTOM HEADERS (override everything) =====
    for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value);
    }

    // ===== RESPONSE =====
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            const contentType = xhr.getResponseHeader("Content-Type") || "";
            let response = xhr.responseText;

            if (
                contentType.includes("application/json") ||
                (response && (response.startsWith("{") || response.startsWith("[")))
            ) {
                try {
                    response = JSON.parse(response);
                } catch {}
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                this.emit("success", response, xhr);
            } else {
                this.emit("error", {
                    status: xhr.status,
                    message: xhr.statusText,
                    response
                });
            }
        }
    };

    xhr.onerror = () => {
        this.emit("error", {
            status: xhr.status,
            message: "Network Error"
        });
    };

    xhr.send(payload);
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