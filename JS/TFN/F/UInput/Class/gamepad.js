export class TfGamepad {

    constructor({
        deadzone = 0.1,
        autoStart = true
    } = {}) {

        this.supported = "getGamepads" in navigator;

        this.deadzone = deadzone;

        this.gamepads = {};
        this.controllerMappings = {
            playstation: {
                up: "D-Pad Up", down: "D-Pad Down", left: "D-Pad Left", right: "D-Pad Right",
                select: "touchpad", start: "Options Button", share: "Share Button",
                action1: "Cross", action2: "Circle", action3: "Square", action4: "Triangle",
                action5: "L1", action6: "R1", action7: "L2", action8: "R2",
                action9: "Left Analog Stick Button", action10: "Right Analog Stick Button",
                leftStick: "Left Analog Stick", rightStick: "Right Analog Stick",
            },
            xbox: {
                up: "D-Pad Up", down: "D-Pad Down", left: "D-Pad Left", right: "D-Pad Right",
                select: "Menu Button", start: "View Button",
                action1: "A", action2: "B", action3: "X", action4: "Y",
                leftStick: "Left Analog Stick", rightStick: "Right Analog Stick",
            },
            switch: {
                up: "D-Pad Up", down: "D-Pad Down", left: "D-Pad Left", right: "D-Pad Right",
                select: "- Button", start: "+ Button",
                action1: "B", action2: "A", action3: "Y", action4: "X",
                leftStick: "Left Analog Stick", rightStick: "Right Analog Stick",
            }
        };

        this.running = false;
        this.listeners = {};

        this._loop = this._loop.bind(this);

        if (!this.supported) {
            console.warn("Gamepad API not supported");
            return;
        }

        window.addEventListener("gamepadconnected", e => {
            try {
                this._connect(e.gamepad);
            } catch (err) {
                console.error("Gamepad connect error:", err);
            }
        });

        window.addEventListener("gamepaddisconnected", e => {
            try {
                this._disconnect(e.gamepad);
            } catch (err) {
                console.error("Gamepad disconnect error:", err);
            }
        });

        if (autoStart) this.start();
    }

    /* ----------------------------
       Controller Detection
    ---------------------------- */

    getControllerType(gamepad) {

        try {
            const id = (gamepad.id || "").toLowerCase();

            if (id.includes("playstation") || id.includes("dualshock") || id.includes("dualsense")) {
                return "playstation";
            }

            if (id.includes("xbox")) {
                return "xbox";
            }

            if (id.includes("switch") || id.includes("pro controller")) {
                return "switch";
            }

        } catch (err) {
            console.warn("Controller detection failed:", err);
        }

        return "xbox"; // safe fallback
    }

    /* ----------------------------
       Start / Stop
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
       Main Loop
    ---------------------------- */

    _loop() {

        if (!this.running) return;

        let pads;

        try {
            pads = navigator.getGamepads();
        } catch (err) {
            console.error("Failed to read gamepads:", err);
            return;
        }

        if (pads) {

            for (let i = 0; i < pads.length; i++) {

                const pad = pads[i];

                if (!pad) continue;

                if (!this.gamepads[pad.index]) {
                    this._connect(pad);
                }

                this._update(pad);
            }
        }

        requestAnimationFrame(this._loop);
    }

    /* ----------------------------
       Connect / Disconnect
    ---------------------------- */

    _connect(pad) {

        const type = this.getControllerType(pad);

        this.gamepads[pad.index] = {
            id: pad.id,
            type,
            buttons: pad.buttons.map(b => ({
                value: b.value,
                pressed: b.pressed,
                touched: b.touched
            })),
            axes: [...pad.axes],

            prevButtons: pad.buttons.map(() => false),
            prevAxes: [...pad.axes],

            mapping: this.controllerMappings[type] || null
        };

        this.emit("connected", pad);
    }

    _disconnect(pad) {

        delete this.gamepads[pad.index];

        this.emit("disconnected", pad);
    }

    /* ----------------------------
       Update State
    ---------------------------- */

    _update(pad) {

        const state = this.gamepads[pad.index];
        if (!state) return;

        let prevButtons = state.prevButtons;
        let prevAxes = state.prevAxes;

        const mapping = state.mapping;

        /* ---------------- Buttons ---------------- */

        pad.buttons.forEach((btn, i) => {

            const value = btn.value;
            const isPressed = value > 0;

            if (isPressed !== prevButtons[i]) {

                const mapped = this._mapButton(i, mapping);

                if (isPressed) {

                    this.emit("buttondown", {
                        index: pad.index,
                        button: mapped,
                        raw: i,
                        value
                    });

                } else {

                    this.emit("buttonup", {
                        index: pad.index,
                        button: mapped,
                        raw: i
                    });
                }

                prevButtons[i] = isPressed;
            }
        });

        /* ---------------- Axes ---------------- */

        pad.axes.forEach((axis, i) => {

            let filtered = Math.abs(axis) < this.deadzone ? 0 : axis;

            if (filtered !== prevAxes[i]) {

                this.emit("axis", {
                    index: pad.index,
                    axis: i,
                    value: filtered
                });

                prevAxes[i] = filtered;
            }
        });

        /* ---------------- Held State ---------------- */

        this.emit("hold", {
            index: pad.index,
            buttons: pad.buttons.map(b => b.pressed),
            axes: pad.axes
        });
    }

    /* ----------------------------
       Mapping Helper
    ---------------------------- */

    _mapButton(index, mapping) {

        if (!mapping) return index;

        const commonMap = {
            0: "action1",
            1: "action2",
            2: "action3",
            3: "action4",
            4: "action5",
            5: "action6",
            8: "select",
            9: "start"
        };

        const key = commonMap[index];

        return key ? (mapping[key] || key) : index;
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

        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(fn);
    }

    emit(event, data) {

        const list = this.listeners[event];
        if (!list) return;

        for (let i = 0; i < list.length; i++) {
            try {
                list[i](data);
            } catch (err) {
                console.error(`Listener error (${event}):`, err);
            }
        }
    }

    /* ----------------------------
       Debug / State
    ---------------------------- */

    toJson() {

        return {
            supported: this.supported,
            running: this.running,
            connected: Object.keys(this.gamepads).length
        };
    }
}