export class TfTouch {

    constructor({
        element = window,
        passive = false,
        autoStart = true
    } = {}) {

        this.element = element;
        this.passive = passive;

        this.supported = "ontouchstart" in window;

        this.touches = new Map();

        this.listeners = {};

        this.running = false;

        this._start = this._start.bind(this);
        this._move = this._move.bind(this);
        this._end = this._end.bind(this);
        this._cancel = this._cancel.bind(this);

        if (!this.supported) {
            console.warn("Touch Events API not supported");
        }

        if (autoStart) this.start();
    }

    /* ----------------------------
       Start Listening
    ---------------------------- */

    start() {

        if (!this.supported || this.running) return;

        this.running = true;

        const opts = { passive: this.passive };

        this.element.addEventListener("touchstart", this._start, opts);
        this.element.addEventListener("touchmove", this._move, opts);
        this.element.addEventListener("touchend", this._end, opts);
        this.element.addEventListener("touchcancel", this._cancel, opts);

        this.emit("start");
    }

    /* ----------------------------
       Stop Listening
    ---------------------------- */

    stop() {

        if (!this.running) return;

        this.running = false;

        this.element.removeEventListener("touchstart", this._start);
        this.element.removeEventListener("touchmove", this._move);
        this.element.removeEventListener("touchend", this._end);
        this.element.removeEventListener("touchcancel", this._cancel);

        this.touches.clear();

        this.emit("stop");
    }

    /* ----------------------------
       Touch Start
    ---------------------------- */

    _start(e) {

        [...e.changedTouches].forEach(t => {

            const data = this._format(t);

            this.touches.set(t.identifier, data);

            this.emit("touchstart", data);

        });
    }

    /* ----------------------------
       Touch Move
    ---------------------------- */

    _move(e) {

        [...e.changedTouches].forEach(t => {

            if (!this.touches.has(t.identifier)) return;

            const data = this._format(t);

            this.touches.set(t.identifier, data);

            this.emit("touchmove", data);

        });
    }

    /* ----------------------------
       Touch End
    ---------------------------- */

    _end(e) {

        [...e.changedTouches].forEach(t => {

            const data = this._format(t);

            this.touches.delete(t.identifier);

            this.emit("touchend", data);

        });
    }

    /* ----------------------------
       Touch Cancel
    ---------------------------- */

    _cancel(e) {

        [...e.changedTouches].forEach(t => {

            const data = this._format(t);

            this.touches.delete(t.identifier);

            this.emit("touchcancel", data);

        });
    }

    /* ----------------------------
       Format Touch Data
    ---------------------------- */

    _format(t) {

        return {

            id: t.identifier,

            x: t.clientX,
            y: t.clientY,

            pageX: t.pageX,
            pageY: t.pageY,

            radiusX: t.radiusX,
            radiusY: t.radiusY,

            rotationAngle: t.rotationAngle,
            force: t.force,

            time: performance.now()
        };
    }

    /* ----------------------------
       Helpers
    ---------------------------- */

    getTouch(id) {
        return this.touches.get(id) || null;
    }

    getTouches() {
        return [...this.touches.values()];
    }

    clear() {
        this.touches.clear();
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
            activeTouches: this.touches.size

        };
    }

}