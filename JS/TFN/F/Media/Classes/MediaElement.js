// TfAudioElement.js

export class TfAudioElement {

    constructor(src = null, context = null) {

        this.audio = new Audio();
        this.audio.crossOrigin = "anonymous";

        if (src) this.audio.src = src;

        this.context = context || null;
        this.source = null;
        this.gain = null;

        this.listeners = {};
        this.ready = false;

        this._initEvents();
    }

    /* -----------------------------
       Internal Events
    ------------------------------*/

    _initEvents() {

        this.audio.addEventListener("loadedmetadata", () => {
            this.ready = true;
            this.emit("ready", this.audio.duration);
        });

        this.audio.addEventListener("play", () => this.emit("play"));
        this.audio.addEventListener("pause", () => this.emit("pause"));
        this.audio.addEventListener("ended", () => this.emit("ended"));

        this.audio.addEventListener("timeupdate", () => {
            this.emit("timeupdate", this.audio.currentTime);
        });

        this.audio.addEventListener("error", (e) => {
            this.emit("error", e);
        });
    }

    /* -----------------------------
       WebAudio Integration
    ------------------------------*/

    connect(context) {

        if (!context) return;

        this.context = context;

        if (!this.source) {

            this.source = context.createMediaElementSource(this.audio);
            this.gain = context.createGain();

            this.source.connect(this.gain);
            this.gain.connect(context.destination);

        }
    }

    setVolume(value = 1) {
        if (this.gain) {
            this.gain.gain.value = value;
        } else {
            this.audio.volume = value;
        }
    }

    /* -----------------------------
       Playback Controls
    ------------------------------*/

    load(src) {
        this.audio.src = src;
        this.audio.load();
    }

    play() {
        return this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    seek(time) {
        this.audio.currentTime = time;
    }

    setLoop(loop = true) {
        this.audio.loop = loop;
    }

    setPlaybackRate(rate = 1) {
        this.audio.playbackRate = rate;
    }

    mute(state = true) {
        this.audio.muted = state;
    }

    /* -----------------------------
       State
    ------------------------------*/

    getCurrentTime() {
        return this.audio.currentTime;
    }

    getDuration() {
        return this.audio.duration;
    }

    isPlaying() {
        return !this.audio.paused;
    }

    /* -----------------------------
       Events
    ------------------------------*/

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data = null) {

        if (!this.listeners[event]) return;

        this.listeners[event].forEach(cb => cb(data));
    }

    /* -----------------------------
       Destroy
    ------------------------------*/

    destroy() {

        this.pause();

        if (this.source) {
            this.source.disconnect();
            this.gain.disconnect();
        }

        this.audio.src = "";
        this.listeners = {};
    }

}