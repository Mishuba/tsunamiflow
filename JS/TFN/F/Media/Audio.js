import { DefaultPlaylist } from "./../../T/Arrays/Arrays.js";

export class TfMusic {
    constructor(audioContext = null) {
        // Core Audio
        this.audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        this.elements = {}; // HTMLMediaElements keyed by ID
        this.worklets = {};
        this.listeners = {};

        // Radio / Live
        this.currentSong = null;
        this.liveStream = false;
        this.streamDestination = this.audioContext.createMediaStreamDestination();

        // Analyzer / Visualization
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.5;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        // Timing
        this.timing = 0;
        this.processBar = 0;
    }

    /* ----------------------------
       Media Element / Playback
    ----------------------------*/
    addElement(element, id = null) {
        const elementId = id || `element-${Object.keys(this.elements).length + 1}`;
        this.elements[elementId] = element;
        element.crossOrigin = "anonymous";

        // Connect to analyser
        const srcNode = this.audioContext.createMediaElementSource(element);
        srcNode.connect(this.analyser);
        srcNode.connect(this.audioContext.destination);

        // Event: auto update progress
        element.addEventListener("timeupdate", () => this.updateProgress(elementId));
        element.addEventListener("ended", () => this.handleEnded(elementId));

        return elementId;
    }

    playElement(id) {
        const element = this.elements[id];
        if (!element) return;
        element.play().catch(err => console.error("Play error:", err));
    }

    pauseElement(id) {
        const element = this.elements[id];
        if (!element) return;
        element.pause();
    }

    restartElement(id, src = null) {
        const element = this.elements[id];
        if (!element) return;
        if (src) element.src = src;
        element.currentTime = 0;
        element.play();
    }

    nextSong(id, playlist = DefaultPlaylist) {
        const element = this.elements[id];
        if (!element) return;
        const randomIndex = Math.floor(Math.random() * playlist.length);
        this.currentSong = playlist[randomIndex];
        element.src = this.currentSong;
        element.play();
    }

    /* ----------------------------
       Live Audio / Radio
    ----------------------------*/
    startLive(src) {
        if (this.liveStream) return;
        this.liveStream = true;

        const liveElement = new Audio(src);
        liveElement.crossOrigin = "anonymous";
        liveElement.autoplay = true;
        this.addElement(liveElement, "live-stream");
    }

    stopLive() {
        if (!this.liveStream) return;
        this.liveStream = false;

        const liveElement = this.elements["live-stream"];
        if (liveElement) {
            liveElement.pause();
            liveElement.src = "";
            delete this.elements["live-stream"];
        }
    }

    /* ----------------------------
       Worker / Auto Radio Handling
    ----------------------------*/
    handleWorkerMessage(event, elementId = null) {
        // Determine the song to play
        let song;
        if (!event.data.file || ["undefined", "", "null"].includes(event.data.file)) {
            const randomIndex = Math.floor(Math.random() * DefaultPlaylist.length);
            song = DefaultPlaylist[randomIndex];
        } else {
            song = event.data.file;
        }
        this.currentSong = song;

        // Play on the specified element
        if (elementId && this.elements[elementId]) {
            this.elements[elementId].src = song;
            this.elements[elementId].play().catch(err => console.error("Play error:", err));
        }

        console.log(`RadioWorker message handled, playing: ${song}`);
        return song;
    }

    handleEnded(id) {
        // Auto-play next song when one ends
        if (!this.elements[id]) return;
        this.nextSong(id);
    }

    attachWorker(worker, elementId) {
        worker.onmessage = (event) => this.handleWorkerMessage(event, elementId);
    }

    /* ----------------------------
       Audio Worklets
    ----------------------------*/
    async addWorklet(name, processorUrl, options = {}) {
        const workletNode = new AudioWorkletNode(this.audioContext, name, options);
        this.worklets[name] = workletNode;
        return workletNode;
    }

    getWorklet(name) {
        return this.worklets[name] || null;
    }

    /* ----------------------------
       Event System
    ----------------------------*/
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(cb => cb(data));
    }

    /* ----------------------------
       Utilities
    ----------------------------*/
    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    }

    updateProgress(id) {
        const element = this.elements[id];
        if (!element) return;
        this.timing = element.currentTime;
        this.processBar = (element.currentTime / element.duration) * 100;
    }

    analyse() {
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }

    getMixedStream() {
        return this.streamDestination.stream;
    }

    toJson() {
        return {
            audioContext: this.audioContext.state,
            elements: Object.keys(this.elements),
            worklets: Object.keys(this.worklets),
            liveStream: this.liveStream
        };
    }
}