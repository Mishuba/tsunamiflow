import { TsDomCanvas } from "./Teen/Child/Canvas.js";
export class TsunamiFlowAudio extends TsDomCanvas {
    // ===== DEFAULTS (Pattern B) =====
    SongList = null;
    randomMusicDefault = null;
    AudioSource = {};
    AudioElement = null;
    AudioReady = null;
    AudioCxtId = null;
    SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    TfSpeechSupported = "speechSynthesis" in window;
    NamiSpeechOptions = {
        lang: "en-US",
        pitch: 1,
        rate: 1,
        volume: 1
    };
    //context
    TfSoundsContext = null;
    // new (window.AudioContext || window.webkitAudioContext)();
    TfSoundsidCounter = 0;
    TfSoundsGain = {};
    masterGain = null;
    TfSoundAnalyser = null;
    TfSoundAnalyserOptions = {
        fftSize: 2048,
        maxDecibels: 0,
        minDecibels: -100,
        smoothingTimeConstant: 0.5,
        channelCountMode: "max"
    };
    TfSoundsContextBufferLength = null;
    TfTrackAnalyser = {};
    TfTrackCompressor = {};
    TfSoundsFloat32FromIterable = null;
    TfSoundsPeriodicWaveOptions = {};
    TfSoundsPeridocWave = null;
    TfSoundsPannerOptions = {};
    TfSoundsPanner = null;
    TfSoundsDelayOptions = {};
    TfSoundsDelay = null;
    TfSoundsCompressorOptions = {};
    TfSoundsCompressor = null;
    TfSoundsDefaultPlaylist = null;
    //worklet 
    TfSoundsWorkletReady = false;
    TfSoundsWorkletNode = null;
    // worklet end
    TfSoundsOscillatorNodeOptions = {};
    TfSoundsOscillator = null;
    TfSoundsWaveShaperNodeOptions = {};
    TfSoundsWaveShaper = null;
    TfSoundContextBufferLength = null;
    TfSoundContextDataArray = null;
    audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    };
    elementSourceMap = new WeakMap();
    constructor(options = {}) {
        super(options);

        // ===== OVERRIDES =====
        if (options.lang) {

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

        if (options.SoundContext) {
            this.TfSoundsContext = options.SoundContext;
        }

        if (options.masterGain) {
            this.masterGain = options.masterGain;
        }
        if (options.TfSoundAnalyser) {
            this.TfSoundAnalyser = options.TfSoundAnalyser;
        }
        // FIX: apply after instantiation
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
    }
    speak(text) {
        if (!this.TfSpeech) return;

        this.NamiSpeech.text = text;
        this.TfSpeech.speak(this.NamiSpeech);
    }

    listen() {
        if (!this.SpeechRecognition) return;

        this.SpeechRecognition.start();
        this.active = true;
    }

    stopListening() {
        if (!this.SpeechRecognition) return;

        this.SpeechRecognition.stop();
        this.active = false;
    }

    // ===== WORKLET (ASYNC — REQUIRED) =====
    async initWorklet(url, wasm, options = {}) {
        this.initAudioContext();
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

        // 🔥 LOAD WASM
        const wasmBinary = await fetch(wasmUrl).then(r => r.arrayBuffer());

        this.TfSoundsWorkletNode.port.postMessage({
            type: "init_wasm",
            wasmBinary
        });

        this.TfSoundsWorkletNode.port.onmessage = (e) =>
            this.emit("message", e.data);

        this.TfSoundsWorkletReady = true;

        this.emit("worklet-ready", this.TfSoundsWorkletNode);
    }
    connectworklet(destination) {
        if (!this.TfSoundsWorkletNode) return;
        this.TfSoundsWorkletNode.connect(destination);
    }

    disconnectworklet() {
        if (!this.TfSoundsWorkletNode) return;
        this.TfSoundsWorkletNode.disconnect();
    }

    /* ----------------------------
       Send message to processor
    -----------------------------*/
    postworkletMessage(message) {
        if (!this.TfSoundsWorkletNode) return;
        this.TfSoundsWorkletNode.port.postMessage(message);
    }
    ///worklet ends
}