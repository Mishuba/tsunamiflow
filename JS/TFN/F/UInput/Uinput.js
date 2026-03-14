// Import all the individual classes
import { TfClipboard } from "./TfClipboard.js";
import { TfFullscreen } from "./TfFullscreen.js";
import { TfGamepad } from "./TfGamepad.js";
import { TfPictureInPicture } from "./TfPictureInPicture.js";
import { TfPointerEvents } from "./TfPointerEvents.js";
import { TfTouch } from "./TfTouch.js";

export class TfUinput {

    constructor({
        clipboardOptions = {},
        fullscreenOptions = {},
        gamepadOptions = {},
        pipOptions = {},
        pointerOptions = {},
        touchOptions = {}
    } = {}) {

        // Create instances of each API
        this.clipboard = new TfClipboard(clipboardOptions);
        this.fullscreen = new TfFullscreen(fullscreenOptions);
        this.gamepad = new TfGamepad(gamepadOptions);
        this.pip = new TfPictureInPicture(pipOptions);
        this.pointer = new TfPointerEvents(pointerOptions);
        this.touch = new TfTouch(touchOptions);

        this.listeners = {};

        // Forward events from each API
        this._bindEvents();
    }

    /* ----------------------------
       Bind Events from Submodules
    ---------------------------- */
    _bindEvents() {

        // Clipboard
        ["writeText","readText","writeItems","readItems","writeImage","readImage","copyFallback","error"].forEach(ev => {
            this.clipboard.on(ev, data => this.emit(`clipboard:${ev}`, data));
        });

        // Fullscreen
        ["enter","exit","change","error"].forEach(ev => {
            this.fullscreen.on(ev, data => this.emit(`fullscreen:${ev}`, data));
        });

        // Gamepad
        ["start","stop","connected","disconnected","buttondown","buttonup","axis"].forEach(ev => {
            this.gamepad.on(ev, data => this.emit(`gamepad:${ev}`, data));
        });

        // Picture-in-Picture
        ["enter","exit","resize","error"].forEach(ev => {
            this.pip.on(ev, data => this.emit(`pip:${ev}`, data));
        });

        // Pointer Events
        ["start","stop","pointerdown","pointermove","pointerup","pointercancel"].forEach(ev => {
            this.pointer.on(ev, data => this.emit(`pointer:${ev}`, data));
        });

        // Touch
        ["start","stop","touchstart","touchmove","touchend","touchcancel"].forEach(ev => {
            this.touch.on(ev, data => this.emit(`touch:${ev}`, data));
        });
    }

    /* ----------------------------
       Unified Event System
    ---------------------------- */
    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(fn => fn(data));
    }

    /* ----------------------------
       Debug / Status Snapshot
    ---------------------------- */
    toJson() {
        return {
            clipboard: this.clipboard.toJson(),
            fullscreen: this.fullscreen.toJson(),
            gamepad: this.gamepad.toJson(),
            pip: this.pip.toJson(),
            pointer: this.pointer.toJson(),
            touch: this.touch.toJson()
        };
    }

}