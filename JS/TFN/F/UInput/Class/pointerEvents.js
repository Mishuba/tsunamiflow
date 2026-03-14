export class TfPointerEvents {

    constructor({
        element = window,
        capture = false,
        autoBind = true
    } = {}) {

        this.element = element;
        this.capture = capture;

        this.supported = "PointerEvent" in window;

        this.pointers = new Map();

        this.listeners = {};

        this.running = false;

        this._down = this._down.bind(this);
        this._move = this._move.bind(this);
        this._up = this._up.bind(this);
        this._cancel = this._cancel.bind(this);

        if (!this.supported) {
            console.warn("Pointer Events API not supported");
        }

        if (autoBind) this.start();
    }

    /* ----------------------------
       Start Listening
    ---------------------------- */

    start() {

        if (!this.supported || this.running) return;

        this.running = true;

        this.element.addEventListener("pointerdown", this._down);
        this.element.addEventListener("pointermove", this._move);
        this.element.addEventListener("pointerup", this._up);
        this.element.addEventListener("pointercancel", this._cancel);

        this.emit("start");
    }

    /* ----------------------------
       Stop Listening
    ---------------------------- */

    stop() {

        if (!this.running) return;

        this.running = false;

        this.element.removeEventListener("pointerdown", this._down);
        this.element.removeEventListener("pointermove", this._move);
        this.element.removeEventListener("pointerup", this._up);
        this.element.removeEventListener("pointercancel", this._cancel);

        this.pointers.clear();

        this.emit("stop");
    }

    /* ----------------------------
       Pointer Down
    ---------------------------- */

    _down(e) {

        const data = this._format(e);

        this.pointers.set(e.pointerId, data);

        if (this.capture && this.element.setPointerCapture) {
            try { this.element.setPointerCapture(e.pointerId); } catch {}
        }

        this.emit("pointerdown", data);
    }

    /* ----------------------------
       Pointer Move
    ---------------------------- */

    _move(e) {

        if (!this.pointers.has(e.pointerId)) return;

        const data = this._format(e);

        this.pointers.set(e.pointerId, data);

        this.emit("pointermove", data);
    }

    /* ----------------------------
       Pointer Up
    ---------------------------- */

    _up(e) {

        const data = this._format(e);

        this.pointers.delete(e.pointerId);

        this.emit("pointerup", data);
    }

    /* ----------------------------
       Pointer Cancel
    ---------------------------- */

    _cancel(e) {

        const data = this._format(e);

        this.pointers.delete(e.pointerId);

        this.emit("pointercancel", data);
    }

    /* ----------------------------
       Format Pointer Data
    ---------------------------- */

    _format(e) {

        return {

            id: e.pointerId,
            type: e.pointerType,

            x: e.clientX,
            y: e.clientY,

            pressure: e.pressure,
            tiltX: e.tiltX,
            tiltY: e.tiltY,

            width: e.width,
            height: e.height,

            button: e.button,
            buttons: e.buttons,

            time: performance.now()
        };
    }

    /* ----------------------------
       Helpers
    ---------------------------- */

    getPointer(id) {
        return this.pointers.get(id) || null;
    }

    getPointers() {
        return [...this.pointers.values()];
    }

    clear() {
        this.pointers.clear();
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
       Debug
    ---------------------------- */

    toJson() {

        return {

            supported: this.supported,
            running: this.running,
            activePointers: this.pointers.size

        };
    }

}