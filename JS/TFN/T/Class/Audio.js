export class TfSounds extends Tsu {
    // ===== DEFAULTS (Pattern B) =====
    lang = "en-US";
    listeners = {};

    TfAudio = new Audio();
    AudioElement = null;

    SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    TfSpeechSupported = "speechSynthesis" in window;

    NamiSpeechOptions = {
        lang: "en-US",
        pitch: 1,
        rate: 1,
        volume: 1
    };

    TfSoundsContext =
        new (window.AudioContext || window.webkitAudioContext)();

    TfSoundsOutput = this.TfSoundsContext.destination;

    audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    };

    TfSoundsWorkletReady = false;

    constructor(options = {}) {
        super(options);

        // ===== OVERRIDES =====
        if (options.lang) {
            this.lang = options.lang;
            this.NamiSpeechOptions.lang = options.lang;
        }

        if (options.constraints) {
            this.audioConstraints = {
                ...this.audioConstraints,
                ...options.constraints
            };
        }

        if (options.audioElement) {
            this.AudioElement = options.audioElement;
        }

        // FIX: apply after instantiation
        this.TfAudio.crossOrigin = "anonymous";

        // ===== SPEECH RECOGNITION =====
        if (!this.SpeechRecognitionAPI) {
            console.warn("Speech Recognition not supported.");
            this.SpeechRecognition = null;
        } else {
            this.SpeechRecognition = new this.SpeechRecognitionAPI();

            this.SpeechRecognition.lang = this.lang;
            this.SpeechRecognition.continuous = true;
            this.SpeechRecognition.interimResults = true;

            this.SpeechRecognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(r => r[0].transcript)
                    .join("");

                this.emit("result", transcript);
            };

            this.SpeechRecognition.onerror = (err) =>
                this.emit("error", err);

            this.SpeechRecognition.onend = () => {
                this.active = false;
                this.emit("end");
            };
        }

        // ===== SPEECH SYNTHESIS =====
        if (!this.TfSpeechSupported) {
            console.warn("Speech Synthesis not supported.");
            this.TfSpeech = null;
            this.NamiSpeech = null;
        } else {
            this.TfSpeech = window.speechSynthesis;

            this.NamiSpeech = new SpeechSynthesisUtterance();
            Object.assign(this.NamiSpeech, this.NamiSpeechOptions);
        }

        // ===== STREAM OUTPUT =====
        this.TfSoundsContextDestination =
            this.TfSoundsContext.createMediaStreamDestination();

        this.emit("ready", this.TfSoundsContext);
    }

    // ===== WORKLET (ASYNC — REQUIRED) =====
    async initWorklet(url, options = {}) {
        if (!this.TfSoundsContext.audioWorklet) {
            throw new Error("AudioWorklet not supported.");
        }

        if (!url) {
            throw new Error("Processor URL not provided.");
        }

        await this.TfSoundsContext.audioWorklet.addModule(url);

        this.TfSoundsWorkletNode = new AudioWorkletNode(
            this.TfSoundsContext,
            "TfSoundsProcessor",
            options
        );

        this.TfSoundsWorkletNode.port.onmessage = (e) =>
            this.emit("message", e.data);

        this.TfSoundsWorkletReady = true;

        this.emit("worklet-ready", this.TfSoundsWorkletNode);
    }

    log(msg) {
        return super.log(msg);
    }

    find(elem, frame = null) {
        return super.find(elem, frame);
    }

    check(event, fn) {
        return super.check(event, fn);
    }

    emit(event, data) {
        return super.emit(event, data);
    }

    on(id, handler, preventDefault = false, iframe = null) {
        return super.on(id, handler, preventDefault, iframe);
    }
}