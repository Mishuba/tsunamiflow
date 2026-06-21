import { TsDomCanvas } from "./Child/Canvas.js";

export class TsunamiFlowSound extends TsDomCanvas {
    AudioElement = null;
    AudioContextInitialized = false;
    audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    };
    //context
    MasterCxtId = null;
    MasterSoundsContext = null;
    ContextElement = null;
    MasteridCounter = 0;
    masterGain = null;
    masterDelay = null;
    masterPanner = null;
    masterAnalyser = null;
    masterFloat32 = null;
    masterBufferLength = null;
    masterDataArray = null;
    masterCompressor = null;
    masterAudioWorklet = null;
    TfSoundsDelayOptions = {};
    TfSoundsPannerOptions = {};
    TfSoundAnalyserOptions = {
        fftSize: 2048,
        maxDecibels: 0,
        minDecibels: -100,
        smoothingTimeConstant: 0.5,
        channelCountMode: "max"
    };
    TfSoundsCompressorOptions = {};
    TfSoundsPeriodicWaveOptions = {};
    TfSoundsOscillatorNodeOptions = {};
    TfSoundsWaveShaperNodeOptions = {};
    TfSoundsContext = {};
    // Backwards-compatible alias: some modules use the pluralized name
    TfSoundsContextDataArray = {};
    AudioCxtId = null;
    TfSoundsidCounter = 0;
    TfSoundsDelay = {};
    TfSoundsGain = {};
    TfSoundsPanner = {};
    TfSoundAnalyser = {};
    TfSoundsContextBufferLength = {};
    TfSoundContextDataArray = {};
    TfSoundsCompressor = {};
    TfSoundsFloat32 = {};
    SoundWorklet = {};
    TfSoundsDefaultPlaylist = null;
    MixerDestination = null;
    constructor(options = {}) {
        super(options);

        if (options.constraints) {
            this.audioConstraints = {
                ...this.audioConstraints,
                ...options.constraints
            };
        }

        if (options.MasterSoundsContext) {
            this.MasterSoundsContext = options.MasterSoundsContext;
        }
        if (options.ContextElement) {
            this.ContextElement = options.ContextElement;
        }
        if (options.masterGain) {
            this.masterGain = options.masterGain;
        }
        if (options.masterAnalyser) {
            this.masterAnalyser = options.masterAnalyser;
        }
        if (options.masterCompressor) {
            this.masterCompressor = options.masterCompressor;
        }
        if (options.masterDelay) {
            this.masterDelay = options.masterDelay;
        }
        if (options.masterPanner) {
            this.masterPanner = options.masterPanner;
        }
        if (options.masterAudioWorklet) {
            this.masterAudioWorklet = options.masterAudioWorklet;
        }
        if (options.MixerDestination) {
            this.MixerDestination = options.MixerDestination;
        }
    }
    /// context
    createTrackChain() {

        const chain = {

            gain:
                this.MasterSoundsContext.createGain(),

            analyser:
                this.MasterSoundsContext.createAnalyser(),

            compressor:
                this.MasterSoundsContext
                    .createDynamicsCompressor(),

            delay:
                this.MasterSoundsContext
                    .createDelay(),

            panner:
                this.MasterSoundsContext
                    .createStereoPanner(),

            worklet: new AudioWorkletNode(
                this.MasterSoundsContext,
                "fft-processor"
            )
        };

        Object.assign(
            chain.analyser,
            this.TfSoundAnalyserOptions
        );

        return chain;
    }
    doctxok() {
        if (!this.ContextElement) {
            this.masterGain
                .connect(this.masterAnalyser)
                .connect(this.masterCompressor)
                .connect(this.masterAudioWorklet)
                .connect(this.MasterSoundsContext.destination);
        } else {
            this.ContextElement
                .connect(this.masterGain)
                .connect(this.masterAnalyser)
                .connect(this.masterCompressor)
                .connect(this.masterAudioWorklet)
                .connect(this.MasterSoundsContext.destination);
        }
    }
    async initAudioContext() {
        if (this.AudioContextInitialized) {
            if (this.MasterSoundsContext.state === "suspended") {
                return this.MasterSoundsContext.resume();
            }
            return this.MasterSoundsContext;
        }
        if (!this.MasterSoundsContext) {
            this.MasterSoundsContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        /*
        if (!this.ContextElement) {
            if (this.AudioElement) {
                // MASTER
                this.ContextElement = this.MasterSoundsContext.createMediaElementSource(this.AudioElement);
            } else {
                this.ContextElement = null;
            }
        }
        */
        if (!this.masterGain) {
            // MASTER
            this.masterGain = this.MasterSoundsContext.createGain();
            this.masterGain.gain.value = 1;
        }

        if (!this.masterAnalyser) {
            // GLOBAL ANALYSER BUS
            this.masterAnalyser = this.MasterSoundsContext.createAnalyser();
            Object.assign(this.masterAnalyser, this.TfSoundAnalyserOptions);

            // DATA BUFFER
            this.masterBufferLength = this.masterAnalyser.frequencyBinCount;
        } else {
            this.masterBufferLength = this.masterAnalyser.frequencyBinCount;
        }

        if (!this.masterCompressor) {
            // GLOBAL COMPRESSOR BUS
            this.masterCompressor = this.MasterSoundsContext.createDynamicsCompressor();
        }

        if (!this.masterAudioWorklet) {
            // GLOBAL AUDIO WORKLET
            this.MasterSoundsContext.audioWorklet.addModule("JS/TFN/T/Class/Elder/Adult/TfNationProcessor.js").then(async () => {
                this.masterAudioWorklet = new AudioWorkletNode(this.MasterSoundsContext, "fft-processor");
                this.masterAudioWorklet.port.onmessage = this.onWorkletMessage.bind(this);
            });
            this.doctxok();
        } else {
            this.doctxok();
        }

        // ROUTING
        this.emit("ready", this.MasterSoundsContext);
        if (this.MasterSoundsContext.state === "suspended") {
            return this.MasterSoundsContext.resume();
        }
        this.AudioContextInitialized = true;
        return this.MasterSoundsContext;
    }
    addAudioContextSource(element, id = null, type = null) {
        const sourceId = id || `source-${++this.MasteridCounter}`;
        let source;

        if (this.elementSourceMap.has(element)) {
            source = this.elementSourceMap.get(element);
        } else {
            if (type === "audio") {
                    source = this.MasterSoundsContext.createMediaElementSource(element);
                    this.elementSourceMap.set(element, source);
            } else if (type === "video") {
                source = this.MasterSoundsContext.createMediaStreamSource(element);
                this.elementSourceMap.set(element, source);
            }
        }

        const chain = this.createTrackChain();

        // ✅ CLEAN SIGNAL FLOW
        source.connect(chain.gain)
            .connect(chain.analyser)
            .connect(chain.compressor)
            .connect(chain.delay)
            .connect(chain.panner)
            .connect(this.masterGain);
        // ✅ STORE EVERYTHING (IMPORTANT)
        this.TfSoundsContext[sourceId] = source;
        this.TfSoundsGain[sourceId] = chain.gain;
        this.TfSoundAnalyser[sourceId] = chain.analyser;
        this.TfSoundsCompressor[sourceId] = chain.compressor;
        this.TfSoundsDelay[sourceId] = chain.delay;
        this.TfSoundsPanner[sourceId] = chain.panner;

        this.emit("sourceAdded", { id: sourceId });

        return sourceId;
    }
    connectaudio(element, id, type = "audio") {
        this.initAudioContext();
        if (this.TfSoundsContext[id]) return;
        this.addAudioContextSource(element, id, type);
    }
    removeSource(id) {
        const source = this.TfSoundsContext[id];
        const gain = this.TfSoundsGain[id];
        const analyser = this.TfTrackAnalyser[id];
        const compressor = this.TfSoundsCompressor[id];
        const worklet = this.SoundWorklet[id];
        const delay = this.TfSoundsDelay[id];
        const panner = this.TfSoundsPanner[id];

        if (source) source.disconnect();
        if (gain) gain.disconnect();
        if (analyser) analyser.disconnect();
        if (compressor) compressor.disconnect();
        if (worklet) worklet.disconnect();
        if (delay) delay.disconnect();
        if (panner) panner.disconnect();

        delete this.TfSoundsContext[id];
        delete this.TfSoundsGain[id];
        delete this.TfTrackAnalyser[id];
        delete this.TfSoundsCompressor[id];
        delete this.SoundWorklet[id];
        delete this.TfSoundsDelay[id];
        delete this.TfSoundsPanner[id];

        this.emit("sourceRemoved", id);
    }
    async HandleArrayBuffer(buffer) {
        this.initAudioContext();

        try {
            const audioBuffer = await this.TfSoundsContext[id].decodeAudioData(buffer);
            return new Float32Array(audioBuffer.getChannelData(0));
        } catch (error) {
            console.error("Error decoding audio data:", error);
            return null;
        }
    }

    AudioContextState(context, id) {
        switch (this.AudioCxtId) {
            case null:
            case undefined:
            case "":
            case " ":
                console.log("The audio context state is unknown");
                break;
            default:
                if (!this.AudioSource[this.AudioCxtId]) {
                    console.log("The audio soundEngine context state does not exist");
                } else {
                    switch (this.AudioSource[this.AudioCxtId].state) {
                        case "suspended":
                            console.log("The audio soundEngine context state is suspended, resuming...");
                            this.AudioSource[this.AudioCxtId].resume();
                            break;
                        case "running":
                            console.log("The audio soundEngine context state is running");
                            if (this.AudioElement.waiting) {
                                this.AudioSource[this.AudioCxtId].suspend();
                            }
                            break;
                        case "closed":
                            console.log("The Audio soundEngine context state must be closed");
                            if (this.AudioElement.paused) {
                                //this.StopVisualizator();
                            }
                            break;
                        default:
                            console.log("The audio soundEngine context state is unknown");
                            break;
                    }
                }
        }
    }
    playDecodedBuffer(id, float32Array) {
        this.initAudioContext()
        const buffer = this.TfSoundsContext[id].createBuffer(
            1,
            float32Array.length,
            this.TfSoundsContext[id].sampleRate
        );

        buffer.copyToChannel(float32Array, 0);

        const source = this.TfSoundsContext[id].createBufferSource();
        source.buffer = buffer;

        const chain = this.createTrackChain();

        source
            .connect(chain.gain)
            .connect(chain.compressor)
            .connect(chain.analyser)
            .connect(this.masterGain);

        source.start();
        source.onended = () => {
            source.disconnect();
            chain.gain.disconnect();
            chain.analyser.disconnect();
            chain.compressor.disconnect();
        };
    }
    setaudioVolume(id, value = 1) {
        let gainNode = this.TfSoundsGain[id];

        if (gainNode) {
            gainNode.gain.value = value;
        } else {
            this.AudioElement.volume = value;
        }
    }
    setAudioContextGain(id, value = 1) {
        if (this.TfSoundsGain[id]) this.TfSoundsGain[id].gain.value = value;
    }
    finishAudioContext() {
        if (!this.MasterSoundsContext) return;

        Object.values(this.TfSoundsContext).forEach(src => src.disconnect());
        Object.values(this.TfSoundsGain).forEach(g => g.disconnect());

        if (this.masterGain) this.masterGain.disconnect();

        this.MasterSoundsContext.close();

        this.MasterSoundsContext = null;
        this.TfSoundsContext = {};
        this.TfSoundsGain = {};
        this.elementSourceMap = new WeakMap();
        this.masterGain = null;

        this.emit("closed");
    }
    SendWorkletToWorker(type, action, meta, system, data) {
        this.worker.postMessage(
            this.tycadome(
                "tycadome-guest" + Date.now(),
                type,
                action,
                meta,
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                {
                    system: system,
                    worklet: data,
                    //baseRadius: this.baseRadius,
                    //particles: this.particles
                }
            )
        );
    }
    onWorkletMessage(e) {
        this.masterFloat32 = new Float32Array(e.data);
        this.processAudioForVideo();
        const pcm = e.data.pcm;
        const features = this.dsp.process(pcm);

        this.latestAudio = features;

        // GAME SIGNALS
        //this.updateGame(features);

        // VISUAL SIGNALS
        this.masterAudioWorklet.postMessage(this.tycadome(
            "visual",
            "radio",
            "audio.frame",
            {},
            { status: "ok" },
            "async",
            {
                system: "visual_data",
                dataArray: features.fft,
                volume: features.volume,
                bass: features.bass,
                mid: features.mid,
                treble: features.treble,
                beat: features.beat,
                particles: this.particles
            }
        ));
        //updateAnalyser();
        this.masterAudioWorklet.postMessage(
            this.tycadome(
                "tycadome-guest" + Date.now(),
                "visualizator",
                "radio.playing",
                {
                    source: "web",
                    target: "device:web-001"
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                {
                    system: "visual_data",
                    dataArray: this.masterDataArray,
                    dataArrayLength: this.masterDataArray.length,
                    baseRadius: this.baseRadius,
                    particles: this.particles,
                    volume: this.TfSoundVolume
                }
            )
        );
    }
    processAudioForVideo() {
        this.masterBufferLength = this.masterFloat32.length;
        let sum = 0;
        for (let i = 0; i < this.masterBufferLength; i++) {
            sum += this.masterFloat32[i] * this.masterFloat32[i];
        }
        this.TfSoundVolume = Math.sqrt(sum / this.masterBufferLength);
        this.masterDataArray = new Uint8Array(this.masterBufferLength / 4);
        this.TfSoundChunkSize = Math.floor(this.masterBufferLength / this.masterDataArray.length);

        for (let i = 0; i < this.masterDataArray.length; i++) {
            this.TfSoundchunkSum = 0;
            for (let j = 0; j < this.TfSoundChunkSize; j++) {
                this.TfSoundSample = this.masterFloat32[i * this.TfSoundChunkSize + j] || 0;
                this.TfSoundchunkSum += Math.abs(this.TfSoundSample);
            }
            this.masterDataArray[i] = Math.min(255, this.TfSoundchunkSum * 400);
        }
    }
}