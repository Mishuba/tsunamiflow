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
    Workletoptions = {
        numberOfInputs: 1, // 0
        numberOfOutputs: 1,

        processorOptions: {
            mode: "fft",
            fftSize: 2048,
            customFlag: true
        },
        //outputChannelCount: [2], //[1]mono [2]stereo [2,2]dual stereo outputs // for more outputs use array length and channelCountMode "max"
        /*
        parameterData: {
          gain: 0.5,
          frequency: 440,
          delayTime: 0.5,
          feedback: 0.5,
          distortionAmount: 0.5,
          pannerX: 0,
          pannerY: 0,
          pannerZ: 0
        },
        */
        channelCount: 2,
        channelCountMode: "max",
        channelInterpretation: "speakers"
    };
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
        worklet.port.onmessage = async (message) => {
            this.onWorkletMessage(message, worker).bind(this);
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
            console.log("The radio SoundsContext is the same as the one passed.");
            if (this.ContextElement === ContextElement) {
                console.log("The radio ContextElement is the same as the one passed.");
                if (this.masterGain === Gain) {
                    console.log("The radio Gain is the same as the one passed.");
                    if (this.masterAnalyser === Analyser) {
                        console.log("The radio Analyser is the same as the one passed.");
                        if (this.masterAudioWorklet === worklet) {
                            console.log("The radio AudioWorklet is the same as the one passed.");

                            this.doctxok(this.MasterSoundsContext, this.ContextElement, this.masterGain, this.masterAnalyser, this.masterAudioWorklet, worker);
                        } else {
                            console.error("the radio AudioWorklet is not the same as the one passed");
                            await this.MasterSoundsContext.audioWorklet.addModule("https://tsunamiflow.club/JS/TFN/T/Class/Elder/Adult/TfNationProcessor.js");
                            this.masterAudioWorklet = new AudioWorkletNode(SoundsContext, "fft-processor", this.Workletoptions);

                            //this.masterAudioContextChain =
                            this.doctxok(this.MasterSoundsContext, this.ContextElement, this.masterGain, this.masterAnalyser, this.masterAudioWorklet, worker);
                        }
                    } else {
                        this.masterAnalyser = this.MasterSoundsContext.createAnalyser();
                        Object.assign(this.masterAnalyser, this.TfSoundAnalyserOptions);
                        await this.MasterSoundsContext.audioWorklet.addModule("https://tsunamiflow.club/JS/TFN/T/Class/Elder/Adult/TfNationProcessor.js");
                        this.masterAudioWorklet = new AudioWorkletNode(SoundsContext, "fft-processor", this.Workletoptions);

                        //this.masterAudioContextChain =
                        this.doctxok(this.MasterSoundsContext, this.ContextElement, this.masterGain, this.masterAnalyser, this.masterAudioWorklet, worker);
                    }
                } else {
                    this.masterGain = this.MasterSoundsContext.createGain();
                    this.masterGain.gain.value = 1;
                    this.masterAnalyser = this.MasterSoundsContext.createAnalyser();
                    Object.assign(this.masterAnalyser, this.TfSoundAnalyserOptions);
                    await this.MasterSoundsContext.audioWorklet.addModule("https://tsunamiflow.club/JS/TFN/T/Class/Elder/Adult/TfNationProcessor.js");
                    this.masterAudioWorklet = new AudioWorkletNode(SoundsContext, "fft-processor", this.Workletoptions);

                    //this.masterAudioContextChain =
                    this.doctxok(this.MasterSoundsContext, this.ContextElement, this.masterGain, this.masterAnalyser, this.masterAudioWorklet, worker);
                }
            } else {
                console.error("the radio ContextElement is not the same as the one passed");
                this.ContextElement = this.MasterSoundsContext.createMediaElementSource(this.AudioElement);
                this.masterGain = this.MasterSoundsContext.createGain();
                this.masterGain.gain.value = 1;
                this.masterAnalyser = this.MasterSoundsContext.createAnalyser();
                Object.assign(this.masterAnalyser, this.TfSoundAnalyserOptions);
                await this.MasterSoundsContext.audioWorklet.addModule("https://tsunamiflow.club/JS/TFN/T/Class/Elder/Adult/TfNationProcessor.js");
                this.masterAudioWorklet = new AudioWorkletNode(SoundsContext, "fft-processor", this.Workletoptions);

                //this.masterAudioContextChain =
                this.doctxok(this.MasterSoundsContext, this.ContextElement, this.masterGain, this.masterAnalyser, this.masterAudioWorklet, worker);
            }
        } else {
            console.error("the radio SoundsContext is not the same as the one passed");
            if (SoundsContext !== typeof AudioContext) {
                if (this.MasterSoundsContext === typeof AudioContext) {

                } else {
                    this.MasterSoundsContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.ContextElement = this.MasterSoundsContext.createMediaElementSource(this.AudioElement);
                    this.masterGain = this.MasterSoundsContext.createGain();
                    this.masterGain.gain.value = 1;
                    this.masterAnalyser = this.MasterSoundsContext.createAnalyser();
                    Object.assign(this.masterAnalyser, this.TfSoundAnalyserOptions);
                    await this.MasterSoundsContext.audioWorklet.addModule("https://tsunamiflow.club/JS/TFN/T/Class/Elder/Adult/TfNationProcessor.js");
                    this.masterAudioWorklet = new AudioWorkletNode(SoundsContext, "fft-processor", this.Workletoptions);

                    //this.masterAudioContextChain =
                    this.doctxok(this.MasterSoundsContext, this.ContextElement, this.masterGain, this.masterAnalyser, this.masterAudioWorklet, worker);
                }
            } else {
                this.MasterSoundsContext = SoundsContext;
                this.ContextElement = this.MasterSoundsContext.createMediaElementSource(this.AudioElement);
                this.masterGain = this.MasterSoundsContext.createGain();
                this.masterGain.gain.value = 1;
                this.masterAnalyser = this.MasterSoundsContext.createAnalyser();
                Object.assign(this.masterAnalyser, this.TfSoundAnalyserOptions);
                await SoundsContext.audioWorklet.addModule("https://tsunamiflow.club/JS/TFN/T/Class/Elder/Adult/TfNationProcessor.js");
                this.masterAudioWorklet = new AudioWorkletNode(this.MasterSoundsContext, "fft-processor", this.Workletoptions);

                //this.masterAudioContextChain =
                this.doctxok(this.MasterSoundsContext, this.ContextElement, this.masterGain, this.masterAnalyser, this.masterAudioWorklet, worker);
            }
        }

        // ROUTING
        this.emit("ready", this.MasterSoundsContext);
        if (this.MasterSoundsContext.state === "suspended") {
            return this.MasterSoundsContext.resume();
        }
        this.AudioContextInitialized = true;
        return this.MasterSoundsContext;
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