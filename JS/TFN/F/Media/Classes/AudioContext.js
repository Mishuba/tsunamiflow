export class TfAudioContext {
    constructor() {
        this.context = null;       // The AudioContext instance
        this.sources = {};         // Track sources by id
        this.gains = {};           // Gain nodes per source
        this.output = null;        // Destination node
        this.listeners = {};       // Event system
        this.idCounter = 0;
    }

    /* ----------------------------
       Create or get AudioContext
    -----------------------------*/
    create() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.output = this.context.destination;
            this.emit("ready", this.context);
        }
        return this.context;
    }

    /* ----------------------------
       Add MediaElementSource
    -----------------------------*/
    addElementSource(element, id = null) {
        if (!this.context) this.create();
        const sourceId = id || `source-${++this.idCounter}`;
        const source = this.context.createMediaElementSource(element);
        const gain = this.context.createGain();
        source.connect(gain).connect(this.output);

        this.sources[sourceId] = source;
        this.gains[sourceId] = gain;

        this.emit("sourceAdded", { id: sourceId, source, gain });
        return sourceId;
    }

    /* ----------------------------
       Add MediaStreamSource
    -----------------------------*/
    addStreamSource(stream, id = null) {
        if (!this.context) this.create();
        const sourceId = id || `source-${++this.idCounter}`;
        const source = this.context.createMediaStreamSource(stream);
        const gain = this.context.createGain();
        source.connect(gain).connect(this.output);

        this.sources[sourceId] = source;
        this.gains[sourceId] = gain;

        this.emit("sourceAdded", { id: sourceId, source, gain });
        return sourceId;
    }

    /* ----------------------------
       Control Gain
    -----------------------------*/
    setGain(id, value = 1) {
        if (this.gains[id]) this.gains[id].gain.value = value;
    }

    /* ----------------------------
       Remove Source
    -----------------------------*/
    removeSource(id) {
        if (this.sources[id]) {
            this.sources[id].disconnect();
            this.gains[id].disconnect();
            delete this.sources[id];
            delete this.gains[id];
            this.emit("sourceRemoved", id);
        }
    }

    /* ----------------------------
       Close Context
    -----------------------------*/
    finish() {
        if (this.context) {
            this.context.close();
            this.context = null;
            this.sources = {};
            this.gains = {};
            this.output = null;
            this.emit("closed");
        }
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
            contextState: this.context?.state || null,
            sources: Object.keys(this.sources),
            outputConnected: !!this.output
        };
    }
}