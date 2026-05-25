import { TsunamiFlowSound } from "./Teen/Sound.js";
export class TsunamiFlowAudio extends TsunamiFlowSound {
    audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    };
    //context
    MasterCxtId = null;
    MasterSoundsContext = null;
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
    audio = null;
    MixerDestination = null;
    constructor(options = {}) {
        super(options);

        if (options.constraints) {
            this.audioConstraints = {
                ...this.audioConstraints,
                ...options.constraints
            };
        }

        if (options.SoundContext) {
            this.MasterSoundsContext = options.SoundContext;
        }

        if (options.masterGain) {
            this.masterGain = options.masterGain;
        }
        if (options.masterAnalyser) {
            this.masterAnalyser = options.masterAnalyser;
        }
        if (options.TfSoundWorklet) {
            this.TfSoundWorklet = options.TfSoundWorklet;
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
    initAudioContext() {
        if (!this.MasterSoundsContext) {
            this.MasterSoundsContext = new (window.AudioContext || window.webkitAudioContext)();
        }

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
        // ROUTING

        this.masterGain
            .connect(this.masterAnalyser)
            .connect(this.masterCompressor)
            .connect(this.masterAudioWorklet)
            .connect(this.MasterSoundsContext.destination);

        this.emit("ready", this.MasterSoundsContext);
        if (this.MasterSoundsContext.state === "suspended") {
            return this.MasterSoundsContext.resume();
        }
    }
    connectaudio(id, element) {
        if (this.TfSoundsContext[id]) return;
        this.addAudioContextSource(element, id);
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
    AudioState() {
        switch (this.TfSoundsContext[this.MasterCxtId]) {
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
                if (this.TfSoundsContext[this.MasterCxtId]) {
                    switch (this.TfSoundsContext[this.MasterCxtId].state) {
                        case "suspended":
                            this.TfSoundsContext[this.MasterCxtId].resume();
                            break;
                        case "running":
                            console.log("The audio context state is running");
                            if (this.AudioElement.waiting) {
                                this.TfSoundsContext[this.MasterCxtId].suspend();
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
    addAudioContextSource(element, id = null) {
        this.initAudioContext();

        const sourceId = id || `source-${++this.MasteridCounter}`;
        let source;

        if (this.elementSourceMap.has(element)) {
            source = this.elementSourceMap.get(element);
        } else {
            source = this.MasterSoundsContext.createMediaElementSource(element);
            this.elementSourceMap.set(element, source);
        }

        const chain = this.createTrackChain();

        // ✅ CLEAN SIGNAL FLOW
        source.connect(chain.gain)
            .connect(chain.analyser)
            .connect(chain.compressor)
            .connect(chain.worklet)
            .connect(chain.delay)
            .connect(chain.panner)
            .connect(this.masterGain);
        // ✅ STORE EVERYTHING (IMPORTANT)
        this.TfSoundsContext[sourceId] = source;
        this.TfSoundsGain[sourceId] = chain.gain;
        this.TfSoundAnalyser[sourceId] = chain.analyser;
        this.TfSoundsCompressor[sourceId] = chain.compressor;
        this.SoundWorklet[sourceId] = chain.worklet;
        this.TfSoundsDelay[sourceId] = chain.delay;
        this.TfSoundsPanner[sourceId] = chain.panner;

        this.emit("sourceAdded", { id: sourceId });

        return sourceId;
    }
    addAudioStreamSource(stream, id = null) {
        this.initAudioContext();
        const sourceId = id || `source-${++this.MasteridCounter}`;
        let source;

        if (this.elementSourceMap.has(stream)) {
            source = this.elementSourceMap.get(stream);
        } else {
            source = this.MasterSoundsContext.createMediaStreamSource(stream);
            this.elementSourceMap.set(stream, source);
        }

        const chain = this.createTrackChain();

        // ✅ CLEAN SIGNAL FLOW
        source.connect(chain.gain)
            .connect(chain.analyser)
            .connect(chain.compressor)
            .connect(chain.worklet)
            .connect(chain.delay)
            .connect(chain.panner)
            .connect(this.masterGain);
        // ✅ STORE EVERYTHING (IMPORTANT)
        this.TfSoundsContext[sourceId] = source;
        this.TfSoundsGain[sourceId] = chain.gain;
        this.TfSoundAnalyser[sourceId] = chain.analyser;
        this.TfSoundsCompressor[sourceId] = chain.compressor;
        this.SoundWorklet[sourceId] = chain.worklet;
        this.TfSoundsDelay[sourceId] = chain.delay;
        this.TfSoundsPanner[sourceId] = chain.panner;

        this.emit("sourceAdded", { id: sourceId });

        return sourceId;
    }
    setAudioContextGain(id, value = 1) {
        if (this.TfSoundsGain[id]) this.TfSoundsGain[id].gain.value = value;
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
        this.worker.postMessage(this.tycadome(
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

    updatePhysics(audio) {

        const force = audio.bass * 40;

        // PLAYER IMPULSE
        player.velocity.y -= force;

        // WORLD REACTION
        world.gravity = 1 + audio.mid;
        world.shake = audio.beat ? audio.volume * 10 : audio.volume * 2;

        // OBJECT INTERACTION
        particles.forEach(p => {
            p.dx += audio.treble * (Math.random() - 0.5);
            p.dy += audio.treble * (Math.random() - 0.5);
        });
    }

    updateGame(audio) {

        // BEAT = ACTION TRIGGER
        if (audio.beat) {
            this.triggerEvent("BEAT_HIT");
        }

        // DROP = GAME SHIFT
        if (audio.bass > 0.8) {
            this.triggerEvent("DROP");
        }

        // HIGH ENERGY MODE
        if (audio.volume > 0.3 && audio.treble > 0.6) {
            this.triggerEvent("HIGH_ENERGY");
        }
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
                world.timeScale = 0.5; // slow motion
                break;

            case "HIGH_ENERGY":
                unlockAbility("overdrive");
                break;
        }
    }
}