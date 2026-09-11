export class TfAudioWorkletNode {
    constructor({ context = null, processorUrl = null, options = {} } = {}) {
        this.context = context || new (window.AudioContext || window.webkitAudioContext)();
        this.processorUrl = processorUrl; // URL of the worklet processor JS file
        this.options = options;           // Options for AudioWorkletNode
        this.node = null;
        this.listeners = {};
        this.ready = false;
    }

    /* ----------------------------
       Load and create AudioWorkletNode
    -----------------------------*/
    async init() {
        if (!this.context.audioWorklet) {
            const err = new Error("AudioWorklet not supported in this browser.");
            console.error(err);
            this.emit("error", err);
            throw err;
        }

        if (!this.processorUrl) {
            const err = new Error("Processor URL not provided.");
            console.error(err);
            this.emit("error", err);
            throw err;
        }

        try {
            await this.context.audioWorklet.addModule(this.processorUrl);
            this.node = new AudioWorkletNode(this.context, this.options.name || "processor", this.options);
            this.node.port.onmessage = (e) => this.emit("message", e.data);
            this.ready = true;
            this.emit("ready", this.node);
            return this.node;
        } catch (err) {
            console.error("Failed to load AudioWorkletNode:", err);
            this.emit("error", err);
            throw err;
        }
    }

    /* ----------------------------
       Connect / Disconnect
    -----------------------------*/
    connect(destination) {
        if (!this.node) return;
        this.node.connect(destination);
    }

    disconnect() {
        if (!this.node) return;
        this.node.disconnect();
    }

    /* ----------------------------
       Send message to processor
    -----------------------------*/
    postMessage(message) {
        if (!this.node) return;
        this.node.port.postMessage(message);
    }

    /* ----------------------------
       Event system
    -----------------------------*/
    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(fn => fn(data));
    }

    /* ----------------------------
       Quick status
    -----------------------------*/
    toJson() {
        return {
            ready: this.ready,
            hasNode: !!this.node,
            contextState: this.context.state
        };
    }
}