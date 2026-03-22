export class TfSounds extends Tsu {
    lang = "en-US";
    TfAudio = new Audio();
    AudioElement = null;
    SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    TfSpeech = 'speechSynthesis' in window;
    NamiSpeechOptions = {
        lang: this.lang,
        pitch: 1,
        rate: 1,
        volume: 1
    };
    TfSoundsContext = new (window.AudioContext || window.webkitAudioContext)();
    audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        ...constraints
    };

    constructor(options = {}) {
        this.listeners = {};
        this.lang = options.lang || "en-US";
        this.TfAudio = TfAudio;
        this.TfAudio.crossOrigin = "anonymous";
        this.AudioElement = AudioElement;



        if (!(!!SpeechRecognition)) {
            console.warn("Speech Recognition not supported in this browser.");
            this.SpeechRecognition = null;
        } else {
            this.SpeechRecognition = new SpeechRecognition();
            this.SpeechRecognition.lang = this.lang;
            this.SpeechRecognition.continuous = true;
            this.SpeechRecognition.interimResults = true;
            this.SpeechRecognition.onresult = (event) => {
                const SpeechRecognitiontranscript = Array.from(event.results)
                    .map(r => r[0].SpeechRecognitiontranscript)
                    .join("");
                this.emit("result", SpeechRecognitiontranscript);
            };

            this.SpeechRecognition.onerror = (err) => this.emit("error", err);
            this.SpeechRecognition.onend = () => {
                this.active = false;
                this.emit("end");
            };
        }
        if (!(TfSpeech)) {
            console.warn("Speech Synthesis not supported in this browser.");
            this.TfSpeech = null;
            this.NamiSpeech = null;
            this.NamiSpeechOptions = null;
        } else {
            this.NamiSpeechOptions = NamiSpeechOptions;
            this.TfSpeech = window.speechSynthesis;

            this.NamiSpeech = new SpeechSynthesisUtterance();

            this.NamiSpeech.lang = this.lang;
            this.NamiSpeech.pitch = this.NamiSpeechOptions.pitch;
            this.NamiSpeech.rate = this.NamiSpeechOptions.rate;
            this.NamiSpeech.volume = this.NamiSpeechOptions.volume;
        }
        this.TfSoundsContext = TfSoundsContext;
        this.TfSoundsOutput = this.TfSoundsContext.destination;
        this.emit("ready", this.TfSoundsContex);
        try {
            if (!this.TfSoundsContext.audioWorklet) {
                const err = new Error("AudioWorklet not supported in this browser.");
                console.error(err);
                this.emit("error", err);
                throw err;
            } else {
                if (!this.TfSoundsWorkletProcessorUrl) {
                    const err = new Error("Processor URL not provided.");
                    console.error(err);
                    this.emit("error", err);
                    throw err;
                } else {
                    this.TfSoundsWorklet = this.TfSoundsContext.audioWorklet;
                    this.TfSoundsWorklet.addModule(this.TfSoundsWorkletProcessorUrl);
                    this.TfSoundsWorkletNode = new AudioWorkletNode(this.TfSoundsContext, "TfSoundsProcessor", this.TfSoundsWorkletOptions);
                    this.TfSoundsWorkletNode.port.onmessage = (e) => this.emit("message", e.data);
                    this.TfSoundsWorkletReady = true;
                    this.emit("ready", this.TfSoundsWorkletNode);
                }
            }
        } catch (err) {
            console.error("Failed to load AudioWorkletNode:", err);
            this.emit("error", err);
            throw err;
        }
        this.TfSoundsContextDestination = this.TfSoundsContext.createMediaStreamDestination();
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