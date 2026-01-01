import { DefaultPlaylist } from "./../JS/Arrays.js";
export class TfMusic {
    constructor(AudioContext = null, AudioAnalyser = null, AudioMedia = null) {
        this.textTrackOptions = {
            kind: "subtitles", // caption, descriptions, chapters, metadata
            label: "name",
            language: "en", //
        };
        this.TsunamiRadioAudio = AudioContext;
        this.TsunamiGain;
        this.audioAnalyzerOptions = {
            fftSize: 2048,
            maxDecibels: 0, // 0 is the loudest
            minDecibels: -100, // 0 is the loudest 
            smoothingTimeConstant: 0.5, // between 0 and 1
            //channelCount: ,
            channelCountMode: "max",
            //channelInterpretation: ,
            //disableNormalization: true
        };
        this.TsunamiAnalyser = AudioAnalyser;
        this.periodicWaveOptions = {
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers",
            disableNormalization: true,
        };
        this.TsunamiPanner;
        this.TsunamiDelay;
        this.TsunamiCompressor;
        this.TsunamiRadioMedia = AudioMedia;
        this.TFpwoImag;
        this.TFaudioBuffer;
        this.RadioChannel1;
        this.TfRcCopy1;
        this.RadioChannel2;
        this.TsunamiCtxSrc;
        this.TsunamiRadioDataArray;
        this.TfNextPlayTime = 0;
        this.x = 0;
        this.y;
        this.dx; // x velocity
        this.dy; // y velocity
        this.radius;
        this.baseRadius;
        this.color;
        this.particles = [];
        this.visualizatorController;
        this.SongList1st;
        this.SongList;
        this.Timing;
        this.RadioProcessBar;
        this.TaudioFtime;
        this.TsunamiRadioBufferLength;
        this.randomMusicDefault;
        //this.float32FromIterable = new Float32Array(this.TFgameIterable());

        //this.TFperiodicWave = context.createPeriodicWave(this.TFpwoReal, this.TFpwoImag, this.TFperiodicWaveOptions)
        /*
                this.TFoscillatorNodeOptions = {
                    type: "sine", //"square", "sawtooth", "triangle", "custom" //default is "sine";
                    detune: 0,
                    frequency: 440,
                    periodicWave: this.TFperiodicWave,
                    channelCount: 2,
                    channelCountMode: "max", // max, something , huh
                    channelInterpretation: "speakers"
                };
                */
        this.TFWaveShaperNodeOptions = {
            //curve: 0.5, // -1, 1
            oversample: "none", // "none", "2x", "4x",
            channelCount: "2", //
            channelCountMode: "max",
            //channelInterpretation: "speaker"
        };
        this.Game2dPannerOptions = { pan: 0 }; // -1 = far left, 1 = far right;
        this.TFdelayNodeOptions = {
            delayTime: 0,
            maxDelayTime: 1,
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers"
        };
        this.TFdynamicsCompressorNodeOptions = {
            attack: 0.003, // 0-1
            knee: 30, //0 - 40
            ratio: 12, // 1  - 20
            release: 0.250, // 0-1
            threshold: -24 // -100 - 0
        };
        this.WeLive = false;
        this.LiveAudioLink;
    }
    startMusic(element) {
        if (element.paused) {
            element.play().catch(async (error) => {
                if (error.name === "NotAllowedError") {
                    console.log("Autoplay is blocked. Please interact with the page to start the radio.");
                } else {
                    console.error("Error playing audio:", error);
                }
            });
        } else if (element.ended) {
            if (element.currentTime === 0) {
                element.play().catch(async (error) => {
                    if (error.name === "NotAllowedError") {
                        console.log("Autoplay is blocked. Please interact with the page to start the radio.");
                    } else {
                        console.error("Error playing audio:", error);
                    }
                });
            } else {
                element.play().catch(async (error) => {
                    if (error.name === "NotAllowedError") {
                        console.log("Autoplay is blocked. Please interact with the page to start the radio.");
                    } else {
                        console.error("Error playing audio:", error);
                    }
                });
            }
        } else {
            element.play().catch(async (error) => {
                if (error.name === "NotAllowedError") {
                    console.log("Autoplay is blocked. Please interact with the page to start the radio.");
                } else {
                    console.error("Error playing audio:", error);
                }
            });
        }
    }
    stopMusic(element) {
        if (!element.paused) {
            element.pause();
        }
    }
    previousSong(element, music) {
        element.src = music;
        element.play();
    }
    restartSong(element, music) {
        element.src = music;
        element.play();
    }
    MusicNetworkState(RadioWorker, element) {
        if (element.readyState === 0) {
            console.log("Radio readyState is HAVE_NOTHING aka no data yet.");
            if (element.networkState == 0) {
                console.log("Radio networkState has NETWORK_EMPTY");
                if (element.src == "") {
                    console.log("The radio source is ''");
                    RadioWorker.postMessage({ type: "radio", system: "file", file: "none", message: "the radio source is ''", buffer: "nothing should be buffering." });
                } else if (!element.src) {
                    ("The radio source does not exist");
                    RadioWorker.postMessage({ type: "radio", system: "file" });
                } else if (element.src == " ") {
                    console.log("The radio source is ' '");
                    RadioWorker.postMessage({ type: "radio", system: "file" });
                } else if (element.src == "about:blank") {
                    console.log("The radio source is about:blank");
                    RadioWorker.postMessage({ type: "radio", system: "file" });
                }
                else {
                    console.log("Something else is going on and I dont know what it is.");
                }
            } else if (element.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (element.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE");
                //No valid source
                RadioWorker.postMessage({ type: "radio", system: "file" });
            }
        } else if (element.readyState === 1) {
            console.log("Radio readyState is HAVE_METADATA");
            if (element.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (element.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (element.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE (but during the have metadata point.");
                //No valid source
            }
        } else if (element.readyState === 2) {
            console.log("Radio readyState is HAVE_CURRENT_DATA");
            if (element.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (element.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (element.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE but during the have ;loading point.");
                //No valid source
            }
        } else if (element.readyState === 3) {
            console.log("Radio readyState is HAVE_FUTURE_DATA");
            if (element.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (element.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplay point.");
                //No valid source
            }
        } else if (element.readyState === 4) {
            console.log("Radio readyState is HAVE_ENOUGH_DATA");
            if (element.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (element.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (element.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplaythrough point.");
                //No valid source
            }

            if (element.ended) {
                if (element.src = "") {
                    RadioWorker.postMessage({ type: "radio", system: "file" });
                } else if (element.src = undefined) {
                    RadioWorker.postMessage({ type: "radio", system: "file" });
                } else if (!element.src) {
                    RadioWorker.postMessage({ type: "radio", system: "file" });
                } else {
                    RadioWorker.postMessage({ type: "radio", system: "skip" });
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
                RadioWorker.postMessage({ type: "radio", system: "file" });
            } else {
                console.log("Some unknown error is going on with the Radio");
            }
        }
    }
    MusicFile(event) {
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
    MusicState(element) {
        if (this.TsunamiRadioAudio.state === "suspended") {
            this.TsunamiRadioAudio.resume();
        } else if (this.TsunamiRadioAudio.state === "running") {
            console.log("The audio context state is running");
            if (element.waiting) {
                this.TsunamiRadioAudio.suspend();
            }
        } else {
            console.log("The Audio context state must be closed");
            if (element.pause) {
                this.StopVisualizator();
            }
        }
    }
    emptiedAudio(empty) {
        console.log("The audio is empty" + empty);
    }
    loadstartAudio(element) {

        this.MusicState(element);
        let RadioLoadStartTime = Date.now();
        console.log("Load start time recorded:", RadioLoadStartTime);
    }
    loadedmetadataAudio(element) {
        //create html data
        this.MusicState(element);
    }
    loadeddataAudio(element) {
        console.log("The audio data is loaded");
        this.MusicState(element);
    }
    canplayAudio(element) {
        this.MusicState(element);
    }
    canplaythroughAudio(element) {
        this.MusicState(element);
        this.startMusic(element);
    }
    playAudio(element) {
        this.MusicState(element);
        this.startMusic(element);
    }
    pauseAudio(element) {
        this.MusicState(element);
        this.stopMusic(element);
    }
    endedAudio(element, worker) {
        console.log("The audio should have ended");
        element.src = "";
        worker.postMessage({ type: "radio", system: "file" });
    }
    waitingAudio(element) {
        this.MusicState(element);
    }
    playingAudio(element, canvas) {
        this.MusicState(element);
        this.TsunamiRadioBufferLength = this.TsunamiAnalyser.frequencyBinCount;
        this.TsunamiRadioDataArray = new Uint8Array(this.TsunamiRadioBufferLength);
        if (canvas !== null) {
            let ctx = canvas.getContext("2d");
            return ctx;
        } else {
            let ctx = canvas.getContext("2d");
            return ctx;
        }
    }
    stalledAudio(stalled) {
        console.log("The Tsunami Audio has stalled for some reason" + stalled);
    }
    suspendedAudio(suspend) {
        console.log("The audio is suspended" + suspend);
    }
    FormatAudioTime(second) {
        let minutes = Math.floor(second / 60);
        let seconds = second % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    timeupdateAudio(element) {
        this.Timing = Math.floor(element.currentTime);
        this.RadioProcessBar = (element.currentTime / element.duration) * 100;
        this.TaudioFtime = `Time: ${this.FormatAudioTime(this.Timing)}`
    }
    volumechangeAudio() {
        console.log("The volume has changed");
    }
    RadioWorkerReceivedMessage(event) {
        if (typeof event.data.file == undefined) {
            this.SongList1st = this.MusicFile(event);
        } else if (typeof event.data.file == null) {
            this.SongList1st = this.MusicFile(event);
        } else if (typeof event.data.file == "string") {
            this.SongList1st = this.MusicFile(event);
        } else {
            this.SongList1st = this.MusicFile(event);
        }
        console.log(this.SongList1st + " is the source of the current song.");
        return this.SongList1st;
    }
    StartLiveAudio(element) {
        if (this.WeLive) {
            return;
        } else {
            this.WeLive = true;
            element.src = "https://world.tsunamiflow.club/hls/anything.m3u8";
            //start audio with method
        }
    }
    StopLiveAudio(element) {
        if (!this.WeLive) {
            this.WeLive = false;
            element.pause();
            element.src = "";
        } else {

        }
    }
    handleSocketMessage(data) {
        if (data.type === "live_stream") {
            if (data.live) {
                this.StartLiveAudio("wss://world.tsunamiflow.club/websocket");
            } else {
                this.stopLiveStream();
            }
        }
    }
    attachSocketListeners() {
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleSocketMessage(data);
        };
    }
    HandleArrayBuffer(buffer) {
        if (this.TsunamiRadioAudio.state === "suspended") {
            this.TsunamiRadioAudio.resume();

            try {
                this.TFaudioBuffer = this.TsunamiRadioAudio.decodeAudioData(buffer);

                //this.RadioChannel1 = this.TFaudioBuffer.getChannelData(0);
                //this.TfRcCopy1 = new Float32Array(this.RadioChannel1);

                //this.RadioChannel2 = this.TFaudioBuffer.getChannelData(1);
            } catch (error) {

                console.error("Error decoding audio data: ", error);
            } finally {
                return this.TfRcCopy1;
            }
        }
    }
    RadioWorkerArrayBuffer(buffer) {
        //decode audio data (get AudioBuffer);
        let decode = this.HandleArrayBuffer(buffer, this.TsunamiRadioAudio);
        //Visualizator
        this.TFpwoImag = new Float32Array(buffer);
        return decode;
    }
    TfScheduleBuffer(buffer) {
        this.TsunamiCtxSrc = this.TsunamiRadioAudio.createBufferSource();
        this.TsunamiCtxSrc.buffer = buffer;
    }

    BeginRadio(element, song) {
        element.crossOrigin = "anonymous";
        element.src = song;
    }
}