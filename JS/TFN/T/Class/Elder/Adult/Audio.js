import { TsDomCanvas } from "./Teen/T.js";
export class TsunamiFlowAudio extends TsDomCanvas {
    // ===== DEFAULTS (Pattern B) =====
    SongList = null;
    randomMusicDefault = null;
    TfAudio = new Audio();
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
    AudioNetworkState() {
        if (this.AudioElement.readyState === 0) {
            console.log("Radio readyState is HAVE_NOTHING aka no data yet.");
            if (this.AudioElement.networkState === 0) {
                console.log("Radio networkState has NETWORK_EMPTY");
                if (this.AudioElement.src === "") {
                    console.log("The radio source is ''");

                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "the radio source is ''",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                } else if (!this.AudioElement.src) {
                    ("The radio source does not exist");
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "The radio source does not exist",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                } else if (this.AudioElement.src === " ") {
                    console.log("The radio source is ' '");
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "the radio source is ' '",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                } else if (this.AudioElement.src === "about:blank") {
                    console.log("The radio source is about:blank");
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "The radio source is about:blank",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                }
                else {
                    console.log("Something else is going on and I dont know what it is.");
                }
            } else if (this.AudioElement.networkState === 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.AudioElement.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE");
                //No valid source
                this.worker.postMessage(this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.network.state",
                    {
                        source: "web",
                        target: "device:web-001",
                        layer: "tf",
                        worker: "media",
                        backend: false
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: "none",
                        message: "Radio networkState has NETWORK_NO_SOURCE",
                        buffer: "nothing should be buffering.",
                        time: "Timer",
                    }));
            }
        } else if (this.AudioElement.readyState === 1) {
            console.log("Radio readyState is HAVE_METADATA");
            if (this.AudioElement.networkState === 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.AudioElement.networkState === 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.AudioElement.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE (but during the have metadata point.");
                //No valid source
            }
        } else if (this.AudioElement.readyState === 2) {
            console.log("Radio readyState is HAVE_CURRENT_DATA");
            if (this.AudioElement.networkState === 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.AudioElement.networkState === 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.AudioElement.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE but during the have ;loading point.");
                //No valid source
            }
        } else if (this.AudioElement.readyState === 3) {
            console.log("Radio readyState is HAVE_FUTURE_DATA");
            if (this.AudioElement.networkState === 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.AudioElement.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplay point.");
                //No valid source
            }
        } else if (this.AudioElement.readyState === 4) {
            console.log("Radio readyState is HAVE_ENOUGH_DATA");
            if (this.AudioElement.networkState === 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.AudioElement.networkState === 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.AudioElement.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplaythrough point.");
                //No valid source
            }

            if (this.AudioElement.ended) {
                if (this.AudioElement.src === "") {
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "the radio source is ''",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                } else if (this.AudioElement.src === undefined) {
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "the radio source is undefined",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                } else if (!this.AudioElement.src) {
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "the radio source is ''",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                } else {
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "skip",
                            file: "none",
                            message: "the radio source is ''",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                }
            } else {
                if (this.AudioElement.paused) {
                    if (this.AudioElement.currentTime === 0) {
                        console.log("Tsunami Radio has not started yet.");
                    } else {
                        console.log("Paused at " + this.AudioElement.currentTime);
                    }
                } else {
                    console.log("A song is still playing. Make the next song play using the functions");
                }
            }
        } else {
            if (this.AudioElement.networkState === 3) {
                console.log("The network could not find the source.");
                this.worker.postMessage(this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.network.state",
                    {
                        source: "web",
                        target: "device:web-001",
                        layer: "tf",
                        worker: "media",
                        backend: false
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: "none",
                        message: "The network could not find the source.",
                        buffer: "nothing should be buffering.",
                        time: "Timer",
                    }));
            } else {
                console.log("Some unknown error is going on with the Radio");
            }
        }
    }
    AudioFile(event) {
        if (!event?.data?.payload?.file) {
            const i = Math.floor(Math.random() * this.TfSoundsDefaultPlaylist.length);
            this.SongList = this.TfSoundsDefaultPlaylist[i];
            console.log("Default playlist:", this.SongList);
        } else {
            this.SongList = event.data.payload.file;
            console.log("From backend:", this.SongList);
        }

        return this.SongList;
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

            // MASTER
            this.masterGain = this.TfSoundsContext.createGain();
            this.masterGain.gain.value = 1;

            // GLOBAL ANALYSER BUS
            this.TfSoundAnalyser = this.TfSoundsContext.createAnalyser();
            Object.assign(this.TfSoundAnalyser, this.TfSoundAnalyserOptions);

            // DATA BUFFER
            this.TfSoundsContextBufferLength = this.TfSoundAnalyser.frequencyBinCount;
            this.TfSoundsContextDataArray = new Uint8Array(this.TfSoundsContextBufferLength);

            // ROUTING

            this.masterGain
                .connect(this.TfSoundAnalyser)
                .connect(this.TfSoundsContext.destination);

            this.emit("ready", this.TfSoundsContext);
        }

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
    async initWorklet(url, options = {}) {
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

        this.TfSoundsWorkletNode.port.onmessage = (e) =>
            this.emit("message", e.data);

        this.TfSoundsWorkletReady = true;

        this.emit("worklet-ready", this.TfSoundsWorkletNode);
    }
    ///worklet
    async initWorklet(url, wasmUrl, options = {}) {
        this.initAudioContext();

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