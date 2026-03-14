export class TfGamepad {

    constructor({
        deadzone = 0.1,
        autoStart = true
    } = {}) {

        this.supported = "getGamepads" in navigator;

        this.deadzone = deadzone;

        this.gamepads = {};
        this.running = false;

        this.listeners = {};

        this._loop = this._loop.bind(this);

        if (!this.supported) {
            console.warn("Gamepad API not supported");
            return;
        }

        window.addEventListener("gamepadconnected", e => {
            this._connect(e.gamepad);
        });

        window.addEventListener("gamepaddisconnected", e => {
            this._disconnect(e.gamepad);
        });

        if (autoStart) this.start();
    }

    /* ----------------------------
       Start Polling
    ---------------------------- */

    start() {

        if (this.running) return;

        this.running = true;

        this.emit("start");

        requestAnimationFrame(this._loop);
    }

    stop() {

        this.running = false;

        this.emit("stop");
    }

    /* ----------------------------
       Main Poll Loop
    ---------------------------- */

    _loop() {

        if (!this.running) return;

        const pads = navigator.getGamepads();

        for (let i = 0; i < pads.length; i++) {

            const pad = pads[i];

            if (!pad) continue;

            if (!this.gamepads[pad.index]) {
                this._connect(pad);
            }

            this._update(pad);
        }

        requestAnimationFrame(this._loop);
    }

    /* ----------------------------
       Connect
    ---------------------------- */

    _connect(pad) {

        this.gamepads[pad.index] = {
            id: pad.id,
            buttons: pad.buttons.map(b => b.value),
            axes: [...pad.axes]
        };

        this.emit("connected", pad);
    }

    /* ----------------------------
       Disconnect
    ---------------------------- */

    _disconnect(pad) {

        delete this.gamepads[pad.index];

        this.emit("disconnected", pad);
    }

    /* ----------------------------
       Update State
    ---------------------------- */

    _update(pad) {

        const prev = this.gamepads[pad.index];

        if (!prev) return;

        /* Buttons */

        pad.buttons.forEach((btn, i) => {

            const value = btn.value;

            if (value !== prev.buttons[i]) {

                if (value > 0) {
                    this.emit("buttondown", {
                        index: pad.index,
                        button: i,
                        value
                    });
                } else {
                    this.emit("buttonup", {
                        index: pad.index,
                        button: i
                    });
                }

                prev.buttons[i] = value;
            }
        });

        /* Axes */

        pad.axes.forEach((axis, i) => {

            const filtered =
                Math.abs(axis) < this.deadzone ? 0 : axis;

            if (filtered !== prev.axes[i]) {

                this.emit("axis", {
                    index: pad.index,
                    axis: i,
                    value: filtered
                });

                prev.axes[i] = filtered;
            }
        });
    }

    /* ----------------------------
       Helpers
    ---------------------------- */

    getGamepads() {
        return navigator.getGamepads();
    }

    get(index = 0) {
        return navigator.getGamepads()[index] || null;
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
            connected: Object.keys(this.gamepads).length
        };
    }

}