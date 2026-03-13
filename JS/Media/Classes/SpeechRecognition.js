export class TfSpeechRecognition {
    constructor(lang = "en-US") {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition not supported");
            this.recognition = null;
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = lang;
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.listeners = {};
    }

    start() {
        if (!this.recognition) return;
        this.recognition.start();

        this.recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(r => r[0].transcript)
                .join("");
            this.emit("result", transcript);
        };

        this.recognition.onerror = (err) => this.emit("error", err);
        this.recognition.onend = () => this.emit("end");
        console.log("Speech Recognition started");
    }

    stop() {
        if (!this.recognition) return;
        this.recognition.stop();
        console.log("Speech Recognition stopped");
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }
}