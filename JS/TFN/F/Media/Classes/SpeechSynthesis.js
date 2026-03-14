export class TfSpeechSynthesis {
    constructor() {
        this.supported = 'speechSynthesis' in window;
        this.synth = this.supported ? window.speechSynthesis : null;
        this.queue = [];
        this.activeUtterance = null;
        this.listeners = {};

        if (!this.supported) {
            console.warn("Speech Synthesis not supported in this browser.");
            return;
        }
    }

    /* ----------------------------
       Speak Text
    -----------------------------*/
    speak(text, options = {}) {
        if (!this.supported || !text) return;

        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = options.lang || "en-US";
        utter.pitch = options.pitch ?? 1;
        utter.rate = options.rate ?? 1;
        utter.volume = options.volume ?? 1;

        // Attach events
        utter.onstart = () => {
            this.activeUtterance = utter;
            this.emit("start", utter.text);
            if (options.onstart) options.onstart(utter);
        };
        utter.onend = () => {
            this.activeUtterance = null;
            this.emit("end", utter.text);
            if (options.onend) options.onend(utter);
            // Auto-play next in queue
            if (this.queue.length > 0) this.speak(this.queue.shift());
        };
        utter.onerror = (err) => {
            this.activeUtterance = null;
            this.emit("error", err);
            if (options.onerror) options.onerror(err);
        };

        // Queue handling
        if (this.synth.speaking) {
            this.queue.push(text);
        } else {
            this.synth.speak(utter);
        }
    }

    /* ----------------------------
       Pause, Resume, Cancel
    -----------------------------*/
    pause() {
        if (!this.supported || !this.synth.speaking) return;
        this.synth.pause();
        this.emit("pause");
    }

    resume() {
        if (!this.supported || !this.synth.paused) return;
        this.synth.resume();
        this.emit("resume");
    }

    cancel() {
        if (!this.supported) return;
        this.synth.cancel();
        this.queue = [];
        this.activeUtterance = null;
        this.emit("cancel");
    }

    /* ----------------------------
       Event System
    -----------------------------*/
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(cb => cb(data));
    }

    /* ----------------------------
       Quick JSON Status
    -----------------------------*/
    toJson() {
        return {
            supported: this.supported,
            speaking: this.synth?.speaking || false,
            paused: this.synth?.paused || false,
            queueLength: this.queue.length
        };
    }
}