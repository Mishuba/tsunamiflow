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
    TfSoundsSource = {};
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
    createTrackChain(SoundsContext = this.MasterSoundsContext) {

        const chain = {
            gain: SoundsContext.createGain(),
            //analyser: SoundsContext.createAnalyser(),
            //compressor: SoundsContext.createDynamicsCompressor(),
            //delay: SoundsContext.createDelay(),
            //panner: SoundsContext.createStereoPanner(),
        };

        //Object.assign(chain.analyser, this.TfSoundAnalyserOptions);
        return chain;
    }
    doctxok(Gain, Analyser, worklet, worker, SoundsContext = this.MasterSoundsContext, Element = null, id = "radio") {
        Gain.connect(Analyser);
        Analyser.connect(worklet);

        worklet.connect(SoundsContext.destination);
        if (this.MixerDestination) {
            worklet.connect(this.MixerDestination);
        }

        worklet.port.onmessage = (message) => {
            if (worker) {
                this.onWorkletMessage(message, worker);
            }
        }
    }
    async initAudioContext(SoundsContext = this.MasterSoundsContext,
        worker = null, element = null, id = "radio", type = "audio") {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (this.AudioContextInitialized && this.MasterSoundsContext) {
            if (this.elementSourceMap.has(id)) {
                if (this.MasterSoundsContext.state === "suspended") {
                    await this.MasterSoundsContext.resume();
                }
            } else {
                if (element !== null) {
                    this.addAudioContextSource(element, id, type);
                } else {
                    console.log("the element is null" + Element);
                }
            }
            return this.MasterSoundsContext;
        }

        if (!(SoundsContext instanceof AudioContextClass)) {
            if (!(this.MasterSoundsContext instanceof AudioContextClass)) {
                this.MasterSoundsContext = new AudioContextClass();
            }
        } else {
            this.MasterSoundsContext = SoundsContext;
        }

        this.masterGain = this.MasterSoundsContext.createGain();
        this.masterGain.gain.value = 1;
        /*
        TfSoundsWaveShaper: SoundsContext.createWaveShaper(),
        TfSoundsOscillator: SoundsContext.createOscillator(),
          flowOscillator.type = "sine";
          flowOscillator.frequency.setValueAtTime(440, SoundsContext.currentTime);
          flowOscillator.start();
          masterPanner: SoundsContext.createPanner(),
          masterDelay: SoundsContext.createDelay(),
        */
        this.masterAnalyser = this.MasterSoundsContext.createAnalyser();
        Object.assign(this.masterAnalyser, this.TfSoundAnalyserOptions);
        await this.MasterSoundsContext.audioWorklet.addModule("https://tsunamiflow.club/JS/TFN/T/Class/Elder/Adult/TfNationProcessor.js");
        this.masterAudioWorklet = new AudioWorkletNode(this.MasterSoundsContext, "fft-processor", this.Workletoptions);
        this.MixerDestination = this.MasterSoundsContext.createMediaStreamDestination();

        //this.masterAudioContextChain =
        this.doctxok(this.masterGain, this.masterAnalyser, this.masterAudioWorklet, worker, this.MasterSoundsContext, element, id);

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

        if (this.elementSourceMap.has(id)) {
            //this.TfSoundsSource[id] = this.elementSourceMap.get(id);
            return sourceId;
        } else {
            if (type === "audio" || type === "video") {
                source = this.MasterSoundsContext.createMediaElementSource(element);
                this.elementSourceMap.set(id, source);
            } else if (type === "stream") {
                source = this.MasterSoundsContext.createMediaStreamSource(element);
                this.elementSourceMap.set(id, source);
            } else {
                throw new Error(`Unsupported audio source type: ${type}`);
            }
        }

        const chain = this.createTrackChain(this.MasterSoundsContext);

        // ✅ CLEAN SIGNAL FLOW
        source.connect(chain.gain);
        //.connect(chain.analyser).connect(chain.compressor)
        //.connect(chain.delay)
        //.connect(chain.panner)
        chain.gain.connect(this.masterGain);
        // ✅ STORE EVERYTHING (IMPORTANT)
        //this.TfSoundsContext[sourceId] = SoundsContext;
        this.TfSoundsSource[sourceId] = source;
        this.TfSoundsGain[sourceId] = chain.gain;
        //this.TfSoundAnalyser[sourceId] = chain.analyser;
        //this.TfSoundsCompressor[sourceId] = chain.compressor;
        //this.TfSoundsDelay[sourceId] = chain.delay;
        //this.TfSoundsPanner[sourceId] = chain.panner;

        //this.emit("sourceAdded", { id: sourceId });
        return sourceId;
    }
    removeSource(id) {
        const source = this.TfSoundsSource[id];
        const gain = this.TfSoundsGain[id];
        const analyser = this.TfSoundAnalyser[id];
        const compressor = this.TfSoundsCompressor[id];
        const worklet = this.SoundWorklet[id];
        const delay = this.TfSoundsDelay[id];
        const panner = this.TfSoundsPanner[id];

        source?.disconnect();
        gain?.disconnect();
        analyser?.disconnect();
        compressor?.disconnect();
        worklet?.disconnect();
        delay?.disconnect();
        panner?.disconnect();

        //delete this.TfSoundsContext[id];
        delete this.TfSoundsSource[id];
        delete this.TfSoundsGain[id];
        delete this.TfSoundAnalyser[id];
        delete this.TfSoundsCompressor[id];
        delete this.SoundWorklet[id];
        delete this.TfSoundsDelay[id];
        delete this.TfSoundsPanner[id];

        this.emit("sourceRemoved", id);
    }
    async HandleArrayBuffer(buffer, id) {
        let ctx = this.initAudioContext(this.MasterSoundsContext);

        try {
            const audioBuffer = await ctx.decodeAudioData(buffer);
            return new Float32Array(audioBuffer.getChannelData(0));
        } catch (error) {
            console.error("Error decoding audio data:", error);
            return null;
        }
    }

    AudioContextState(SoundsContext = this.MasterSoundsContext, element = this.AudioElement) {
        if (!SoundsContext) {
            console.log("The audio soundEngine context state does not exist");
        } else {
            switch (SoundsContext.state) {
                case "suspended":
                    console.log("The audio soundEngine context state is suspended, resuming...");
                    SoundsContext.resume();
                    break;
                case "running":
                    console.log("The audio soundEngine context state is running");
                    if (element.waiting) {
                        SoundsContext.suspend();
                    }
                    break;
                case "closed":
                    console.log("The Audio soundEngine context state must be closed");
                    if (element.paused) {
                        //this.StopVisualizator();
                    }
                    break;
                default:
                    console.log("The audio soundEngine context state is unknown");
                    break;
            }
        }

    }
    async playDecodedBuffer(id, float32Array, type, element, soundctx = this.MasterSoundsContext) {
        let ctx = await this.initAudioContext(soundctx);
        const buffer = ctx.createBuffer(
            1,
            float32Array.length,
            soundctx.sampleRate
        );

        buffer.copyToChannel(float32Array, 0);

        const source = this.TfSoundsSource[id].createBufferSource();
        source.buffer = buffer;

        const chain = this.createTrackChain(soundctx);

        source.connect(chain.gain);
        //.connect(chain.compressor)
        //.connect(chain.analyser);
        chain.gain.connect(this.masterGain);

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
    finishAudioContext(Gain) {
        if (!this.MasterSoundsContext) return;

        Object.values(this.TfSoundsSource).forEach(src => {
            if (src?.disconnect) {
                src?.disconnect();
            }

        });
        Object.values(this.TfSoundsGain).forEach(g => {
            g?.disconnect();
        });

        if (Gain) {
            Gain.disconnect();
        }

        SoundContext.close();

        this.TfSoundsSource = {};
        this.TfSoundsGain = {};
        this.TfSoundsDelay = {};
        this.TfSoundsPanner = {};
        this.TfSoundAnalyser = {};
        this.TfSoundsCompressor = {};
        this.SoundWorklet = {};

        this.AudioContextInitialized = false;

        this.MasterSoundsContext = null;
        this.ContextElement = null;
        this.masterGain = null;
        this.masterAnalyser = null;
        this.masterCompressor = null;
        this.masterAudioWorklet = null;
        this.MixerDestination = null;


        this.elementSourceMap = new WeakMap();

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
        switch (e.data.type) {
            case "audio.worklet":
                worker.postMessage(this.tycadome(
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