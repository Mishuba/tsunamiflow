export class TsunamiFlowNation extends Flow {
    // ===== DEFAULTS (Pattern B) =====
    SongList = null;
    randomMusicDefault = null;
    TfAudio = new Audio();
    AudioSource = null;
    AudioElement = null;
    AudioReady = null;

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
    TfSoundsContext =
        new (window.AudioContext || window.webkitAudioContext)();
    TfSoundsidCounter = 0;
    TfSoundsGain = null;
    TfSoundAnalyzer = null;
    TfSoundAnalyzerOptions = {
        fftSize: 2048,
        maxDecibels: 0,
        minDecibels: -100,
        smoothingTimeConstant: 0.5,
        channelCountMode: "max"
    };
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
    TfSoundsOutput = this.TfSoundsContext.destination;
    audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    };
    TfSoundsWorkletReady = false;

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

        // FIX: apply after instantiation
        this.TfAudio.crossOrigin = "anonymous";

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

        // ===== STREAM OUTPUT =====
        this.TfSoundsContextDestination =
            this.TfSoundsContext.createMediaStreamDestination();

        this.emit("ready", this.TfSoundsContext);
    }
    AudioNetworkState(element) {
        if (element.readyState === 0) {
            console.log("Radio readyState is HAVE_NOTHING aka no data yet.");
            if (element.networkState === 0) {
                console.log("Radio networkState has NETWORK_EMPTY");
                if (element.src === "") {
                    console.log("The radio source is ''");
                    this.worker.postMessage({ type: "radio", system: "file", file: "none", message: "the radio source is ''", buffer: "nothing should be buffering." });
                } else if (!element.src) {
                    ("The radio source does not exist");
                    this.worker.postMessage({ type: "radio", system: "file" });
                } else if (element.src === " ") {
                    console.log("The radio source is ' '");
                    this.worker.postMessage({ type: "radio", system: "file" });
                } else if (element.src === "about:blank") {
                    console.log("The radio source is about:blank");
                    this.worker.postMessage({ type: "radio", system: "file" });
                }
                else {
                    console.log("Something else is going on and I dont know what it is.");
                }
            } else if (element.networkState === 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (element.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE");
                //No valid source
                this.worker.postMessage({ type: "radio", system: "file" });
            }
        } else if (element.readyState === 1) {
            console.log("Radio readyState is HAVE_METADATA");
            if (element.networkState === 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (element.networkState === 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (element.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE (but during the have metadata point.");
                //No valid source
            }
        } else if (element.readyState === 2) {
            console.log("Radio readyState is HAVE_CURRENT_DATA");
            if (element.networkState === 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (element.networkState === 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (element.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE but during the have ;loading point.");
                //No valid source
            }
        } else if (element.readyState === 3) {
            console.log("Radio readyState is HAVE_FUTURE_DATA");
            if (element.networkState === 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (element.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplay point.");
                //No valid source
            }
        } else if (element.readyState === 4) {
            console.log("Radio readyState is HAVE_ENOUGH_DATA");
            if (element.networkState === 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (element.networkState === 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (element.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplaythrough point.");
                //No valid source
            }

            if (element.ended) {
                if (element.src === "") {
                    this.worker.postMessage({ type: "radio", system: "file" });
                } else if (element.src === undefined) {
                    this.worker.postMessage({ type: "radio", system: "file" });
                } else if (!element.src) {
                    this.worker.postMessage({ type: "radio", system: "file" });
                } else {
                    this.worker.postMessage({ type: "radio", system: "skip" });
                }
            } else {
                if (element.paused) {
                    if (element.currentTime === 0) {
                        console.log("Tsunami Radio has not started yet.");
                    } else {
                        console.log("Paused at " + element.currentTime);
                    }
                } else {
                    console.log("A song is still playing. Make the next song play using the functions");
                }
            }
        } else {
            if (element.networkState === 3) {
                console.log("The network could not find the source.");
                this.worker.postMessage({ type: "radio", system: "file" });
            } else {
                console.log("Some unknown error is going on with the Radio");
            }
        }
    }
    AudioFile(event) {
        this.randomMusicDefault = Math.floor(Math.random() * (DefaultPlaylist.length - 1));
        if (event.data.file == "undefined") {
            this.SongList = DefaultPlaylist[this.randomMusicDefault];
            console.log(`This should be a song from the default playlist in javascript <br />: ${this.SongList}`);
        } else if (event.data.file == undefined) {
            this.SongList = DefaultPlaylist[this.randomMusicDefault];
            console.log(`This should be a song from the default playlist in javascript <br /> ${this.SongList}`);
        } else if (event.data.file == "") {
            this.SongList = DefaultPlaylist[this.randomMusicDefault];
            console.log(`This should be a song from the default playlist in javascript <br /> ${this.SongList}`);
        } else if (event.data.file == "null") {
            this.SongList = DefaultPlaylist[this.randomMusicDefault];
            console.log(`This should be a song from the default playlist in javascript <br /> ${this.SongList}`);
        } else if (event.data.file == null) {
            this.SongList = DefaultPlaylist[this.randomMusicDefault];
            console.log(`This should be a song from the default playlist in javascript <br /> ${this.SongList}`);
        } else {
            this.SongList = event.data.file;
            console.log(`This should be a song from php ${this.SongList} <br /> typeof: ${typeof this.SongList}`);
        }
        return this.SongList;
    }
    AudioState(element) {
        if (this.TfSoundsContext.state === "suspended") {
            this.TfSoundsContext.resume();
        } else if (this.TfSoundsContext.state === "running") {
            console.log("The audio context state is running");
            if (element.waiting) {
                this.TfSoundsContext.suspend();
            }
        } else {
            console.log("The Audio context state must be closed");
            if (element.pause) {
                //this.StopVisualizator();
            }
        }
    }
    /// context
    addAudioContextSource(element, id = null) {
        const sourceId = id || `source-${++this.TfSoundsidCounter}`;
        const source = this.TfSoundsContext.createMediaElementSource(element);
        const gain = this.TfSoundsContext.createGain();
        source.connect(gain).connect(this.TfSoundsOutput);

        this.AudioSource[sourceId] = source;
        this.TfSoundsGain[sourceId] = gain;

        this.emit("sourceAdded", { id: sourceId, source, gain });
        return sourceId;
    }

    /* ----------------------------
       Add MediaStreamSource
    -----------------------------*/
    addAudioStreamSource(stream, id = null) {
        const sourceId = id || `source-${++this.TfSoundsidCounter}`;
        const source = this.TfSoundsContext.createMediaStreamSource(stream);
        const gain = this.TfSoundsContext.createGain();
        source.connect(gain).connect(this.TfSoundsOutput);

        this.AudioSource[sourceId] = source;
        this.TfSoundsGain[sourceId] = gain;

        this.emit("sourceAdded", { id: sourceId, source, gain });
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
        if (this.AudioSource[id]) {
            this.AudioSource[id].disconnect();
            this.TfSoundsGain[id].disconnect();
            delete this.AudioSource[id];
            delete this.TfSoundsGain[id];
            this.emit("sourceRemoved", id);
        }
    }
    finishAudioContext() {
        if (this.TfSoundsContext) {
            this.TfSoundsContext.close();
            this.TfSoundsContext = null;
            this.AudioSource = {};
            this.TfSoundsGain = {};
            this.TfSoundsOutput = null;
            this.emit("closed");
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
    async initWorklet(url, options = {}) {
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
    postMessage(message) {
        if (!this.TfSoundsWorkletNode) return;
        this.TfSoundsWorkletNode.port.postMessage(message);
    }
    ///worklet ends
}