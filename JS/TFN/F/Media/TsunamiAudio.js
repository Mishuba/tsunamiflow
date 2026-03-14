export class TsunamiFlowAudio {
    constructor() {
        // Core Audio
        this.audioContext = new TfAudioContext();
        this.mixer = new TfAudioMixer(this.audioContext.create());

        // Worklets
        this.worklets = {};

        // Media Elements
        this.elements = {};

        // Speech
        this.speechRecognition = new TfSpeechRecognition();
        this.speechSynthesis = new TfSpeechSynthesis();

        this.listeners = {};
    }

    /* ----------------------------
       AudioContext / Mixer
    -----------------------------*/
    createAudioContext() {
        return this.audioContext.create();
    }

    addElementSource(element, id = null, monitor = false) {
        const sourceId = this.mixer.addMediaElement(element, id, monitor);
        this.elements[sourceId] = element;
        return sourceId;
    }

    async addMic(id = null) {
        const result = await this.mixer.addMic(id);
        return result;
    }

    setVolume(id, value = 1) {
        this.mixer.setVolume(id, value);
    }

    removeSource(id) {
        this.mixer.removeSource(id);
        delete this.elements[id];
    }

    resetMixer() {
        this.mixer.reset();
        this.elements = {};
    }

    getMixedStream() {
        return this.mixer.getStream();
    }

    /* ----------------------------
       AudioWorklets
    -----------------------------*/
    async addWorklet(name, processorUrl, options = {}) {
        const worklet = new TfAudioWorkletNode({ context: this.audioContext.context, processorUrl, options: { name, ...options } });
        await worklet.init();
        this.worklets[name] = worklet;
        return worklet;
    }

    getWorklet(name) {
        return this.worklets[name] || null;
    }

    /* ----------------------------
       Media Elements
    -----------------------------*/
    createElement(src, id = null) {
        const el = new TfAudioElement(src, this.audioContext.context);
        const elementId = id || `element-${Object.keys(this.elements).length + 1}`;
        this.elements[elementId] = el;
        return el;
    }

    getElement(id) {
        return this.elements[id] || null;
    }

    /* ----------------------------
       Speech Recognition
    -----------------------------*/
    startRecognition() {
        this.speechRecognition.start();
    }

    stopRecognition() {
        this.speechRecognition.stop();
    }

    /* ----------------------------
       Speech Synthesis
    -----------------------------*/
    speak(text, options = {}) {
        this.speechSynthesis.speak(text, options);
    }

    pauseSpeech() {
        this.speechSynthesis.pause();
    }

    resumeSpeech() {
        this.speechSynthesis.resume();
    }

    cancelSpeech() {
        this.speechSynthesis.cancel();
    }

    /* ----------------------------
       Unified Event System
    -----------------------------*/
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(cb => cb(data));
    }

    /* ----------------------------
       Status Snapshot
    -----------------------------*/
    toJson() {
        return {
            audioContext: this.audioContext.toJson(),
            mixer: this.mixer.toJson(),
            worklets: Object.fromEntries(Object.entries(this.worklets).map(([k, w]) => [k, w.toJson()])),
            elements: Object.keys(this.elements),
            speechRecognition: this.speechRecognition.toJson(),
            speechSynthesis: this.speechSynthesis.toJson()
        };
    }
}