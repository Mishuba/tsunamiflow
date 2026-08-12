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
        if (options.masterDataArray) {
            this.masterDataArray = options.masterDataArray;
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
    createTrackChain(SoundsContext) {

        const chain = {
            gain: SoundsContext.createGain(),
            analyser: SoundsContext.createAnalyser(),
            compressor: SoundsContext.createDynamicsCompressor(),
            delay: SoundsContext.createDelay(),
            panner: SoundsContext.createStereoPanner(),
        };

        Object.assign(
            chain.analyser,
            this.TfSoundAnalyserOptions
        );

        return chain;
    }
    doctxok(SoundsContext, ContextElement, Gain, Analyser, worklet) {
        if (!ContextElement) {
            Gain.connect(Analyser).connect(worklet).connect(SoundsContext.destination);
        } else {
            ContextElement.connect(Gain).connect(Analyser).connect(worklet).connect(SoundsContext.destination);
        }
    }
    async initAudioContext(SoundsContext, ContextElement, Gain, Analyser, worklet, worker) {

        if (this.AudioContextInitialized) {
            if (SoundsContext.state === "suspended") {
                return SoundsContext.resume();
            }
            return SoundsContext;
        }

        if (this.MasterSoundsContext === SoundsContext) {
            console.log("The radio BLANK is the same as the one passed.");
        } else {
            if (!SoundsContext) {
                SoundsContext = new (window.AudioContext || window.webkitAudioContext)();

            } else {
                this.MasterSoundsContext = SoundsContext;
            }
        }

        if (this.ContextElement === ContextElement) {

        } else {
            if (!ContextElement) {
                if (this.AudioElement) {
                    // MASTER
                    ContextElement = SoundsContext.createMediaElementSource(this.AudioElement);
                    this.ContextElement = ContextElement;
                } else {
                    ContextElement = null;
                }
            } else {
                this.ContextElement = ContextElement;
            }
        }

        if (this.masterGain === Gain) {

        } else {
            if (!Gain) {
                // MASTER
                Gain = SoundsContext.createGain();
                Gain.gain.value = 1;
                this.masterGain = Gain;
            } else {
                this.masterGain = Gain;
            }
        }

        if (this.masterAnalyser === Analyser) {

        } else {
            if (!Analyser) {
                // GLOBAL ANALYSER BUS
                Analyser = SoundsContext.createAnalyser();
                Object.assign(Analyser, this.TfSoundAnalyserOptions);
                this.masterAnalyser = Analyser;
            } else {
                this.masterAnalyser = Analyser;
            }
        }

        if (this.masterAudioWorklet === worklet) {

        } else {
            if (!worklet) {
                // GLOBAL AUDIO WORKLET
                await SoundsContext.audioWorklet.addModule("https://tsunamiflow.club/JS/TFN/T/Class/Elder/Adult/TfNationProcessor.js");
                worklet = new AudioWorkletNode(SoundsContext, "fft-processor", this.Workletoptions)ss;


                //this.masterAudioContextChain =
                this.doctxok(SoundsContext, ContextElement, Gain, Analyser, worklet);
                worklet.port.onmessage = this.onWorkletMessage.bind(this);
                this.masterAudioWorklet = worklet;
            } else {
                this.doctxok(SoundsContext, ContextElement, Gain, Analyser, worklet);
                worklet.port.onmessage = async (message) => {
                    this.onWorkletMessage(message, worker);
                }
                this.masterAudioWorklet = worklet;
            }
        }

        // ROUTING
        this.emit("ready", SoundsContext);
        if (SoundsContext.state === "suspended") {
            return SoundsContext.resume();
        }
        this.AudioContextInitialized = true;
        return SoundsContext;
    }
    addAudioContextSource(element, SoundsContext, Gain, id = null, type = null) {
        const sourceId = id || `source-${++this.MasteridCounter}`;
        let source;

        if (this.elementSourceMap.has(element)) {
            source = this.elementSourceMap.get(element);
        } else {
            if (type === "audio") {
                source = SoundsContext.createMediaElementSource(element);
                this.elementSourceMap.set(element, source);
            } else if (type === "video") {
                source = SoundsContext.createMediaStreamSource(element);
                this.elementSourceMap.set(element, source);
            }
        }

        const chain = this.createTrackChain();

        // ✅ CLEAN SIGNAL FLOW
        source.connect(chain.gain)
            .connect(chain.analyser).connect(chain.compressor)
            //.connect(chain.delay)
            //.connect(chain.panner)
            .connect(Gain);
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
    connectaudio(SoundsContext, ContextElement, Gain, Analyser, worklet, id = "radio", type = "audio") {
        this.initAudioContext(SoundsContext, ContextElement, Gain, Analyser, worklet);
        //if (this.TfSoundsContext[id]) return;
        //this.addAudioContextSource(element, SoundsContext, Gain, id, type);
    }
    removeSource(id) {
        const source = this.TfSoundsContext[id];
        const gain = this.TfSoundsGain[id];
        const analyser = this.TfSoundAnalyser[id];
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
        delete this.TfSoundAnalyser[id];
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
    finishAudioContext(SoundContext, Gain) {
        if (!SoundsContext) return;

        Object.values(this.TfSoundsContext).forEach(src => src.disconnect());
        Object.values(this.TfSoundsGain).forEach(g => g.disconnect());

        if (Gain) {
            Gain.disconnect();
        }

        SoundsContext.close();

        SoundsContext = null;
        this.TfSoundsContext = {};
        this.TfSoundsGain = {};
        this.elementSourceMap = new WeakMap();
        rGain = null;

        this.emit("closed");
    }
    SendWorkletToWorker(type, action, meta, system, data) {
        this.masterAudioWorklet.postMessage(
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
    onWorkletMessage(e, worker) {
        switch (event.data.type) {
            case "audio.worklet":
                worker.postmessage(this.tycadome(
                    e.data.id,
                    e.data.type,
                    e.data.action,
                    e.data.meta,
                    e.data.state,
                    e.data.mode,
                    e.data.payload
                ));
        }

        // GAME SIGNALS
        //this.updateGame(features);
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