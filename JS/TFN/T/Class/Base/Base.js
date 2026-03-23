export class Tsu {
    lang = "en-US";
    listeners = {};
    constructor(options = {}) {
        if (options.lang) {
            this.lang = options.lang;

        }
    }
    find(elem, frame = null) {
        if (frame !== null) {
            return frame.contentDocument.getElementById(elem);
        } else {
            return document.getElementById(elem);
        }
    }
    log(msg) {
        let logBox = this.find("TfLogBox", false);
        logBox.innerText += msg + "\n";
        logBox.scrollTop = logBox.scrollHeight;
    }
    addEventListener(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }
removeEventListener(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(fn => fn !== callback);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(fn => fn(data));
    }
    on(id, handler, preventDefault = false, iframe = null) {
        let el = this.find(id, iframe);

        if (!el) return;

        const isForm = el instanceof HTMLFormElement;
        const isSubmitButton =
            (el instanceof HTMLButtonElement && el.type === "submit") ||
            (el instanceof HTMLInputElement &&
                ["submit", "image"].includes(el.type));

        const runHandler = (event) => {
            if (isForm || isSubmitButton || preventDefault) {
                event.preventDefault();
                event.stopPropagation();
            }
            handler(event);
        };

        // Desktop click / form submit
        const eventType = isForm ? "submit" : "click";
        el.addEventListener(eventType, runHandler);

        // Mobile touch: prevent scrolling / double-tap zoom
        el.addEventListener(
            "touchend",
            (e) => {
                runHandler(e);
                if (!isForm && !isSubmitButton && preventDefault) e.preventDefault();
            },
            { passive: false }
        );

        // Pointer events for stylus / hybrid devices
        el.addEventListener("pointerdown", (e) => {
            runHandler(e);
            if (!isForm && !isSubmitButton && preventDefault) e.preventDefault();
        });
    }
}