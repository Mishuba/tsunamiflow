export class TfSpeechSynthesis {
    constructor() {
        if (!window.speechSynthesis) {
            console.warn("Speech Synthesis not supported");
            this.synth = null;
            return;
        }
        this.synth = window.speechSynthesis;
        this.queue = [];
    }

    speak(text, options = {}) {
        if (!this.synth) return;

        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = options.lang || "en-US";
        utter.pitch = options.pitch || 1;
        utter.rate = options.rate || 1;
        utter.volume = options.volume || 1;

        if (options.onstart) utter.onstart = options.onstart;
        if (options.onend) utter.onend = options.onend;
        if (options.onerror) utter.onerror = options.onerror;

        this.synth.speak(utter);
    }

    cancel() {
        if (!this.synth) return;
        this.synth.cancel();
    }

    pause() {
        if (!this.synth) return;
        this.synth.pause();
    }

    resume() {
        if (!this.synth) return;
        this.synth.resume();
    }
}