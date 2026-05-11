import { TsDomCanvas } from "./Teen/T.js";
export class TsunamiFlowAudio extends TsDomCanvas {
    AudioSource = {};
    AudioCxtId = null;
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
    constructor(options = {}) {
        super(options);

        if (options.constraints) {
            this.audioConstraints = {
                ...this.audioConstraints,
                ...options.constraints
            };
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
    }
    AudioState() {
        switch (this.AudioCxtId) {
            case null:
                console.log("The audio context state is unknown");
                break;
            case undefined:
                console.log("The audio context state is unknown");
                break;
            case "":
                console.log("The audio context state is unknown");
                break;
            case " ":
                console.log("The audio context state is unknown");
                break;
            default:
                if (this.AudioSource[this.AudioCxtId]) {
                    switch (this.AudioSource[this.AudioCxtId].state) {
                        case "suspended":
                            this.AudioSource[this.AudioCxtId].resume();
                            break;
                        case "running":
                            console.log("The audio context state is running");
                            if (this.AudioElement.waiting) {
                                this.AudioSource[this.AudioCxtId].suspend();
                            }
                            break;
                        case "closed":
                            console.log("The Audio context state must be closed");
                            if (this.AudioElement.paused) {
                                //this.StopVisualizator();
                            }
                            break;
                        default:
                            console.log("The audio context state is unknown");
                            break;
                    }
                } else {
                    console.log("The audio context state is does not exist");
                }

        }
    }
    /// context
    createTrackChain() {
        return {
            gain: this.TfSoundsContext.createGain(),
            analyser: this.TfSoundsContext.createAnalyser(),
            compressor: this.TfSoundsContext.createDynamicsCompressor()
        };
    }
    initAudioContext() {
        if (!this.TfSoundsContext) {
            this.TfSoundsContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (!this.masterGain) {
            // MASTER
            this.masterGain = this.TfSoundsContext.createGain();
            this.masterGain.gain.value = 1;
        }

        if (!this.TfSoundAnalyser) {
            // GLOBAL ANALYSER BUS
            this.TfSoundAnalyser = this.TfSoundsContext.createAnalyser();
            Object.assign(this.TfSoundAnalyser, this.TfSoundAnalyserOptions);

            // DATA BUFFER
            this.TfSoundsContextBufferLength = this.TfSoundAnalyser.frequencyBinCount;
        }
        // ROUTING

        this.masterGain
            .connect(this.TfSoundAnalyser)
            .connect(this.TfSoundsContext.destination);

        this.emit("ready", this.TfSoundsContext);
        if (this.TfSoundsContext.state === "suspended") {
            return this.TfSoundsContext.resume();
        }
    }

    addAudioContextSource(element, id = null) {
        this.initAudioContext();

        const sourceId = id || `source-${++this.TfSoundsidCounter}`;
        let source;

        if (this.elementSourceMap.has(element)) {
            source = this.elementSourceMap.get(element);
        } else {
            source = this.TfSoundsContext.createMediaElementSource(element);
            this.elementSourceMap.set(element, source);
        }

        const chain = this.createTrackChain();

        // ✅ CLEAN SIGNAL FLOW
        source
            .connect(chain.gain)
            .connect(chain.analyser)
            .connect(chain.compressor)
            .connect(this.masterGain);

        // ✅ STORE EVERYTHING (IMPORTANT)
        this.AudioSource[sourceId] = source;
        this.TfSoundsGain[sourceId] = chain.gain;

        if (!this.TfTrackAnalyser) this.TfTrackAnalyser = {};
        if (!this.TfTrackCompressor) this.TfTrackCompressor = {};

        this.TfTrackAnalyser[sourceId] = chain.analyser;
        this.TfTrackCompressor[sourceId] = chain.compressor;

        this.emit("sourceAdded", { id: sourceId });

        return sourceId;
    }

    /* ----------------------------
       Add MediaStreamSource
    -----------------------------*/
    addAudioStreamSource(stream, id = null) {
        this.initAudioContext();
        const sourceId = id || `source-${++this.TfSoundsidCounter}`;
        let source;

        if (this.elementSourceMap.has(stream)) {
            source = this.elementSourceMap.get(stream);
        } else {
            source = this.TfSoundsContext.createMediaStreamSource(stream);
            this.elementSourceMap.set(stream, source);
        }

        const chain = this.createTrackChain();

        // ✅ CLEAN SIGNAL FLOW
        source
            .connect(chain.gain)
            .connect(chain.analyser)
            .connect(chain.compressor)
            .connect(this.masterGain);

        // ✅ STORE EVERYTHING (IMPORTANT)
        this.AudioSource[sourceId] = source;
        this.TfSoundsGain[sourceId] = chain.gain;

        if (!this.TfTrackAnalyser) this.TfTrackAnalyser = {};
        if (!this.TfTrackCompressor) this.TfTrackCompressor = {};

        this.TfTrackAnalyser[sourceId] = chain.analyser;
        this.TfTrackCompressor[sourceId] = chain.compressor;

        this.emit("sourceAdded", { id: sourceId, gain: chain.gain });
        return sourceId;
    }

    /* ----------------------------
       Control Gain
    -----------------------------*/
    setAudioContextGain(id, value = 1) {
        if (this.TfSoundsGain[id]) this.TfSoundsGain[id].gain.value = value;
    }

    /* ----------------------------
       Remove Source
    -----------------------------*/
    removeAudioContextSource(id) {
        const source = this.AudioSource[id];
        const gain = this.TfSoundsGain[id];
        const analyser = this.TfTrackAnalyser[id];
        const compressor = this.TfTrackCompressor[id];

        if (source) source.disconnect();
        if (gain) gain.disconnect();
        if (analyser) analyser.disconnect();
        if (compressor) compressor.disconnect();

        delete this.AudioSource[id];
        delete this.TfSoundsGain[id];
        delete this.TfTrackAnalyser[id];
        delete this.TfTrackCompressor[id];

        this.emit("sourceRemoved", id);
    }
    finishAudioContext() {
        if (!this.TfSoundsContext) return;

        Object.values(this.AudioSource).forEach(src => src.disconnect());
        Object.values(this.TfSoundsGain).forEach(g => g.disconnect());

        if (this.masterGain) this.masterGain.disconnect();

        this.TfSoundsContext.close();

        this.TfSoundsContext = null;
        this.AudioSource = {};
        this.TfSoundsGain = {};
        this.elementSourceMap = new WeakMap();
        this.masterGain = null;

        this.emit("closed");
    }
}