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
    TfSoundsFloat32 = null;
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
    TfSoundWorklet = null;
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
        if (options.TfSoundWorklet) {
            this.TfSoundWorklet = options.TfSoundWorklet;
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
        this.TfSoundsFloat32 = new Float32Array(e.data);
        this.processAudioForVideo();
        //updateAnalyser();
        this.worker.postMessage(
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
                    dataArray: this.TfSoundContextDataArray,
                    dataArrayLength: this.TfSoundContextDataArray.length,
                    baseRadius: this.baseRadius,
                    particles: this.particles,
                    volume: this.TfSoundVolume
                }
            )
        );
    }
    processAudioForVideo() {
        this.TfSoundContextBufferLength = this.TfSoundsFloat32.length;
        let sum = 0;
        for (let i = 0; i < this.TfSoundContextBufferLength; i++) {
            sum += this.TfSoundsFloat32[i] * this.TfSoundsFloat32[i];
        }
        this.TfSoundVolume = Math.sqrt(sum / this.TfSoundContextBufferLength);
        this.TfSoundContextDataArray = new Uint8Array(this.TfSoundContextBufferLength / 4);
        this.TfSoundChunkSize = Math.floor(this.TfSoundContextBufferLength / this.TfSoundContextDataArray.length);

        for (let i = 0; i < this.TfSoundContextDataArray.length; i++) {
            this.TfSoundchunkSum = 0;
            for (let j = 0; j < this.TfSoundChunkSize; j++) {
                this.TfSoundSample = this.TfSoundsFloat32[i * this.TfSoundChunkSize + j] || 0;
                this.TfSoundchunkSum += Math.abs(this.TfSoundSample);
            }
            this.TfSoundContextDataArray[i] = Math.min(255, this.TfSoundchunkSum * 400);
        }
    }
    // game logic below
    extractBands(fft) {
        const bassEnd = 8;
        const midEnd = 64;

        let bass = 0;
        let mid = 0;
        let treble = 0;

        for (let i = 0; i < fft.length; i++) {
            if (i < bassEnd) bass += fft[i];
            else if (i < midEnd) mid += fft[i];
            else treble += fft[i];
        }

        return {
            bass: bass / bassEnd,
            mid: mid / (midEnd - bassEnd),
            treble: treble / (fft.length - midEnd)
        };
    }


    normalize(value, smoothing = 0.2, prev = 0) {
        return prev + (value - prev) * smoothing;
    }

    updatePhysics(bass) {
        const force = bass * 50;

        player.velocity.y -= force;   // jump impulse
        world.shake = force * 0.1;    // camera shake
    }

    updateEnemies(mid) {
        if (mid > 0.6) {
            spawnEnemyWave();
        }

        enemies.forEach(e => {
            e.speed = 1 + mid * 3;
        });
    }

    updateVisuals(treble) {
        particles.spawnRate = treble * 100;

        if (treble > 0.8) {
            triggerLaserEffect();
        }
    }

    detectBeat(bass) {
        if (bass > 0.7 && lastBass <= 0.7) {
            triggerEvent("BEAT_HIT");
        }

        lastBass = bass;
    }

    triggerEvent(type) {
        switch (type) {
            case "BEAT_HIT":
                spawnShockwave();
                break;

            case "DROP":
                activateSlowMotion();
                break;

            case "HIGH_ENERGY":
                unlockAbility();
                break;
        }
    }
}