export class TfFullscreen {

    constructor({
        element = document.documentElement,
        autoBindEvents = true
    } = {}) {

        this.element = element;
        this.activeElement = null;
        this.supported = !!(
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.msFullscreenEnabled
        );

        this.listeners = {};

        if (!this.supported) {
            console.warn("Fullscreen API not supported");
        }

        if (autoBindEvents) {
            this._bindEvents();
        }
    }

    /* ----------------------------
       Internal Event Binding
    ---------------------------- */

    _bindEvents() {

        const handler = () => {

            const el =
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.msFullscreenElement ||
                null;

            this.activeElement = el;

            if (el) {
                this.emit("enter", el);
            } else {
                this.emit("exit");
            }

            this.emit("change", el);
        };

        document.addEventListener("fullscreenchange", handler);
        document.addEventListener("webkitfullscreenchange", handler);
        document.addEventListener("msfullscreenchange", handler);

        document.addEventListener("fullscreenerror", e => {
            this.emit("error", e);
        });
    }

    /* ----------------------------
       Enter Fullscreen
    ---------------------------- */

    async enter(element = this.element) {

        if (!this.supported) return;

        try {

            if (element.requestFullscreen)
                await element.requestFullscreen();

            else if (element.webkitRequestFullscreen)
                element.webkitRequestFullscreen();

            else if (element.msRequestFullscreen)
                element.msRequestFullscreen();

            this.activeElement = element;

        } catch (err) {

            console.error("Fullscreen enter failed:", err);
            this.emit("error", err);
        }
    }

    /* ----------------------------
       Exit Fullscreen
    ---------------------------- */

    async exit() {

        try {

            if (document.exitFullscreen)
                await document.exitFullscreen();

            else if (document.webkitExitFullscreen)
                document.webkitExitFullscreen();

            else if (document.msExitFullscreen)
                document.msExitFullscreen();

            this.activeElement = null;

        } catch (err) {

            console.error("Fullscreen exit failed:", err);
            this.emit("error", err);
        }
    }

    /* ----------------------------
       Toggle
    ---------------------------- */

    async toggle(element = this.element) {

        if (this.isFullscreen()) {
            await this.exit();
        } else {
            await this.enter(element);
        }
    }

    /* ----------------------------
       State Helpers
    ---------------------------- */

    isFullscreen() {

        return !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement
        );
    }

    getElement() {

        return (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement ||
            null
        );
    }

    /* ----------------------------
       Event System
    ---------------------------- */

    on(event, fn) {

        if (!this.listeners[event])
            this.listeners[event] = [];

        this.listeners[event].push(fn);
    }

    emit(event, data) {

        (this.listeners[event] || [])
            .forEach(fn => fn(data));
    }

    /* ----------------------------
       Debug Info
    ---------------------------- */

    toJson() {

        return {

            supported: this.supported,
            active: this.isFullscreen(),
            element: this.getElement()?.tagName || null

        };
    }

}