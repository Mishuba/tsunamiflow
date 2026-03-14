export class TfSpeechRecognition {
    constructor(lang = "en-US") {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        this.supported = !!SpeechRecognition;
        this.recognition = this.supported ? new SpeechRecognition() : null;
        this.listeners = {};
        this.active = false;

        if (!this.supported) {
            console.warn("Speech Recognition not supported in this browser.");
            return;
        }

        this.recognition.lang = lang;
        this.recognition.continuous = true;
        this.recognition.interimResults = true;

        this.recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(r => r[0].transcript)
                .join("");
            this.emit("result", transcript);
        };

        this.recognition.onerror = (err) => this.emit("error", err);
        this.recognition.onend = () => {
            this.active = false;
            this.emit("end");
        };
    }

    /* ----------------------------
       Start Recognition
    -----------------------------*/
    start() {
        if (!this.supported || this.active) return;
        try {
            this.recognition.start();
            this.active = true;
            this.emit("start");
            console.log("Speech Recognition started");
        } catch (err) {
            console.error("Failed to start Speech Recognition:", err);
            this.emit("error", err);
        }
    }

    /* ----------------------------
       Stop Recognition
    -----------------------------*/
    stop() {
        if (!this.supported || !this.active) return;
        this.recognition.stop();
        this.active = false;
        console.log("Speech Recognition stopped");
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
            active: this.active
        };
    }
}