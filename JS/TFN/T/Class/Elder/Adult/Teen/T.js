import { TsDom } from "./Child/N.js";
export class TsDomCanvas extends TsDom { //dom n window
    lang = "en-US";
    worker = null;
    canvas = null;
    contextTypecanvas = "2d";
    contextTypecanvasoption = { colorSpace: "srgb", willReadFrequently: true };
    canvasctx = null;
    /*
canvasctx.canvas;
canvasctx.save();
canvasctx.restore();
canvasctx.reset();
canvasctx.scale(x,y);
canvasctx.rotate(angle);
canvasctx.translate(x,y);
canvasctx.transform(a,b,c,d,e,f);
canvasctx.setTransform(a,b,c,d,e,f);
canvasctx.resetTransform();
canvasctx.globalAlpha;
canvasctx.globalCompositeOperation;
canvasctx.imageSmoothingEnabled;
*/
    iscanvasReady = false;
    constructor(options = {}) {
        super(options);
        if (options.lang) this.lang = options.lang;
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
    startWebworkers() {
        if (this.worker) return;

        this.worker = new Worker("./WebWorker.js");

        this.receiveWebworkerMessage(); // 🔥 central handler

        console.log("Web Worker started");
    }
    receiveWebworkerMessage() {
        if (!this.worker) return;

        this.worker.onmessage = (event) => {
            const msg = event.data;

            if (!msg || typeof msg !== "object") {
                this.emit("worker_raw", msg);
                return;
            }

            // 🔥 Handle errors first
            if (event.data.error) {
                this.emit("worker_error", event.data.error);
                return;
            }

            // 🔥 Route by type
            switch (event.data.type) {
                case "log":
                    console.log("Worker:", event.data.message);
                    break;

                case "result":
                    this.emit("worker_result", { id: event.data.id, payload: event.data.payload });
                    break;

                case "ws_message":
                    // Forward from SharedWorker (if worker passes it)
                    this.emit("ws_message", event.data);
                    break;

                default:
                    this.emit(event.data.type, event.data);
            }
        };

        this.worker.onerror = (err) => {
            this.emit("worker_error", err);
        };
    }
    terminateWebworker() {
        if (!this.worker) return;
        this.worker.terminate();
        this.worker = null;
        console.log("Web Worker terminated");
    }
    on(id, eventName, preventDefault = false, iframe = null) {
        let el = this.find(id, iframe);
        if (!el) return;

        const isForm = el instanceof HTMLFormElement;
        const isSubmitButton =
            (el instanceof HTMLButtonElement && el.type === "submit") ||
            (el instanceof HTMLInputElement &&
                ["submit", "image"].includes(el.type));

        const supportsPointer = "PointerEvent" in window;
        const supportsTouch = "ontouchstart" in window;

        const runHandler = (event) => {
            if (isForm || isSubmitButton || preventDefault) {
                event.preventDefault();
                event.stopPropagation();
            }

            this.emit(eventName, {
                event,
                element: el,
                type: event.type
            });
        };

        // ===== POINTER (Primary) =====          
        if (supportsPointer) {
            const eventType = isForm ? "submit" : "pointerup";

            el.addEventListener(eventType, runHandler);

            this._storeDomListener(id, el, runHandler, eventType);
            return;
        }

        // ===== TOUCH (Fallback) =====          
        if (supportsTouch) {
            const start = (e) => {
                this._touchStart = e;
            };

            const end = (e) => {
                runHandler(e);
            };

            el.addEventListener("touchstart", start, { passive: false });
            el.addEventListener("touchend", end, { passive: false });

            this._storeDomListener(id, el, start, "touchstart");
            this._storeDomListener(id, el, end, "touchend");
            return;
        }

        // ===== CLICK (Fallback) =====          
        const clickType = isForm ? "submit" : "click";

        el.addEventListener(clickType, runHandler);

        this._storeDomListener(id, el, runHandler, clickType);
    }
    off(id) {
        const entries = this.domListeners.get(id);
        if (!entries) return;

        entries.forEach(({ el, handler, eventType }) => {
            el.removeEventListener(eventType, handler);
        });

        this.domListeners.delete(id);
    }
    initCanvas() {
        if (this.canvas !== null) {
            try {
                this.canvasctx = this.canvas.getContext(this.contextTypecanvas, this.contextTypecanvasoption);
                if (!this.canvasctx) throw new Error(`${this.contextTypecanvas} context not supported`);
                this.iscanvasReady = true;
                console.log(`Canvas initialized with ${this.contextTypecanvas} context`);
            } catch (err) {
                console.error("Canvas init failed:", err);
                this.canvasctx = null;
            }
        } else {
            console.warn("No canvas element found for initialization");
        }
    }

    resizeCanvas(width, height) {
        if (!this.iscanvasReady) return;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    clearCanvas(color = "#000000") {
        if (!this.iscanvasReady) return;
        if (this.contextTypecanvas === "2d") {
            this.canvasctx.fillStyle = color;
            this.canvasctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            console.warn("Clear method not implemented for non-2d context");
        }
    }

    getCanvasContext() {
        return this.canvasctx;
    }
    onClipboard(id, eventName, type = "copy", preventDefault = false, iframe = null) {
        let el = this.find(id, iframe);
        if (!el) return;

        const validEvents = ["copy", "cut", "paste"];
        if (!validEvents.includes(type)) {
            console.warn(`Invalid clipboard event: ${type}`);
            return;
        }

        const handler = (event) => {
            if (preventDefault) {
                event.preventDefault();
            }

            this.emit(eventName, {
                event,
                element: el,
                type,
                clipboardData: event.clipboardData
            });
        };

        el.addEventListener(type, handler);

        this._storeDomListener(id, el, handler, type);
    }
}          