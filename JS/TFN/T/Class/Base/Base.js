export class Tsu {
    lang = "en-US";
    listeners = {};
domListeners = new Map();
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
    let logBox = this.find("TfLogBox");
    if (!logBox) return;

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
    on(id, eventName, preventDefault = false, iframe = null) {
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
            this.emit(eventName, {
                event,
                element: el
            });
        };

        // Desktop click / form submit
 if (window.PointerEvent) {
    el.addEventListener(isForm ? "submit" : "pointerdown", runHandler);
} else {
    el.addEventListener(isForm ? "submit" : "click", runHandler);
}
this.domListeners.set(id, { el, runHandler });
}
off(id) {
    const entry = this.domListeners.get(id);
    if (!entry) return;

    const { el, runHandler } = entry;

    el.removeEventListener("pointerdown", runHandler);
    el.removeEventListener("click", runHandler);
    el.removeEventListener("submit", runHandler);

    this.domListeners.delete(id);
}
}