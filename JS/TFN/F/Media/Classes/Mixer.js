export class TfAudioMixer {
    constructor(audioContext) {
        if (!audioContext) throw new Error("AudioContext is required");
        this.ctx = audioContext;
        this.destination = this.ctx.createMediaStreamDestination();
        this.gains = {};       // Gain nodes per source
        this.sources = {};     // Media sources by id
        this.listeners = {};   // Event system
        this.idCounter = 0;
    }

    /* ----------------------------
       Add Microphone
    -----------------------------*/
    async addMic(id = null) {
        const sourceId = id || `mic-${++this.idCounter}`;
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = this.ctx.createMediaStreamSource(micStream);
        const gain = this.ctx.createGain();
        source.connect(gain).connect(this.destination);

        this.sources[sourceId] = source;
        this.gains[sourceId] = gain;

        this.emit("sourceAdded", { id: sourceId, type: "mic", source, gain });
        return { stream: micStream, id: sourceId };
    }

    /* ----------------------------
       Add MediaElement (music / fx)
    -----------------------------*/
    addMediaElement(element, id = null, monitor = false) {
        if (!element) throw new Error("MediaElement is required");
        const sourceId = id || `element-${++this.idCounter}`;
        const source = this.ctx.createMediaElementSource(element);
        const gain = this.ctx.createGain();

        source.connect(gain).connect(this.destination);
        if (monitor) source.connect(this.ctx.destination); // local playback

        this.sources[sourceId] = source;
        this.gains[sourceId] = gain;

        this.emit("sourceAdded", { id: sourceId, type: "media", source, gain });
        return sourceId;
    }

    /* ----------------------------
       Set gain / volume per source
    -----------------------------*/
    setVolume(id, value = 1) {
        if (this.gains[id]) this.gains[id].gain.value = value;
    }

    /* ----------------------------
       Remove a source
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
       Get mixed MediaStream
    -----------------------------*/
    getStream() {
        return this.destination.stream;
    }

    /* ----------------------------
       Reset all sources
    -----------------------------*/
    reset() {
        Object.values(this.sources).forEach(src => src.disconnect());
        this.sources = {};
        this.gains = {};
        this.emit("reset");
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
            sources: Object.keys(this.sources),
            destinationConnected: !!this.destination
        };
    }
}